import { Button, StyleSheet, Text, View, TextInput } from "react-native";
import { styles } from "../../Styles/comp_styles.jsx";
import { StatusBar } from "expo-status-bar";

export default function Cal() {
  return (
    <View style={styles.container}>
      <Text style={styles.textHeader}>Calendar</Text>
      <StatusBar style="auto" />
    </View>
  );
}
