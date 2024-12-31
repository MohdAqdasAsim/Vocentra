import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getFirestore, doc, setDoc, updateDoc } from "firebase/firestore";
import { auth } from "../services/firebaseConfig";

const LANGUAGES = [
  { name: "English", code: "en_XX" },
  { name: "Spanish", code: "es_XX" },
  { name: "French", code: "fr_XX" },
  { name: "German", code: "de_DE" },
  { name: "Russian", code: "ru_RU" },
  { name: "Chinese", code: "zh_CN" },
  { name: "Arabic", code: "ar_AR" },
  { name: "Czech", code: "cs_CZ" },
  { name: "Estonian", code: "et_EE" },
  { name: "Finnish", code: "fi_FI" },
  { name: "Gujarati", code: "gu_IN" },
  { name: "Hindi", code: "hi_IN" },
  { name: "Italian", code: "it_IT" },
  { name: "Japanese", code: "ja_XX" },
  { name: "Kazakh", code: "kk_KZ" },
  { name: "Korean", code: "ko_KR" },
  { name: "Lithuanian", code: "lt_LT" },
  { name: "Latvian", code: "lv_LV" },
  { name: "Burmese", code: "my_MM" },
  { name: "Nepali", code: "ne_NP" },
  { name: "Dutch", code: "nl_XX" },
  { name: "Romanian", code: "ro_RO" },
  { name: "Sinhala", code: "si_LK" },
  { name: "Turkish", code: "tr_TR" },
  { name: "Vietnamese", code: "vi_VN" },
  { name: "Afrikaans", code: "af_ZA" },
  { name: "Azerbaijani", code: "az_AZ" },
  { name: "Bengali", code: "bn_IN" },
  { name: "Persian", code: "fa_IR" },
  { name: "Hebrew", code: "he_IL" },
  { name: "Croatian", code: "hr_HR" },
  { name: "Indonesian", code: "id_ID" },
  { name: "Georgian", code: "ka_GE" },
  { name: "Khmer", code: "km_KH" },
  { name: "Macedonian", code: "mk_MK" },
  { name: "Malayalam", code: "ml_IN" },
  { name: "Mongolian", code: "mn_MN" },
  { name: "Marathi", code: "mr_IN" },
  { name: "Polish", code: "pl_PL" },
  { name: "Pashto", code: "ps_AF" },
  { name: "Portuguese", code: "pt_XX" },
  { name: "Swedish", code: "sv_SE" },
  { name: "Swahili", code: "sw_KE" },
  { name: "Tamil", code: "ta_IN" },
  { name: "Telugu", code: "te_IN" },
  { name: "Thai", code: "th_TH" },
  { name: "Tagalog", code: "tl_XX" },
  { name: "Ukrainian", code: "uk_UA" },
  { name: "Urdu", code: "ur_PK" },
  { name: "Xhosa", code: "xh_ZA" },
  { name: "Galician", code: "gl_ES" },
  { name: "Slovene", code: "sl_SI" },
];

export default function ProfileCompletion() {
  const router = useRouter();
  const [name, setName] = useState("");
  const { email } = useLocalSearchParams();
  const [rank, setRank] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitPressed, setIsSubmitPressed] = useState(false);

  const handleProfileSubmit = async () => {
    setIsSubmitPressed(true); // Set flag when submit is pressed

    if (!name) {
      Alert.alert("Error", "Please enter your name!");
      return;
    }

    if (!selectedLanguage) {
      Alert.alert("Error", "Please select a language!");
      return;
    }

    if (!auth.currentUser) {
      Alert.alert("Error", "User not logged in!");
      return;
    }

    try {
      const userId = auth.currentUser.uid;
      const db = getFirestore();

      // Find the selected language name from the LANGUAGES array
      const selectedLanguageName = LANGUAGES.find(
        (language) => language.code === selectedLanguage
      )?.name;

      // Save profile details in Firestore
      await setDoc(doc(db, "users", userId), {
        name,
        email,
        ranking: rank,
        language: selectedLanguageName,
      });

      router.push("/pages/ReasonSelection");
    } catch (error: any) {
      console.error("Firestore Error:", error);
      Alert.alert("Error", error.message || "Failed to save profile.");
    }
  };

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
  };

  const filteredLanguages = LANGUAGES.filter((language) =>
    language.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }: { item: { name: string; code: string } }) => (
    <TouchableOpacity
      onPress={() => handleLanguageSelect(item.code)}
      style={[selectedLanguage === item.code ? styles.selectedButton : {}]}
      className="w-full h-14 flex justify-center items-center border border-darkBackground py-3 px-8 mt-4 rounded-xl"
    >
      <Text
        className="text-2xl font-heartful"
        style={[selectedLanguage === item.code ? styles.selectedText : {}]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 p-6 justify-start items-center">
      <Text className="text-3xl font-heartful mb-6">Complete Your Profile</Text>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        className="w-full px-4 py-2 text-2xl border font-heartful border-darkBackground rounded-xl mb-4"
      />
      <TouchableOpacity
        onPress={handleProfileSubmit}
        activeOpacity={0.8}
        className="w-full h-12 flex justify-center items-center bg-darkBackground py-3 px-8 rounded-xl"
      >
        <Text className="text-white text-lg font-heartful">Submit</Text>
      </TouchableOpacity>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <View className="w-12 h-12 border-2 border-t-gray-200 border-darkBackground rounded-full animate-spin"></View>
        </View>
      ) : (
        <>
          <Text className="text-3xl font-heartful mt-6 mb-4">
            Select Your Language
          </Text>
          <TextInput
            placeholder="Search Language"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="w-full px-4 py-2 text-2xl border font-heartful border-darkBackground rounded-xl mt-4"
          />
          <FlatList
            data={filteredLanguages}
            renderItem={renderItem}
            keyExtractor={(item) => item.code}
            contentContainerStyle={styles.languageList}
            className="w-full"
          />
        </>
      )}

      {isSubmitPressed && selectedLanguage === "" && (
        <Text className="text-red-500 mt-4">Please select a language</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  languageButton: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: "#1f1f1f",
  },
  selectedText: {
    color: "white",
  },
  languageText: {
    fontSize: 16,
  },
  languageList: {
    flexGrow: 1,
  },
});
