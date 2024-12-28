import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { OnBoardingPage } from "./pages";
import { TabsLayout } from "./(tabs)/_layout";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import "../global.css";

SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded, error] = useFonts({
    Heartful: require("../assets/fonts/Heartful.ttf"),
  });

  const [isLoading, setIsLoading] = useState(true);
  const [hasOnBoarded, setHasOnBoarded] = useState(false);

  useEffect(() => {
    const checkOnBoarded = async () => {
      try {
        const value = await AsyncStorage.getItem("hasLaunched");
        if (value === null) {
          // First launch
          await AsyncStorage.setItem("hasLaunched", "true");
          setHasOnBoarded(false);
        } else {
          // Not the first launch
          setHasOnBoarded(true);
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnBoarded();

    if (error) {
      console.error("Font loading error:", error);
      return;
    }
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (isLoading) {
    // Render a loading screen while AsyncStorage is being checked
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {hasOnBoarded ? (
          <Stack.Screen name="Main" component={TabsLayout} />
        ) : (
          <Stack.Screen name="Onboarding" component={OnBoardingPage} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
