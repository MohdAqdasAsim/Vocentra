import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { useTheme } from "@/hooks/useTheme"; // Assuming useTheme hook is available
import NotLoggedIN from "@/components/NotLoggedIN";

interface UserData {
  displayName: string;
  email: string;
  language: string;
}

export default function ProfileScreen() {
  const theme = useTheme();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(false);
  const [newDisplayName, setNewDisplayName] = useState<string>("");
  const [newEmail, setNewEmail] = useState<string>("");
  const [newLanguage, setNewLanguage] = useState<string>("");
  const [showAboutModal, setShowAboutModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        try {
          setIsLoggedIn(true);
          const db = getFirestore();
          const userDocRef = doc(db, `users/${user.uid}`);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              displayName: userData.name || "No name available",
              email: userData.email || "No email available",
              language: userData.language || "English",
            });

            setNewDisplayName(userData.name || "");
            setNewEmail(userData.email || "");
            setNewLanguage(userData.language || "English");
          } else {
            console.warn("User document does not exist");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setIsLoggedIn(false);
      }
      setIsLoading(false);
    };

    fetchUserData();
  }, []);

  const handleSaveChanges = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        const db = getFirestore();
        const userDocRef = doc(db, `users/${user.uid}`);

        await updateDoc(userDocRef, {
          name: newDisplayName,
          email: newEmail,
          language: newLanguage,
        });

        setUser({
          displayName: newDisplayName,
          email: newEmail,
          language: newLanguage,
        });
        setEditing(false);
      } catch (error) {
        console.error("Error updating user data:", error);
      }
    }
  };

  const toggleTheme = () => {
    theme === "dark" ? "light" : "dark";
  };

  if (isLoading) {
    return (
      <SafeAreaView className={`flex-1 ${theme === "dark" ? "bg-darkBackground" : "bg-lightBackground"}`}>
        <ActivityIndicator size="large" color={theme === "dark" ? "white" : "black"} />
      </SafeAreaView>
    );
  }

  if (!isLoggedIn || !user) {
    return <NotLoggedIN />;
  }

  return (
    <SafeAreaView className={`flex-1 ${theme === "dark" ? "bg-darkBackground" : "bg-lightBackground"}`}>
      <View className="flex items-center justify-center py-6">
        <Text className={`text-4xl font-heartful ${theme === "dark" ? "text-white" : "text-black"}`}>Profile</Text>
      </View>

      <View className="px-4 gap-6">
        <View className={`p-4 rounded-xl ${theme === "dark" ? "bg-gray-800" : "bg-gray-200"}`}>
          {editing ? (
            <>
              <TextInput
                value={newDisplayName}
                onChangeText={setNewDisplayName}
                className={`text-2xl font-heartful ${theme === "dark" ? "text-white" : "text-black"}`}
                placeholder="Enter your name"
              />
              <TextInput
                value={newEmail}
                onChangeText={setNewEmail}
                className={`text-xl font-heartful opacity-60 ${theme === "dark" ? "text-white" : "text-black"}`}
                placeholder="Enter your email"
              />
              <TextInput
                value={newLanguage}
                onChangeText={setNewLanguage}
                className={`text-xl font-heartful opacity-60 ${theme === "dark" ? "text-white" : "text-black"}`}
                placeholder="Enter your language"
              />
            </>
          ) : (
            <>
              <Text className={`text-2xl font-heartful ${theme === "dark" ? "text-white" : "text-black"}`}>
                {user.displayName}
              </Text>
              <Text className={`text-xl font-heartful opacity-60 ${theme === "dark" ? "text-white" : "text-black"}`}>
                {user.email}
              </Text>
              <Text className={`text-xl font-heartful opacity-60 ${theme === "dark" ? "text-white" : "text-black"}`}>
                Language: {user.language}
              </Text>
            </>
          )}
        </View>
      </View>

      <View className="px-4 py-6">
        {editing ? (
          <TouchableOpacity className="bg-blue-500 p-3 rounded-xl" onPress={handleSaveChanges}>
            <Text className="text-center text-white font-bold text-lg">Save Changes</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity className="bg-green-500 p-3 rounded-xl" onPress={() => setEditing(true)}>
            <Text className="text-center text-white font-bold text-lg">Edit Profile</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity className="mt-4 bg-purple-500 p-3 rounded-xl" onPress={() => setShowAboutModal(true)}>
          <Text className="text-center text-white font-bold text-lg">About</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showAboutModal} transparent={true}>
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-lg">
            <Text className="text-lg font-bold">About This App</Text>
            <Text className="mt-4">This app helps you manage your profile and settings effectively.</Text>
            <TouchableOpacity
              className="mt-4 bg-red-500 p-2 rounded-xl"
              onPress={() => setShowAboutModal(false)}
            >
              <Text className="text-center text-white font-bold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
