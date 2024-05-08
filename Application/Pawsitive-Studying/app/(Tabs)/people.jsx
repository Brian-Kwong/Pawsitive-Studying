import { Button, StyleSheet, Text, View, TextInput } from "react-native";
import { styles } from "../../Styles/comp_styles.js";
import { StatusBar } from "expo-status-bar";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.textHeader}>Friends</Text>
      <StatusBar style="auto" />
    </View>
  );
}
