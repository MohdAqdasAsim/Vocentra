import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeType = "light" | "dark";

export const useTheme = () => {
  const systemColorScheme = useColorScheme(); // System default color scheme
  const [theme, setTheme] = useState<ThemeType>("light");

  // Load theme from AsyncStorage when component mounts
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem("userTheme");
        if (storedTheme) {
          setTheme(storedTheme as ThemeType);
        } else {
          // Fallback to system theme if no stored theme
          setTheme(systemColorScheme === "dark" ? "dark" : "light");
        }
      } catch (error) {
        console.error("Failed to load theme:", error);
      }
    };

    loadTheme();
  }, [systemColorScheme]);

  return theme;
};
