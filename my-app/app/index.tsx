import React, { useEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import Colors from "@/constants/Colors";
import NotFoundScreen from "./NotFoundScreen";
import "./global.css";

const App = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [hasOnBoarded, setHasOnBoarded] = useState<boolean | null>(null);

  // useEffect(() => {
  //   const checkOnBoarded = async () => {
  //     try {
  //       const value = await AsyncStorage.getItem("hasLaunched");
  //       if (value === null) {
  //         // First launch
  //         await AsyncStorage.setItem("hasLaunched", "true");
  //         setHasOnBoarded(true);
  //       } else {
  //         // Not the first launch
  //         setHasOnBoarded(false);
  //       }
  //     } catch (error) {
  //       console.error("Error checking first launch:", error);
  //     }
  //   };

  //   checkOnBoarded();
  // }, []);

  useEffect(() => {
    if (hasOnBoarded === false) {
      requestAnimationFrame(() => {
        router.replace("/home" as any);
      });
    }
    navigation.setOptions({
      title: "Profile Info",
      headerTitleStyle: {
        fontFamily: "Heartful",
        fontSize: 24,
      },
      headerTitleAlign: "center",
      headerTintColor: Colors.BACKGROUND_BLUE,
      headerShadowVisible: false,
    });
  }, [hasOnBoarded, router, navigation]);

  if (hasOnBoarded === null) {
    // Render a loading screen while checking AsyncStorage
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <View>{hasOnBoarded && <NotFoundScreen />}</View>;
  // return <>{hasOnBoarded && <OnBoardingPage />}</>;
};

export default App;
