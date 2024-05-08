import { Button, Text, View, TextInput } from "react-native";
import { styles } from "../Styles/comp_styles.jsx";
import { StatusBar } from "expo-status-bar";

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
