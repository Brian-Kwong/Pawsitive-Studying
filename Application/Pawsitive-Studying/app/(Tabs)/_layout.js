import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "../../Styles/comp_styles.jsx";

const tabBarIconColor = "blue";
const inactiveTabIconColor = "black";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        style={styles.TabsButton}
        options={{
          title: "Home",
          tabBarActiveTintColor: tabBarIconColor,
          tabBarInactiveTintColor: inactiveTabIconColor,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calander"
        style={styles.TabsButton}
        options={{
          title: "Calendar",
          tabBarActiveTintColor: tabBarIconColor,
          tabBarInactiveTintColor: inactiveTabIconColor,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="list" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="people"
        style={styles.TabsButton}
        options={{
          title: "Friends",
          tabBarActiveTintColor: tabBarIconColor,
          tabBarInactiveTintColor: inactiveTabIconColor,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user-friends" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        style={styles.TabsButton}
        options={{
          title: "Settings",
          tabBarActiveTintColor: tabBarIconColor,
          tabBarInactiveTintColor: inactiveTabIconColor,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
