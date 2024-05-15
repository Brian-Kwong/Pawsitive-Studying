import { View, TextInput, TouchableOpacity, Text, Alert } from "react-native";
import { styles, textStyles } from "../../Styles/comp_styles.jsx";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication";

export default function Welcome() {
    const [user, setUser] = useState({
        username: "",
        password: "",
    });

    const loginURL = "";
    const loginRequest = fetch(loginURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    });

    return (
        <View style={styles.container}>
            <View
                style={{
                    width: "30%",
                    aspectRatio: 1 / 1,
                    marginBottom: 20,
                    marginTop: 20,
                }}
            >
                <Image
                    style={{
                        resizeMode: "stretch",
                        height: "100%",
                        width: "100%",
                        borderRadius: 360,
                    }}
                    source="https://i.pinimg.com/564x/34/c3/33/34c3332cb8eb6c448bb4544cd7df4bcd.jpg"
                    contentFit="cover"
                />
            </View>
            <TextInput
                style={styles.TextInput}
                placeholder="Username"
                onEndEditing={(event) =>
                    setUser({
                        username: event.nativeEvent.text,
                        password: user.password,
                    })
                }
                onSubmitEditing={(event) =>
                    setUser({
                        username: event.nativeEvent.text,
                        password: user.password,
                    })
                }
            />
            <TextInput
                style={styles.TextInput}
                placeholder="Password"
                autoComplete="password"
                onEndEditing={(event) =>
                    setUser({
                        username: event.nativeEvent.text,
                        password: event.nativeEvent.text,
                    })
                }
                onSubmitEditing={(event) =>
                    setUser({
                        username: user.username,
                        password: event.nativeEvent.text,
                    })
                }
                blurOnSubmit={true}
            />
            <TouchableOpacity
                style={styles.Button}
                onPress={() => {
                    if (user.username != "" && user.password != "") {
                        // loginRequest
                        //     .then((response) => {
                        //         if (response.status === 200) {
                        //             response.json().then((data) => {
                        //                 if (data != null) {
                        //                     SecureStore.setItemAsync(
                        //                         "Token",
                        //                         data
                        //                     )
                        //                         .then(() => {
                        //                             console.log(
                        //                                 "Stored credentials"
                        //                             );
                        //                         })
                        //                         .catch((err) => {
                        //                             console.log(err);
                        //                         });
                        //                 }
                        //             });
                        //         } else {
                        //             alert("Login failed ;-;");
                        //         }
                        //     })

                        //     .catch((err) => {
                        //         console.log(err);
                        //     });
                        LocalAuthentication.authenticateAsync(
                            (disableDeviceFallback = true)
                        )
                            .then((result) => {
                                if (result.success) {
                                    router.replace({
                                        pathname: "../(Main-App)/(Tabs)",
                                    });
                                } else {
                                    alert(result.error);
                                }
                            })
                            .catch((err) => {
                                alert(err);
                            });
                    } else {
                        alert("Please fill all fields before signing up :D");
                    }
                }}
            >
                <Text style={textStyles.textBody}>Login</Text>
            </TouchableOpacity>
            <View style={styles.horzContainer}>
                <TouchableOpacity
                    style={styles.textButton}
                    onPress={() =>
                        router.push({
                            pathname: "/signup",
                        })
                    }
                >
                    <Text style={textStyles.textBody}>Signup</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.textButton}>
                    <Text style={textStyles.textBody}>Forgot</Text>
                    <Text style={textStyles.textBody}>Password</Text>
                </TouchableOpacity>
            </View>
            <StatusBar style="auto" />
        </View>
    );
}
