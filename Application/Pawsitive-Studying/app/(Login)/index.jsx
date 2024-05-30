import { View, TextInput, TouchableOpacity, Text, Alert } from "react-native";
import { styles, textStyles } from "../../Styles/comp_styles.jsx";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { logInWithFaceID, logInWithPassword } from "./security.js";
import * as SecureStore from "expo-secure-store";
import TrackPlayer from 'react-native-track-player';
import playerService from './player-service.js';

// 在组件外部初始化 Track Player
TrackPlayer.setupPlayer().then(() => {
    console.log('Track Player has been setup');
});

TrackPlayer.registerPlaybackService(() => playerService);


export default function Welcome() {
    /* Checks if they are logged in */
    SecureStore.getItemAsync("Token").then((token) => {
        if (token != null) {
            router.replace({
                pathname: "../(Main-App)/(Tabs)",
            });
        }
    });

    const [user, setUser] = useState({
        username: "",
        password: "",
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
                blurOnSubmit={true}
                blurOEnter={true}
                secureTextEntry={true}
                onEndEditing={(event) =>
                    setUser({
                        username: user.username,
                        password: event.nativeEvent.text,
                    })
                }
                onSubmitEditing={(event) =>
                    setUser({
                        username: user.username,
                        password: event.nativeEvent.text,
                    })
                }
            />
            <View style={styles.horzContainer}>
                <TouchableOpacity
                    style={styles.Button}
                    onPress={() => {
                        if (user.username !== "" && user.password !== "") {
                            logInWithPassword(user)
                                .then(() => {
                                    router.replace({
                                        pathname: "../(Main-App)/(Tabs)",
                                    });
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                        } else {
                            alert("Please enter a username and password.");
                        }
                    }}
                >
                    <Text style={textStyles.textBody}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.Button}
                    onPress={() => {
                        logInWithFaceID()
                            .then(() => {
                                router.replace({
                                    pathname: "../(Main-App)/(Tabs)",
                                });
                            })
                            .catch(() => {});
                    }}
                >
                    <Text style={textStyles.textBody}>Login with FaceID </Text>
                </TouchableOpacity>
            </View>
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
