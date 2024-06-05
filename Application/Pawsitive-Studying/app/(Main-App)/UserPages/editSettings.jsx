// Change Profile Picture (Pressable) Image Selector Base 64 Compression Quality<0.3
// Make boxes name email username button (password)
// Make endpoints to change everything new file in the backend
import { TouchableOpacity, Text, View, TextInput } from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { sendPasswordResetRequest, getID } from "../../(Login)/security.js";
import { textStyles, styles } from "../../../Styles/comp_styles.jsx";
import { useNavigation } from "expo-router";

const baseURL = "https://studybuddyserver.azurewebsites.net/";

export default function editSettings() {
    // Edit Name Button
    // Edit Username Button
    // Edit Email Button
    // Edit Password Button

    const [user, setUser] = useState({
        name: "",
        username: "",
        email: "",
    });

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            title: "User Profile Edit",
            textStyles: textStyles.textHeader,
        });
    }, [navigation]);

    async function getUserData() {
        try {
            const token = await SecureStore.getItemAsync("Token");
            const userID = await getID();
            let response = await fetch(`${baseURL}user/${userID}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                let data = await response.json();
                if (data != null) {
                    setUser({
                        name: data.name,
                        username: data.username,
                        email: data.email,
                    });
                } else {
                    alert("Failed to fetch user data");
                    return;
                }
                return;
            } else {
                console.log(response.status);
                alert("Error fetching user data");
                return;
            }
        } catch (error) {
            console.log(error);
            alert("Error fetching user data");
            return;
        }
    }

    async function updateUsername(username) {
        try {
            const token = await SecureStore.getItemAsync("Token");
            const userID = await getID();
            let response = await fetch(`${baseURL}/users/${userID}/username`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    username: username,
                }),
            });
            if (response.ok) {
                alert("Username updated successfully");
                setUser({
                    name: user.name,
                    username: username,
                    email: user.email,
                });
                return;
            } else if (response.status === 404) {
                alert("Username already exists");
                return;
            } else {
                alert("Error updating username");
                return;
            }
        } catch (error) {
            alert("Error updating username");
            return;
        }
    }

    async function updateName(name) {
        try {
            const token = await SecureStore.getItemAsync("Token");
            const userID = await getID();
            let response = await fetch(`${baseURL}/users/${userID}/name`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: name,
                }),
            });
            if (response.ok) {
                alert("Name updated successfully");
                setUser({
                    name: name,
                    username: user.username,
                    email: user.email,
                });
                return;
            } else {
                alert("Error updating name");
                return;
            }
        } catch (error) {
            alert("Error updating name");
            return;
        }
    }

    async function updateEmail(email) {
        try {
            const token = await SecureStore.getItemAsync("Token");
            const userID = await getID();
            let response = await fetch(`${baseURL}/users/${userID}/email`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    email: email,
                }),
            });
            if (response.ok) {
                alert("Email updated successfully");
                setUser({
                    name: user.name,
                    username: user.username,
                    email: email,
                });
                return;
            } else {
                alert("Error updating email");
                return;
            }
        } catch (error) {
            alert("Error updating email");
            return;
        }
    }

    useEffect(() => {
        getUserData();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.textHeader}>Edit User</Text>
            <TextInput
                style={styles.TextInput}
                placeholder={user.name}
                onEndEditing={(event) => updateName(event.nativeEvent.text)}
            />
            <TextInput
                style={styles.TextInput}
                placeholder={user.username}
                onEndEditing={(event) => updateUsername(event.nativeEvent.text)}
            />
            <TextInput
                style={styles.TextInput}
                placeholder={user.email}
                onEndEditing={(event) => updateEmail(event.nativeEvent.text)}
            />
            <TouchableOpacity
                style={styles.Button}
                onPress={() => {
                    if (user.username !== "") {
                        sendPasswordResetRequest(user.username)
                            .then((response) => {
                                console.log(response);
                                router.replace({
                                    pathname: "/passwordReset2",
                                    params: {
                                        username: user.username,
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
                <Text style={textStyles.textBody}>Reset Password</Text>
            </TouchableOpacity>
            <StatusBar style="auto" />
        </View>
    );
}
