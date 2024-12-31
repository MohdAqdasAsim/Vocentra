import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  HomeScreen,
  ConnectScreen,
  ProfileScreen,
  TalkWithAiScreen,
} from "./index";
import { TabBar } from "@/components/TabBar";
const Tab = createBottomTabNavigator();

export function TabsLayout() {
  const tabScreens = [
    { name: "home", component: HomeScreen, icon: "home" },
    { name: "chatwithai", component: TalkWithAiScreen, icon: "chat" },
    { name: "connect", component: ConnectScreen, icon: "comments" },
    { name: "profile", component: ProfileScreen, icon: "user" },
  ];  

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      {tabScreens.map((screen) => (
        <Tab.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
        />
      ))}
    </Tab.Navigator>
  );
}
