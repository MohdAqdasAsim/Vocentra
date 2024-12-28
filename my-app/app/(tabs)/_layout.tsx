import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';

const Tab = createBottomTabNavigator();

export function TabsLayout() {
  return (
    <Tab.Navigator>
      <Tab.Screen options={{headerShown:false}} name="Home" component={HomeScreen} /> 
      <Tab.Screen name="Connect" component={ProfileScreen} />
      <Tab.Screen name="Leaderboard" component={ProfileScreen} /> 
      <Tab.Screen name="Profile" component={ProfileScreen} /> 
    </Tab.Navigator>
  );
}