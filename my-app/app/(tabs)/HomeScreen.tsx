import { StatusBar } from "expo-status-bar";
import { SafeAreaView, View } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();  

  return (
    <SafeAreaView className="flex-1 bg-[#ffffff]">
      <View className="flex-1 gap-4 flex-col m-4">
        
      </View>
      {/* Adjust StatusBar style as per your app design */}
      <StatusBar style="light" />
    </SafeAreaView>
  );
}