import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/hooks/useTheme";
import { auth } from "../services/firebaseConfig";
import {
  addLangExchangeRequest,
  getLangExchangeRequests,
  deleteLangExchangeRequest,
  getUserRequests,
} from "../services/langExchangeRequests";
import { NotLoggedIN } from "@/components";

interface Request {
  id: string;
  userId: string;
  name: string;
  region: string;
  targetLanguage: string;
  description?: string;
}

export default function ConnectScreens(): JSX.Element {
  const theme = useTheme();
  const navigation = useNavigation();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tab, setTab] = useState<"chats" | "langExchange">("chats");
  const [requests, setRequests] = useState<Request[]>([]);
  const [userRequests, setUserRequests] = useState<Request[]>([]);
  const [requestDetails, setRequestDetails] = useState({
    name: "",
    region: "",
    targetLanguage: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state

  useEffect(() => {
    if (!auth.currentUser) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  }, [navigation]);

  // Fetch requests function for both tabs (refresh logic)
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const fetchedRequests = await getLangExchangeRequests();
      setRequests(fetchedRequests as Request[]);

      if (auth.currentUser) {
        const fetchedUserRequests = await getUserRequests(auth.currentUser.uid);
        setUserRequests(fetchedUserRequests as Request[]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [tab]);

  const handleCreateRequest = async () => {
    const { name, region, targetLanguage, description } = requestDetails;
    if (!name.trim() || !region.trim() || !targetLanguage.trim()) {
      Alert.alert("Error", "Name, region, and target language are required.");
      return;
    }
    try {
      await addLangExchangeRequest(
        auth.currentUser?.uid || "",
        name,
        region,
        targetLanguage,
        description
      );
      Alert.alert("Success", "Request created successfully!");
      setRequestDetails({
        name: "",
        region: "",
        targetLanguage: "",
        description: "",
      });
      setIsModalVisible(false); // Close modal after successful request creation
      fetchRequests(); // Refetch after creation
    } catch (error: any) {
      Alert.alert("Error", error.message || "Unable to create request.");
    }
  };

  const handleDeleteRequest = async (requestId: string) => {
    try {
      await deleteLangExchangeRequest(requestId);
      Alert.alert("Success", "Request deleted successfully!");
      fetchRequests(); // Refetch after deletion
    } catch (error: any) {
      Alert.alert("Error", error.message || "Unable to delete request.");
    }
  };

  return isLoggedIn ? (
    <View className="flex-1 bg-lightBackground text-darkBackground items-center justify-center">
      <Text className="text-5xl text-darkBackground font-heartful">
        Coming Soon...
      </Text>
    </View>
  ) : (
    // <SafeAreaView className={`flex-1 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
    //   {/* Header */}
    //   <View className="flex-row justify-around py-4 border-b">
    //     {["chats", "langExchange"].map((tabType) => (
    //       <TouchableOpacity
    //         key={tabType}
    //         onPress={() => setTab(tabType as "chats" | "langExchange")}
    //         className={`py-2 border-b-2 ${
    //           tab === tabType
    //             ? theme === "dark"
    //               ? "border-white"
    //               : "border-black"
    //             : "border-transparent"
    //         }`}
    //       >
    //         <Text className={`text-lg ${theme === "dark" ? "text-white" : "text-black"}`}>
    //           {tabType === "chats" ? "Chats" : "Language Exchange"}
    //         </Text>
    //       </TouchableOpacity>
    //     ))}
    //   </View>

    //   {/* Content */}
    //   {tab === "langExchange" ? (
    //     <FlatList
    //       data={requests}
    //       keyExtractor={(item) => item.id}
    //       renderItem={({ item }) => (
    //         <View className="flex-row justify-between items-center p-4 border-b">
    //           <Text className={`text-lg ${theme === "dark" ? "text-white" : "text-black"}`}>
    //             {item.name} ({item.region})
    //           </Text>
    //           <TouchableOpacity
    //             className="bg-blue-500 py-2 px-4 rounded-md"
    //             onPress={() => {
    //               Alert.alert("Messaging", `Messaging ${item.name}`);
    //             }}
    //           >
    //             <Text className="text-white">Message</Text>
    //           </TouchableOpacity>
    //         </View>
    //       )}
    //       ListEmptyComponent={
    //         <Text className={`text-center mt-4 ${theme === "dark" ? "text-white" : "text-black"}`}>
    //           No requests available
    //         </Text>
    //       }
    //       refreshing={loading}
    //       onRefresh={fetchRequests}
    //     />
    //   ) : (
    //     <FlatList
    //       data={userRequests}
    //       keyExtractor={(item) => item.id}
    //       renderItem={({ item }) => (
    //         <View className="flex-row justify-between items-center p-4 border-b">
    //           <Text className={`text-lg ${theme === "dark" ? "text-white" : "text-black"}`}>
    //             {item.name} ({item.region})
    //           </Text>
    //           <TouchableOpacity
    //             className="bg-red-500 py-2 px-4 rounded-md"
    //             onPress={() => handleDeleteRequest(item.id)}
    //           >
    //             <Text className="text-white">Delete</Text>
    //           </TouchableOpacity>
    //         </View>
    //       )}
    //       ListEmptyComponent={
    //         <Text className={`text-center mt-4 ${theme === "dark" ? "text-white" : "text-black"}`}>
    //           No requests available
    //         </Text>
    //       }
    //       refreshing={loading}
    //       onRefresh={fetchRequests}
    //     />
    //   )}

    //   {/* Create Request Button */}
    //   <TouchableOpacity
    //     className="bg-green-500 py-3 rounded-md fixed bottom-10 right-10"
    //     onPress={() => setIsModalVisible(true)} // Open the modal when clicked
    //   >
    //     <Text className="text-center text-white text-lg">Create Request</Text>
    //   </TouchableOpacity>

    //   {/* Create Request Modal */}
    //   <Modal
    //     animationType="slide"
    //     transparent={true}
    //     visible={isModalVisible}
    //     onRequestClose={() => setIsModalVisible(false)} // Close modal when request is closed
    //   >
    //     <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
    //       <View className="bg-white p-6 rounded-md w-80">
    //         <TextInput
    //           placeholder="Name"
    //           className="p-3 rounded-md bg-gray-200 mb-2"
    //           placeholderTextColor={theme === "dark" ? "#121212" : "#FFFFFF"}
    //           value={requestDetails.name}
    //           onChangeText={(text) => setRequestDetails({ ...requestDetails, name: text })}
    //         />
    //         <TextInput
    //           placeholder="Region"
    //           className="p-3 rounded-md bg-gray-200 mb-2"
    //           placeholderTextColor={theme === "dark" ? "#121212" : "#FFFFFF"}
    //           value={requestDetails.region}
    //           onChangeText={(text) => setRequestDetails({ ...requestDetails, region: text })}
    //         />
    //         <TextInput
    //           placeholder="Target Language"
    //           className="p-3 rounded-md bg-gray-200 mb-2"
    //           placeholderTextColor={theme === "dark" ? "#121212" : "#FFFFFF"}
    //           value={requestDetails.targetLanguage}
    //           onChangeText={(text) => setRequestDetails({ ...requestDetails, targetLanguage: text })}
    //         />
    //         <TextInput
    //           placeholder="Description (Optional)"
    //           className="p-3 rounded-md bg-gray-200 mb-4"
    //           placeholderTextColor={theme === "dark" ? "#121212" : "#FFFFFF"}
    //           value={requestDetails.description}
    //           onChangeText={(text) => setRequestDetails({ ...requestDetails, description: text })}
    //         />
    //         <TouchableOpacity
    //           className="bg-green-500 py-3 rounded-md"
    //           onPress={handleCreateRequest}
    //         >
    //           <Text className="text-center text-white text-lg">Create Request</Text>
    //         </TouchableOpacity>
    //         <Pressable
    //           className="mt-4 bg-red-500 py-3 rounded-md"
    //           onPress={() => setIsModalVisible(false)} // Close modal on press
    //         >
    //           <Text className="text-center text-white text-lg">Close</Text>
    //         </Pressable>
    //       </View>
    //     </View>
    //   </Modal>
    // </SafeAreaView>
    <NotLoggedIN />
  );
}
