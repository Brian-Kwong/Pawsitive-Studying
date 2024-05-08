import { Button, StyleSheet, Text, View, TextInput, Alert } from "react-native";
import { styles } from "../Styles/comp_styles.js";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

export default function Welcome() {
  return (
    <View style={styles.container}>
      <Text style={styles.textHeader}>Loginw</Text>
      <TextInput style={styles.textInput} placeholder="Username" />
      <TextInput style={styles.textInput} placeholder="Username" />
      <Button title="Login" onPress={() => alert("Hello")} />
      <StatusBar style="auto" />
    </View>
  );
}
