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
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";

const { width, height } = Dimensions.get("window");

const OnBoardingPage = () => {
  const colorScheme = useColorScheme();
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
              className={`text-5xl text-center font-bold ${
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
          <View className="w-full h-full mt-4">
            <Image
              className="w-full h-[65%]"
              source={{ uri: "https://via.placeholder.com/300" }}
            />
          </View>
        </View>

        <Slide
          imgUrl="https://via.placeholder.com/300"
          text="Welcome to Vocentra"
          subText="Learn languages by engaging in real-time conversations with AI. Start your journey today!"
        />
        <Slide
          imgUrl="https://via.placeholder.com/300"
          text="Welcome to Vocentra"
          subText="Learn languages by engaging in real-time conversations with AI. Start your journey today!"
        />
      </Swiper>

      {/* Render Get Started button if on last slide */}
      {currentIndex === 2 && (
        <TouchableOpacity
          onPress={handleGetStarted}
          activeOpacity={0.9}
          className="absolute bottom-12 left-4 right-4 border-2 py-2 border-darkBackground rounded-full"
        >
          <Text className="text-center text-darkBackground text-xl font-heartful">
            Get Started
          </Text>
        </TouchableOpacity>
      )}

      {/* Modal for selecting Login or Signup */}
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
                  colorScheme === "dark"
                    ? "text-darkBackground"
                    : "text-white"
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

const Slide = ({
  imgUrl,
  text,
  subText,
}: {
  imgUrl: string;
  text: string;
  subText: string;
}) => {
  const colorScheme = useColorScheme();

  return (
    <View className="flex-1 items-center justify-start">
      <Image source={{ uri: imgUrl }} className="w-full h-[65%]" />
      <View className="w-[95%] mt-4">
        <Text
          className={`text-2xl text-center font-bold ${
            colorScheme === "dark"
              ? "text-lightBackground"
              : "text-darkBackground"
          }`}
        >
          {text}
        </Text>
        <Text
          className={`text-lg text-center font-heartful opacity-70 ${
            colorScheme === "dark"
              ? "text-lightBackground"
              : "text-darkBackground"
          }`}
        >
          {subText}
        </Text>
      </View>
    </View>
  );
};

export default OnBoardingPage;
