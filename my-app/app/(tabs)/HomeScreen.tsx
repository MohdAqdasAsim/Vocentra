import { StatusBar } from "expo-status-bar";
import { Button, Text } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <Text>Home</Text>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}
