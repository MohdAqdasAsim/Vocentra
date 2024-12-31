import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import axios from "axios";
import { NotLoggedIN } from "@/components";
import { useTheme } from "@/hooks/useTheme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GEMINI_API_KEY } from "@/env";

interface Message {
  type: "user" | "ai";
  text: string;
}

const AiPage = () => {
  const theme = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userLanguageCode, setUserLanguageCode] = useState("en_XX");

  const GEMINI_API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
    
  useEffect(() => {
    const fetchLanguageCode = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const db = getFirestore();
        const userDocRef = doc(db, `users/${user.uid}`);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserLanguageCode(userDoc.data().language || "en_XX");
        }
      }
    };
    fetchLanguageCode();
  }, []);

  const getAiResponse = async (
    message: string,
    lang: string
  ): Promise<{ feedback: string; response: string; translation: string }> => {
    const prompt = `Please correct the following ${lang} sentence: '${message}'. Provide a brief explanation of any grammatical issues in English, as if you were a teacher. Then, respond to the corrected sentence as a native ${lang} speaker would if he was asked about ${input}, and include a separate English translation of your response. Ensure that feedback, response, and translation are clearly separated by tildes (~). Do not include any extra information beyond what is requested.
  
  Example format:
  
  [feedback][response][translation]
  
  For example, if the sentence is 'どんなお仕事をしていらっしゃいますか', your response could look like this:
  
  The sentence is grammatically correct, but it might sound more natural with the subject specified, like "あなたは猫が好きですか?"
  
  ~ 私はアシスタントです
  
  ~ I am an assistant!`;

    try {
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        { contents: [{ parts: [{ text: prompt }] }] },
        { headers: { "Content-Type": "application/json" } }
      );

      const apiResponse = response.data.candidates[0].content.parts[0].text;

      const [feedback, responseText, translation] = apiResponse
        .split("~")
        .map((part: string) => part.trim());

      return { feedback, response: responseText, translation };
    } catch (error) {
      console.error("Error fetching AI response:", error);
      return {
        feedback: "Sorry, an error occurred. Please try again later.",
        response: "",
        translation: "",
      };
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { type: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const detectedLang = userLanguageCode;

      const aiResponse = await getAiResponse(input, detectedLang);

      const newMessages: Message[] = [];

      if (aiResponse.feedback.trim()) {
        newMessages.push({ type: "ai", text: `Feedback: ${aiResponse.feedback}` });
      }
      if (aiResponse.response.trim()) {
        newMessages.push({ type: "ai", text: `Response: ${aiResponse.response}` });
      }
      if (aiResponse.translation.trim()) {
        newMessages.push({ type: "ai", text: `Translation: ${aiResponse.translation}` });
      }

      setMessages((prev) => [...prev, ...newMessages]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { type: "ai", text: "Sorry, an error occurred." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return isLoggedIn ? (
    <View
      className={`flex-1 ${
        theme === "dark" ? "bg-darkBackground" : "bg-lightBackground"
      } p-3 pb-1`}
    >
      <ScrollView className="flex-1 pb-4">
        {messages.map((message, index) => (
          <View
            key={index}
            className={`mb-3 p-4 py-2 rounded-lg ${
              message.type === "user"
                ? theme === "dark"
                  ? "bg-lightBackground self-end"
                  : "bg-darkBackground self-end"
                : theme === "dark"
                ? "bg-gray-300 self-start"
                : "bg-gray-200 self-start"
            }`}
          >
            <Text
              className={`text-lg ${
                message.type === "user" ? theme === "dark" ? "text-darkBackground" : "text-white" : "text-gray-800"
              }`}
            >
              {message.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      {isLoading && (
        <View
          className={`absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center ${
            theme === "dark" ? "bg-darkBackground" : "bg-lightBackground"
          }`}
        >
          <ActivityIndicator
            size="large"
            color={theme === "dark" ? "#FFFFFF" : "#121212"}
          />
        </View>
      )}

      <View className="w-full flex-row items-center mt-4 gap-2">
        <TextInput
          className={`flex-1 border-2 px-4 py-2 font-heartful rounded-3xl text-xl ${theme === "dark" ? "bg-darkBackground border-white text-white placeholder:text-white" : "bg-white border-darkBackground text-darkBackground placeholder:text-darkBackground"}`}
          value={input}
          onChangeText={setInput}
          placeholder="Type your message here..."
        />
        <TouchableOpacity
          className={`p-4 rounded-full w-12 h-12 items-center justify-center ${theme === "dark" ? "bg-white" : "bg-darkBackground"}`}
          onPress={handleSendMessage}
          disabled={isLoading}
        >
          <MaterialCommunityIcons
            name="send"
            size={16}
            color={theme === "dark" ? "#121212" : "#FFFFFF"}
          />
        </TouchableOpacity>
      </View>
      <Text className={`text-sm text-center font-heartful opacity-50 mt-2 ${theme === "dark" ? "text-white" : "text-darkBackground"}`}>
        Vocentra is currently in beta. It can make mistakes.
      </Text>
    </View>
  ) : (
    <NotLoggedIN />
  );
};

export default AiPage;
