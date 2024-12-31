import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Alert, StyleSheet, Animated } from "react-native";
import { useRouter } from "expo-router";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { auth } from "../services/firebaseConfig";

const REASONS = [
  { label: "Traveling", value: "traveling", emoji: "🌍" },
  { label: "Hobby", value: "hobby", emoji: "🎨" },
  { label: "Career Advancement", value: "career", emoji: "💼" },
  { label: "Cultural Exploration", value: "cultural", emoji: "🍣" },
  { label: "Study Abroad", value: "study_abroad", emoji: "📚" },
  { label: "Love for the Language", value: "love", emoji: "❤️" },
  { label: "Other", value: "other", emoji: "❓" },
];

export default function ReasonSelection() {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [otherReason, setOtherReason] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const toggleReason = (reason: string) => {
    if (selectedReasons.includes(reason)) {
      setSelectedReasons(selectedReasons.filter((item) => item !== reason));
    } else {
      setSelectedReasons([...selectedReasons, reason]);
    }
  };

  const handleReasonSubmit = async () => {
    const userId = auth.currentUser?.uid;

    if (!userId) {
      Alert.alert("Oops!", "User ID is not available. Please log in again.");
      return;
    }

    if (selectedReasons.length === 0) {
      Alert.alert("Oops!", "Please select at least one reason.");
      return;
    }

    if (selectedReasons.includes("other") && !otherReason) {
      Alert.alert("Oops!", "Please specify your reason for 'Other'.");
      return;
    }

    try {
      const db = getFirestore();
      const reasonsToSave = selectedReasons.includes("other")
        ? [...selectedReasons.filter((r) => r !== "other"), otherReason]
        : selectedReasons;

      // Save the selected reasons to Firestore
      await setDoc(
        doc(db, "users", userId),
        { reasons: reasonsToSave },
        { merge: true }
      );

      setIsLoading(true);

      // Navigate to the next page
      setTimeout(() => {
        setIsLoading(false);
        router.push("/");
      }, 500);
    } catch (error: any) {
      console.error("Firestore Error:", error);
      Alert.alert("Oops!", "Something went wrong. Please try again.");
    }
  };

  return (
    <View className="flex-1 p-6 justify-start items-center">
      <Text className="text-3xl font-heartful mb-6 text-center">
        Why do you want to learn this language?
      </Text>

      <Text className="text-lg mb-6 text-center text-gray-600">
        Choose your reasons to help us personalize your experience!
      </Text>

      {REASONS.map((reason) => (
        <TouchableOpacity
          key={reason.value}
          onPress={() => toggleReason(reason.value)}
          style={[
            styles.reasonButton,
            selectedReasons.includes(reason.value) ? styles.selectedButton : {},
          ]}
        >
          <Text className="text-2xl font-heartful flex-row items-center">
            <Text>{reason.emoji}</Text> {reason.label}
          </Text>
        </TouchableOpacity>
      ))}

      {selectedReasons.includes("other") && (
        <TextInput
          placeholder="Please specify..."
          value={otherReason}
          onChangeText={setOtherReason}
          style={styles.input}
        />
      )}

      <TouchableOpacity
        onPress={handleReasonSubmit}
        activeOpacity={0.8}
        className="w-full h-12 flex justify-center items-center bg-gradient-to-r from-blue-500 to-purple-600 py-3 px-8 rounded-xl mt-6"
      >
        <Text className="text-white text-lg font-heartful">Submit</Text>
      </TouchableOpacity>

      {isLoading && (
        <View className="flex-1 justify-center items-center">
          <View className="w-12 h-12 border-2 border-t-gray-200 border-darkBackground rounded-full animate-spin"></View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  reasonButton: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  selectedButton: {
    backgroundColor: "#007bff",
    borderColor: "#0056b3",
  },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 10,
    fontSize: 16,
  },
});
