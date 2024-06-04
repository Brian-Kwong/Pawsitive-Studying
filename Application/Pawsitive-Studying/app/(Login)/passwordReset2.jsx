import { View, TextInput, TouchableOpacity, Text, Alert } from "react-native";
import { styles, textStyles } from "../../Styles/comp_styles.jsx";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { resetPassword } from "./security.js";

export default function Reset() {
    const userUd = useLocalSearchParams().userId;
    const response = useLocalSearchParams().msg;

    // Password reset feilds
    const [resetPasswordFeilds, setResetPasswordFeilds] = useState({
        password: "",
        token: "",
    });
    const [resetPasswordMsg, setResetPasswordMsg] = useState("Sending...");

    // Sets response from previous page
    useEffect(() => {
        setResetPasswordMsg(response);
    }, []);

    return (
        <View style={styles.container}>
            <Text>{resetPasswordMsg}</Text>
            <TextInput
                style={styles.TextInput}
                placeholder="Reset Token"
                onEndEditing={(event) =>
                    setResetPasswordFeilds({
                        token: event.nativeEvent.text,
                        password: resetPasswordFeilds.password,
                    })
                }
                onSubmitEditing={(event) =>
                    setResetPasswordFeilds({
                        token: event.nativeEvent.text,
                        password: resetPasswordFeilds.password,
                    })
                }
            />
            <TextInput
                style={styles.TextInput}
                placeholder="New Password"
                autoComplete="New Password"
                blurOnSubmit={true}
                blurOEnter={true}
                secureTextEntry={true}
                onEndEditing={(event) =>
                    setResetPasswordFeilds({
                        password: event.nativeEvent.text,
                        token: resetPasswordFeilds.token,
                    })
                }
                onSubmitEditing={(event) =>
                    setResetPasswordFeilds({
                        password: event.nativeEvent.text,
                        token: resetPasswordFeilds.token,
                    })
                }
            />
            <View style={styles.horzContainer}>
                <TouchableOpacity
                    style={styles.Button}
                    onPress={() => {
                        if (
                            resetPasswordFeilds.token !== "" &&
                            resetPasswordFeilds.password !== ""
                        ) {
                            resetPassword(
                                userUd,
                                resetPasswordFeilds.token,
                                resetPasswordFeilds.password
                            )
                                .then(() => {
                                    router.replace({
                                        pathname: "../(Main-App)/(Tabs)",
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
