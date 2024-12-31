import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
} from "firebase/auth";
import { useTheme } from "@/hooks/useTheme";

export default function SignupPage() {
  const router = useRouter();
  const theme = useTheme();

  // State for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState(""); // State for email error message
  const [passwordError, setPasswordError] = useState(""); // State for password error message

  const handleSignup = async () => {
    setEmailError(""); // Reset the email error message
    setPasswordError(""); // Reset the password error message

    if (!email || !password || !confirmPassword) {
      // Handling required fields error
      if (!email) setEmailError("Email is required");
      if (!password) setPasswordError("Password is required");
      if (!confirmPassword) setPasswordError("Confirm password is required");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match"); // Set password mismatch error
      return;
    }

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Send the email verification
      await sendEmailVerification(userCredential.user);

      router.push(
        `/pages/ProfileCompletion?email=${encodeURIComponent(email)}` as any
      );
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setEmailError("Email is already in use"); // Set the email error message
      } else {
        setEmailError("Signup Error: " + error.message); // Handle other errors
      }
    }
  };

  return (
    <SafeAreaView
      className={`flex-1 ${
        theme === "dark" ? "bg-darkBackground" : "bg-lightBackground"
      }`}
    >
      {/* Header */}
      <View className="flex items-center justify-center py-6">
        <Text
          className={`text-4xl font-heartful ${
            theme === "dark" ? "text-white" : "text-black"
          }`}
        >
          Join Us!
        </Text>
        <Text
          className={`w-2/3 text-center text-2xl opacity-60 font-heartful ${
            theme === "dark" ? "text-white" : "text-black"
          }`}
        >
          Create your account to get started!
        </Text>
      </View>

      {/* Form */}
      <View className="px-4">
        <TextInput
          placeholder="Email"
          className={`mt-4 bg-gray-100 p-4 rounded-xl font-heartful ${
            theme === "dark" ? "text-lightBackground" : "text-darkBackground"
          }`}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        {/* Display email error message */}
        {emailError ? (
          <Text className="text-red-500 mt-2">{emailError}</Text>
        ) : null}

        <TextInput
          placeholder="Password"
          className={`mt-4 bg-gray-100 p-4 rounded-xl font-heartful ${
            theme === "dark" ? "text-lightBackground" : "text-darkBackground"
          }`}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          placeholder="Confirm Password"
          className={`mt-4 bg-gray-100 p-4 rounded-xl font-heartful ${
            theme === "dark" ? "text-lightBackground" : "text-darkBackground"
          }`}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        {/* Display password error message */}
        {passwordError ? (
          <Text className="text-red-500 mt-2">{passwordError}</Text>
        ) : null}

        <TouchableOpacity
          activeOpacity={0.8}
          className={`mt-4 py-2 rounded-xl font-heartful ${
            theme === "dark" ? "bg-lightBackground" : "bg-darkBackground"
          }`}
          onPress={handleSignup}
        >
          <Text
            className={`text-xl text-center font-heartful ${
              theme === "dark" ? "text-darkBackground" : "text-lightBackground"
            }`}
          >
            Create Account
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View className="flex-1 px-4 items-center justify-start gap-6 mt-4">
        <View className="flex flex-row justify-between items-center">
          <Text
            className={`font-heartful text-xl text-center ${
              theme === "dark" ? "text-lightBackground" : "text-darkBackground"
            }`}
          >
            Already have an account?{" "}
            <Link href="/pages/LoginPage">
              <Text className="text-blue-500">Login</Text>
            </Link>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
