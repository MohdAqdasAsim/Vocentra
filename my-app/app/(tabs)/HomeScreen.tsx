import { StatusBar } from "expo-status-bar";
import { Text, TouchableOpacity, View, Image } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../services/firebaseConfig";

// Sample array of tips
const tips = [
  "🌟 Practice fluency by speaking for 1 minute without stopping. Focus on getting your message across!",
  "📚 Learn new words daily and use them in sentences to improve your vocabulary!",
  "🎧 Listen to native speakers and try to mimic their pronunciation for better accent.",
  "📝 Write daily in your target language to improve writing and grammar skills.",
  "💬 Engage in short conversations with friends or AI to build confidence!"
];

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [userName, setUserName] = useState("User");

  // Get today's tip (for simplicity, using a fixed index based on the date)
  const todayTip = tips[new Date().getDate() % tips.length];

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const userDocRef = doc(db, "users", user.uid); // Adjust the path if needed
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserName(userData.name || "User");
          } else {
            console.log("User document does not exist.");
          }
        }
      } catch (error) {
        console.error("Error fetching user name:", error);
      }
    };

    fetchUserName();
  }, []);

  return (
    <SafeAreaView
      className={`flex-1 items-center ${
        theme === "dark" ? "bg-darkBackground" : "bg-lightBackground"
      }`}
    >
      <View className="flex items-center justify-center bg-gray-100 shadow-black shadow-lg w-[90%] h-16 mb-2 rounded-lg">
        <Text
          className={`text-5xl mt-4 font-heartful ${
            theme === "dark" ? "text-white" : "text-black"
          }`}
        >
          Welcome, {userName}!
        </Text>
      </View>

      <View className="w-full h-80 flex flex-row items-center justify-start p-6 gap-2 pl-4">
        <View className="flex items-center justify-center bg-gray-100 shadow-black shadow-lg w-1/2 h-full rounded-lg">
          <Image
            source={require("@/assets/images/mascot-1.png")}
            className="w-full h-full scale-x-[-1]"
          />
        </View>
        <View className="flex items-center justify-center bg-gray-100 shadow-black shadow-lg w-1/2 h-full rounded-lg">
          <Text
            className={`text-3xl mt-4 font-heartful ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            Hi! I'm your learning buddy. Ready to learn a new language!
          </Text>
        </View>
      </View>

      {/* Main Content */}
      <View className="flex-1 px-4">
        {/* Quick Actions */}
        <View className="gap-4">
          <TouchableOpacity
            className={`p-4 rounded-xl ${
              theme === "dark" ? "bg-lightBackground" : "bg-darkBackground"
            }`}
            activeOpacity={0.7}
            onPress={() => router.push("/pages/AiPage" as any)}
          >
            <Text className={`text-center font-heartful text-2xl font-semibold ${theme === "dark" ? "text-darkBackground" : "text-white"}`}>
              Start a Conversation
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tips Section */}
        <View
          className={`mt-6 p-4 rounded-lg shadow-sm ${
            theme === "dark" ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          <Text
            className={`text-3xl font-heartful ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            💡 Tips for Today
          </Text>
          <Text
            className={`text-2xl mt-2 font-heartful ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            {todayTip}
          </Text>
        </View>
      </View>

      <StatusBar style={theme === "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
}
