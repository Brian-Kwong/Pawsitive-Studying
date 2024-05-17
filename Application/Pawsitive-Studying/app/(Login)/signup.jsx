import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    ScrollView,
} from "react-native";
import { styles, textStyles } from "../../Styles/comp_styles.jsx";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import { router, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { makeNewUser } from "./security.js";

export default function Signup() {
    const [user, setUser] = useState({
        name: "",
        pronouns: "",
        email: "",
        username: "",
        password: "",
    });

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            title: "Sign Up",
            textStyles: textStyles.textHeader,
            headerBackTitle: "Login",
        });
    }, [navigation]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
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
                placeholder="Name"
                onEndEditing={(event) =>
                    setUser({
                        name: event.nativeEvent.text,
                        pronouns: user.pronouns,
                        username: user.username,
                        email: user.email,
                        password: user.password,
                    })
                }
                onSubmitEditing={(event) =>
                    setUser({
                        name: event.nativeEvent.text,
                        pronouns: user.pronouns,
                        username: user.username,
                        email: user.email,
                        password: user.password,
                    })
                }
            />
            <TextInput
                style={styles.TextInput}
                placeholder="Pronouns"
                onEndEditing={(event) =>
                    setUser({
                        name: user.name,
                        pronouns: event.nativeEvent.text,
                        username: user.username,
                        email: user.email,
                        password: user.password,
                    })
                }
                onSubmitEditing={(event) =>
                    setUser({
                        name: user.name,
                        pronouns: event.nativeEvent.text,
                        username: user.username,
                        email: user.email,
                        password: user.password,
                    })
                }
            />
            <TextInput
                style={styles.TextInput}
                placeholder="Username"
                onEndEditing={(event) =>
                    setUser({
                        name: user.name,
                        pronouns: user.pronouns,
                        username: event.nativeEvent.text,
                        email: user.email,
                        password: user.password,
                    })
                }
                onSubmitEditing={(event) =>
                    setUser({
                        name: user.name,
                        pronouns: user.pronouns,
                        username: event.nativeEvent.text,
                        email: user.email,
                        password: user.password,
                    })
                }
            />
            <TextInput
                style={styles.TextInput}
                placeholder="Email"
                onEndEditing={(event) =>
                    setUser({
                        name: user.name,
                        pronouns: user.pronouns,
                        username: user.username,
                        email: event.nativeEvent.text,
                        password: user.password,
                    })
                }
                onSubmitEditing={(event) =>
                    setUser({
                        name: user.name,
                        pronouns: event.nativeEvent.text,
                        username: user.username,
                        email: event.nativeEvent.text,
                        password: user.password,
                    })
                }
            />
            <TextInput
                style={styles.TextInput}
                placeholder="Password (8+ characters)"
                onEndEditing={(event) => {
                    if (event.nativeEvent.text.length < 8) {
                        alert("Password must be at least 8 characters long");
                    } else {
                        setUser({
                            name: user.name,
                            pronouns: user.pronouns,
                            username: user.username,
                            email: user.email,
                            password: event.nativeEvent.text,
                        });
                    }
                }}
                onSubmitEditing={(event) => {
                    if (event.nativeEvent.text.length < 8) {
                        alert("Password must be at least 8 characters long");
                    } else {
                        setUser({
                            name: user.name,
                            pronouns: user.pronouns,
                            username: user.username,
                            email: user.email,
                            password: event.nativeEvent.text,
                        });
                    }
                }}
            />
            <TouchableOpacity
                style={styles.Button}
                onPress={() => {
                    if (
                        user.email !== "" &&
                        user.name !== "" &&
                        user.password !== "" &&
                        user.username !== ""
                    ) {
                        makeNewUser(user)
                            .then((res) => {
                                if (res == 200) {
                                    router.replace({
                                        pathname: "../(Main-App)",
                                    });
                                } else {
                                    return;
                                }
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    } else {
                        alert("Please fill all fields before signing up :D");
                    }
                }}
            >
                <Text style={textStyles.textBody}>Signup</Text>
            </TouchableOpacity>
            <StatusBar style="auto" />
        </ScrollView>
    );
}
