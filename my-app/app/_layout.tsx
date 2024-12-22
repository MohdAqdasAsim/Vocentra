import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import NotFoundScreen from "./NotFoundScreen";
import { TabsLayout } from "./(tabs)/_layout";

// Prevent auto-hiding of splash screen until fonts are loaded
SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

export default function RootLayout() {
  // Load custom fonts
  const [fontsLoaded, error] = useFonts({
    Heartful: require("../assets/fonts/Heartful.ttf"),
  });

  useEffect(() => {
    // Handle font loading error
    if (error) {
      console.error("Font loading error:", error); // Log error for debugging
      // You might want to navigate to an error screen or show an error message here
      return;
    }
    // Hide splash screen once fonts are loaded
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  // Show nothing until fonts are loaded
  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
       <Stack.Navigator>
        <Stack.Screen name="Tabs" component={TabsLayout} options={{ headerShown: false }} /> 
        <Stack.Screen name="+not-found" component={NotFoundScreen} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}
