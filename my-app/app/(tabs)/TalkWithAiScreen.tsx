import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { NotLoggedIN } from "@/components";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@/hooks/useTheme";
import { StatusBar } from "expo-status-bar";

const TalkWithAiScreen = () => {
  const theme = useTheme();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return isLoggedIn ? (
    <View
      className={`flex-1 ${
        theme === "dark" ? "bg-darkBackground" : "bg-lightBackground"
      } items-center justify-start px-4`}
    >
      <View className="w-full h-56 items-start gap-2 flex-row mb-6 mt-16">
        <View className="w-1/2 h-full bg-red-100 items-center rounded-3xl shadow-lg justify-center">
          <Image
            source={require("@/assets/images/mascot-2.png")}
            className="w-full h-full scale-x-[-1]"
            resizeMode="contain"
          />
        </View>
        <View className={`w-1/2 h-full items-center rounded-3xl shadow-lg justify-center ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
          <Text
            className={`font-heartful text-4xl text-center${
              theme === "dark" ? "text-white" : "text-darkBackground"
            } mt-2`}
          >
            Hi there! Ready to start your journey to fluency?
          </Text>
        </View>
      </View>

      <View className={`w-full h-64 flex-row bg-gray-100 items-center rounded-3xl shadow-lg justify-center ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
        <View className="w-[45%] flex-1 p-2 h-full items-center justify-center">
          <Text
          className={`text-5xl mb-2 font-heartful ${
            theme === "dark" ? "text-white" : "text-darkBackground"
          }`}
        >
          Vocentra
        </Text>
        <Text
          className={`text-lg text-center font-heartful ${
            theme === "dark" ? "text-gray-400" : "text-gray-700"
          }`}
        >
          Enhance your language skills with AI-powered conversations. Tap the
          button below to start talking with your virtual language coach!
        </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push("/pages/AiPage")}
          className={`w-28 h-28 mr-8 ${
            theme === "dark" ? "border-white" : "border-darkBackground"
          } rounded-full items-center justify-center border-4`}
        >
          <MaterialCommunityIcons
            name="play"
            size={78}
            color={theme === "dark" ? "#FFFFFF" : "#121212"}
          />
        </TouchableOpacity>
      </View>
      <StatusBar style="dark" />
    </View>
  ) : (
    <NotLoggedIN />
  );
};

export default TalkWithAiScreen;
