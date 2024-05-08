import { Button, StyleSheet, Text, View, TextInput } from "react-native";
import { styles } from "../../Styles/comp_styles.jsx";
import { StatusBar } from "expo-status-bar";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.textHeader}>Settings</Text>
      <StatusBar style="auto" />
    </View>
  );
}
