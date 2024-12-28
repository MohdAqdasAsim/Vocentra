import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';

export default function ProfileScreen() {
  return (
    <View>
      <Text className='md-2'>Profile</Text>
      <StatusBar style='light' />
    </View>
  );
}