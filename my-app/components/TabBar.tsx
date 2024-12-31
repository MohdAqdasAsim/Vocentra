import {
  View,
  Pressable,
  LayoutChangeEvent,
  GestureResponderEvent,
} from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useEffect, useState } from "react";

// Define the valid icon names
type IconName = "home" | "connect" | "leaderboard" | "profile" | "chatwithai";

// Define the icon mapping
const icon: Record<IconName, (props: any) => React.JSX.Element> = {
  home: (props: any) => <FontAwesome name="home" size={24} {...props} />,
  connect: (props: any) => (
    <Ionicons name="chatbubbles-sharp" size={24} {...props} />
  ),
  leaderboard: (props: any) => (
    <FontAwesome name="trophy" size={24} {...props} />
  ),
  profile: (props: any) => <FontAwesome name="user" size={24} {...props} />,
  chatwithai: (props: any) => <MaterialCommunityIcons name="robot" size={24} {...props} />,
};

// Define the TabBar component
export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const [dimensions, setDimensions] = useState({ height: 20, width: 100 });
  const buttonWidth = dimensions.width / state.routes.length;

  const onTabbarLayout = (e: LayoutChangeEvent) => {
    setDimensions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    });
  };

  const tabPositionX = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tabPositionX.value }],
  }));

  return (
    <View
      onLayout={onTabbarLayout}
      className="absolute bottom-5 flex-row justify-between items-center bg-lightBackground mx-10 h-16 w-[80%] rounded-full shadow-md"
    >
      {/* Animated Black Ball */}
      <Animated.View
        style={[
          animatedStyle,
          {
            height: dimensions.height - 10,
            width: buttonWidth - 20,
            marginLeft: 10,
            backgroundColor: "#374151",
          },
        ]}
        className="absolute rounded-full"
      />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          tabPositionX.value = withSpring(buttonWidth * index);
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        const iconName = route.name as IconName;

        if (!(iconName in icon)) {
          console.warn(`Invalid icon name: ${route.name}`);
        }

        return (
          <TabBarButton
            key={route.key}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            iconName={iconName}
          />
        );
      })}
    </View>
  );
}

// Define the TabBarButtonProps interface
interface TabBarButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  onLongPress: (event: GestureResponderEvent) => void;
  isFocused: boolean;
  iconName: string;
}

// Define the TabBarButton component
function TabBarButton({ onPress, onLongPress, isFocused, iconName }: TabBarButtonProps) {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0);
  }, [scale, isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);

    return {
      transform: [{ scale: scaleValue }],
    };
  });

  // Validate iconName and provide a fallback
  const IconComponent = icon[iconName as IconName] || (() => null);

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      className="flex-1 items-center justify-center p-2"
    >
      <Animated.View style={animatedIconStyle}>
        <IconComponent color={isFocused ? "#FFFFFF" : "#374151"} />
      </Animated.View>
    </Pressable>
  );
}
