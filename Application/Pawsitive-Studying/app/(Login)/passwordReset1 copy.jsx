import { View, TextInput, TouchableOpacity, Text, Alert } from "react-native";
import { styles, textStyles } from "../../Styles/comp_styles.jsx";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useState } from "react";
import { sendPasswordResetRequest } from "./security.js";

export default function Reset() {
    const [username, setUsername] = useState("");

    return (
        <View style={styles.container}>
            <Text style={textStyles.textSubHeader}>
                Please enter your username associated with your account
            </Text>
            <TextInput
                style={styles.TextInput}
                placeholder="Username"
                onEndEditing={(event) => setUsername(event.nativeEvent.text)}
                onSubmitEditing={(event) => setUsername(event.nativeEvent.text)}
            />
            <View style={styles.horzContainer}>
                <TouchableOpacity
                    style={styles.Button}
                    onPress={() => {
                        if (username !== "") {
                            sendPasswordResetRequest(username)
                                .then((response) => {
                                    router.replace({
                                        pathname: "/passwordReset2",
                                        params: {
                                            username: username,
                                            msg: response,
                                        },
                                    });
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                        } else {
                            alert(
                                "Please make sure to enter a token and password."
                            );
                        }
                    }}
                >
                    <Text style={textStyles.textBody}>Login</Text>
                </TouchableOpacity>
            </View>
            <StatusBar style="auto" />
        </View>
    );
}
