import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Animated, Dimensions, View, Easing } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRef } from "react";
import { HomeScreen, ConnectScreen, LeaderboardScreen, ProfileScreen } from "./index";
const Tab = createBottomTabNavigator();

const TabBarIcon = ({
  name,
  color,
  size,
}: {
  name: string;
  color: string;
  size: number;
}) => {
  return (
    <FontAwesome name={name} color={color} size={size} style={{ alignSelf: "center" }} />
  );
};

export function TabsLayout() {
  const tabOffsetValue = useRef(new Animated.Value(0)).current;

  const tabScreens = [
    { name: "Home", component: HomeScreen, icon: "home" },
    { name: "Connect", component: ConnectScreen, icon: "comments" },
    { name: "Leaderboard", component: LeaderboardScreen, icon: "trophy" },
    { name: "Profile", component: ProfileScreen, icon: "user" },
  ];

  const handleTabPress = (index: number) => {
    Animated.timing(tabOffsetValue, {
      toValue: getWidth() * index,
      duration: 300, // Adjust duration for smoother animation
      easing: Easing.out(Easing.exp), // Smooth easing function
      useNativeDriver: true,
    }).start();
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "white",
            position: "absolute",
            bottom: 35,
            marginHorizontal: 10,
            height: 60,
            borderRadius: 10,
            shadowColor: "black",
            shadowOffset: { width: 10, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          },
        }}
      >
        {tabScreens.map((screen, index) => (
          <Tab.Screen
            key={screen.name}
            name={screen.name}
            component={screen.component}
            options={{
              tabBarIcon: ({ focused }) => (
                <TabBarIcon
                  name={screen.icon}
                  color={focused ? "blue" : "gray"}
                  size={24}
                />
              ),
            }}
            listeners={{
              tabPress: () => handleTabPress(index),
            }}
          />
        ))}
      </Tab.Navigator>

      {/* Animated Indicator */}
      <Animated.View
        style={{
          position: "absolute",
          width: getWidth(),
          height: 3,
          backgroundColor: "red",
          bottom: 87,
          left: 18,
          borderRadius: 100,
          transform: [
            {
              translateX: tabOffsetValue,
            },
          ],
        }}
      />
    </>
  );
}

function getWidth() {
  const width = Dimensions.get("window").width - 40;
  return width / 4;
}
