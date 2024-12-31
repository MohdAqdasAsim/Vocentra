import { useTheme } from "@/hooks/useTheme";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Text,
  useColorScheme,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";

const { width, height } = Dimensions.get("window");

const OnBoardingPage = () => {
  const colorScheme = useTheme();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Function to handle the "Get Started" button press (show modal)
  const handleGetStarted = () => {
    setIsModalVisible(true);
  };

  // Function to navigate to the login page
  const navigateToLogin = () => {
    setIsModalVisible(false);
    router.push("/"); // Redirect to login screen
  };

  // Function to navigate to the signup page
  const navigateToSignup = () => {
    setIsModalVisible(false);
    router.push("/"); // Redirect to signup screen
  };

  return (
    <SafeAreaView
      className={`flex-1 relative ${
        colorScheme === "dark" ? "bg-darkBackground" : "bg-lightBackground"
      }`}
    >
      <Swiper
        loop={false}
        paginationStyle={{ bottom: 20 }}
        activeDotColor={colorScheme === "dark" ? "#FFFFFF" : "#1F2937"}
        dotColor={colorScheme === "dark" ? "#9d9d9d" : "#9d9d9d"}
        onIndexChanged={(index) => setCurrentIndex(index)} // Track current slide index
      >
        <View
          style={{
            width: width,
            height: height,
          }}
          className={`flex-1 pt-4 items-center justify-start ${
            colorScheme === "dark" ? "bg-darkBackground" : "bg-lightBackground"
          }`}
        >
          <View className="w-[90%]">
            <Text
              className={`text-6xl text-center font-heartful ${
                colorScheme === "dark"
                  ? "text-lightBackground"
                  : "text-darkBackground"
              }`}
            >
              Vocentra
            </Text>
            <Text
              className={`text-2xl text-center font-heartful opacity-70 ${
                colorScheme === "dark"
                  ? "text-lightBackground"
                  : "text-darkBackground"
              }`}
            >
              Learn, Converse, Connect – Your Personal AI Language Companion!
            </Text>
          </View>
          <View className="w-full h-full mt-4 flex items-center justify-start">
            <View className="w-[95%] h-[65%] rounded-3xl overflow-hidden shadow-lg">
              <Image
                className="w-full h-full rounded-3xl"
                source={require("../../assets/images/onboarding-4.png")}
              />
            </View>
          </View>
        </View>

        <View className="flex-1 items-center justify-start">
          <View className="w-[95%] h-[65%] rounded-3xl overflow-hidden shadow-lg">
            <Image
              className="w-full h-full rounded-3xl"
              source={require("../../assets/images/onboarding-3.png")}
            />
          </View>
          <View className="w-[95%] mt-4">
            <Text
              className={`text-2xl text-center font-bold ${
                colorScheme === "dark"
                  ? "text-lightBackground"
                  : "text-darkBackground"
              }`}
            >
              Speak, Learn, Succeed.
            </Text>
            <Text
              className={`text-lg text-center font-heartful opacity-70 ${
                colorScheme === "dark"
                  ? "text-lightBackground"
                  : "text-darkBackground"
              }`}
            >
              Dive into immersive, real-time conversations with our AI. Practice
              speaking naturally, build fluency, and gain confidence in any
              situation.
            </Text>
          </View>
        </View>

        <View className="flex-1 items-center justify-start">
          <View className="w-[95%] h-[65%] rounded-3xl overflow-hidden shadow-lg">
            <Image
              className="w-full h-full rounded-3xl"
              source={require("../../assets/images/onboarding-1.png")}
            />
          </View>
          <View className="w-[95%] mt-4">
            <Text
              className={`text-2xl text-center font-bold ${
                colorScheme === "dark"
                  ? "text-lightBackground"
                  : "text-darkBackground"
              }`}
            >
              A Path Built Just for You.
            </Text>
            <Text
              className={`text-lg text-center font-heartful opacity-70 ${
                colorScheme === "dark"
                  ? "text-lightBackground"
                  : "text-darkBackground"
              }`}
            >
              Your learning, your pace. Explore a journey shaped by your
              interests, complete with progress tracking and insights to keep
              you moving forward.
            </Text>
          </View>
        </View>

        <View className="flex-1 items-center justify-start">
          <View className="w-[95%] h-[65%] rounded-3xl overflow-hidden shadow-lg">
            <Image
              className="w-full h-full rounded-3xl"
              source={require("../../assets/images/onboarding-2.png")}
            />
          </View>
          <View className="w-[95%] mt-4">
            <Text
              className={`text-2xl text-center font-bold ${
                colorScheme === "dark"
                  ? "text-lightBackground"
                  : "text-darkBackground"
              }`}
            >
              Connect Through Language.
            </Text>
            <Text
              className={`text-lg text-center font-heartful opacity-70 ${
                colorScheme === "dark"
                  ? "text-lightBackground"
                  : "text-darkBackground"
              }`}
            >
              Bridge the gap between cultures and people by learning to
              communicate effectively. Vocentra turns every interaction into an
              opportunity to grow and connect.
            </Text>
          </View>
        </View>
      </Swiper>

      {currentIndex === 3 && (
        <TouchableOpacity
          onPress={handleGetStarted}
          activeOpacity={0.9}
          className={`absolute bottom-12 left-4 right-4 border-2 py-2 rounded-full ${
            colorScheme === "dark"
              ? "border-lightBackground"
              : "border-darkBackground"
          }`}
        >
          <Text className={`text-center text-xl font-heartful ${
                colorScheme === "dark"
                  ? "text-lightBackground"
                  : "text-darkBackground"
              }`}>
            Get Started
          </Text>
        </TouchableOpacity>
      )}

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
          <View className="flex-1 justify-center items-center bg-black opacity-80">
            <View className="bg-lightBackground rounded-3xl p-4 border-2 border-darkBackground w-[80%] max-w-sm items-center p-8">
              <Text
                className={`text-3xl font-heartful mb-4 text-shadow-md shadow-black ${
                  colorScheme === "dark" ? "text-darkBackground" : "text-white"
                }`}
              >
                Join the Fun!
              </Text>
              <TouchableOpacity
                onPress={navigateToLogin}
                className="w-full py-2 mb-3 border-2 border-darkBackground rounded-full"
              >
                <Text className="text-center text-darkBackground text-xl font-heartful">
                  Login
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={navigateToSignup}
                className="w-full py-2 border-2 border-darkBackground rounded-full"
              >
                <Text className="text-center text-darkBackground text-xl font-heartful">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

export default OnBoardingPage;
