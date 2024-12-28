import { StatusBar } from "expo-status-bar";
import { Text } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex items-center justify-center bg-[#00ffff]">
      <Text className="text-7xl text-blue-500">Hello</Text>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}
