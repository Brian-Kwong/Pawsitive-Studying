import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { styles, textStyles } from "../../Styles/comp_styles.jsx";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useState } from "react";
import { sendPasswordResetRequest } from "./security.js";

export default function Reset() {
    const [username, setUsername] = useState("");

    return (
        <View style={styles.container}>
            <Text style={[textStyles.textSubHeader, { textAlign: "center" }]}>
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
                                    console.log(response);
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
                            alert("No username entered");
                        }
                    }}
                >
                    <Text style={textStyles.textBody}>Reset</Text>
                </TouchableOpacity>
            </View>
            <StatusBar style="auto" />
        </View>
    );
}
