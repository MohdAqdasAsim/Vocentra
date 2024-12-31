import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator, useColorScheme } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { OnBoardingPage } from "./pages";
import { TabsLayout } from "./(tabs)/_layout";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import "../global.css";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { useTheme } from "@/hooks/useTheme";

SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

export default function App() {
  const theme = useTheme();

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
    return (
      <View className={`${theme === "dark" ? "bg-darkBackground" : "bg-lightBackground"} flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color={theme === "dark" ? "#FFFFFF" : "#1F2937"} />
      </View>
    );
  }

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <NavigationContainer independent={true}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {hasOnBoarded ? (
          <Stack.Screen name="Main" component={TabsLayout} />
        ) : (
          <Stack.Screen name="Onboarding" component={OnBoardingPage} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
    </ThemeProvider>
  );
}
