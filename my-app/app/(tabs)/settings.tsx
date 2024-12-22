import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

const settings = () => {
  return (
    <View className="flex-1 justify-center items-center p-4">
      <TouchableOpacity className="bg-blue-500 p-3 rounded">
        <Text className="text-white text-lg">Export</Text>
      </TouchableOpacity>
    </View>
  );
};

export default settings;
