import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useTheme } from "@/hooks/useTheme";
import { auth } from "../services/firebaseConfig";

export default function LoginPage() {
  const router = useRouter();
  const theme = useTheme();

  // State for form inputs and error messages
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(""); // State for email error
  const [passwordError, setPasswordError] = useState(""); // State for password error
  const [resetEmail, setResetEmail] = useState(""); // State for password reset email input
  const [resetError, setResetError] = useState(""); // State for password reset error
  const [showReset, setShowReset] = useState(false); // State to toggle password reset form visibility
  const [showLogin, setShowLogin] = useState(true); // State to toggle between login and reset view

  // Email/password login handler
  const handleEmailLogin = async () => {
    setEmailError(""); // Reset the email error
    setPasswordError(""); // Reset the password error

    if (!email || !password) {
      if (!email) setEmailError("Email is required");
      if (!password) setPasswordError("Password is required");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/"); // Replace with your dashboard route
    } catch (error: any) {
      setEmailError(error.message); // Display error message below email
    }
  };

  // Password recovery handler
  const handlePasswordReset = async () => {
    setResetError(""); // Reset any previous reset errors

    if (!resetEmail) {
      setResetError("Please enter your email address");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetError("Password reset email sent! Check your inbox.");
    } catch (error: any) {
      setResetError(error.message); // Display error message for password reset failure
    }
  };

  return (
    <SafeAreaView
      className={`flex-1 ${
        theme === "dark" ? "bg-darkBackground" : "bg-lightBackground"
      }`}
    >
      {showLogin && (
        <View className="flex items-center justify-center py-16">
          <Text
            className={`text-4xl font-heartful ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            Hello Again!
          </Text>
          <Text
            className={`w-2/3 text-center text-2xl opacity-60 font-heartful ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            Welcome back, you've been missed!
          </Text>
        </View>
      )}

      <View className="px-4">
        {showLogin && (
          <>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              className={`bg-gray-100 p-4 rounded-xl font-heartful ${
                theme === "dark"
                  ? "text-lightBackground"
                  : "text-darkBackground"
              }`}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {emailError && (
              <Text className="text-red-500 mt-2">{emailError}</Text>
            )}

            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              className={`mt-4 bg-gray-100 p-4 rounded-xl font-heartful ${
                theme === "dark"
                  ? "text-lightBackground"
                  : "text-darkBackground"
              }`}
              secureTextEntry
            />
            {passwordError && (
              <Text className="text-red-500 mt-2">{passwordError}</Text>
            )}

            <TouchableOpacity
              onPress={() => {
                setShowReset(true);
                setShowLogin(false);
              }} // Hide login form, show reset form
              className="rounded-xl"
            >
              <Text
                className={`py-2 text-right text-lg opacity-70 rounded-xl font-heartful ${
                  theme === "dark"
                    ? "text-lightBackground"
                    : "text-darkBackground"
                }`}
              >
                Recover Password
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleEmailLogin}
              activeOpacity={0.8}
              className={`py-2 text-lg rounded-xl font-heartful ${
                theme === "dark" ? "bg-lightBackground" : "bg-darkBackground"
              }`}
            >
              <Text
                className={`py-2 text-xl text-center font-heartful ${
                  theme === "dark"
                    ? "text-darkBackground"
                    : "text-lightBackground"
                }`}
              >
                Login
              </Text>
            </TouchableOpacity>
          </>
        )}

        {showReset && (
          <View className="mt-6">
            <Text
              className={`text-2xl font-bold text-center mb-6 ${
                theme === "dark"
                  ? "text-lightBackground"
                  : "text-darkBackground"
              }`}
            >
              Reset Your Password
            </Text>

            <TouchableOpacity
              onPress={() => {
                setShowReset(false);
                setShowLogin(true);
              }}
              className="mb-4"
            >
              <Text
                className={`text-lg text-blue-500 font-heartful ${
                  theme === "dark"
                    ? "text-lightBackground"
                    : "text-darkBackground"
                }`}
              >
                Back to Login
              </Text>
            </TouchableOpacity>

            <TextInput
              placeholder="Enter your email to reset password"
              value={resetEmail}
              onChangeText={setResetEmail}
              className={`mb-4 bg-gray-100 p-4 rounded-xl font-heartful ${
                theme === "dark"
                  ? "text-lightBackground"
                  : "text-darkBackground"
              }`}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {resetError && (
              <Text className="text-red-500 mt-2">{resetError}</Text>
            )}

            <TouchableOpacity
              onPress={handlePasswordReset}
              activeOpacity={0.8}
              className={`py-2 text-lg rounded-xl font-heartful ${
                theme === "dark" ? "bg-lightBackground" : "bg-darkBackground"
              }`}
            >
              <Text
                className={`py-2 text-xl text-center font-heartful ${
                  theme === "dark"
                    ? "text-darkBackground"
                    : "text-lightBackground"
                }`}
              >
                Reset Password
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View className="flex-1 px-4 items-center justify-start gap-8 mt-6">
        <View className="flex flex-row justify-between items-center">
          <Text
            className={`font-heartful text-xl text-center ${
              theme === "dark" ? "text-lightBackground" : "text-darkBackground"
            }`}
          >
            Not a member?{" "}
            <Link href="/pages/SignupPage">
              <Text className="text-blue-500">Sign Up</Text>
            </Link>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
