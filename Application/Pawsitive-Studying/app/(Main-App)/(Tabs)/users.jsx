import {
    TouchableOpacity,
    TouchableNativeFeedback,
    Text,
    View,
    ScrollView,
} from "react-native";
import { styles } from "../../../Styles/comp_styles.jsx";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { default_image } from "../UserPages/default_image.js";
import { useEffect, useState } from "react";

const baseURL = "https://studybuddyserver.azurewebsites.net/";
const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function Users() {
    const [profilePictureImage, setProfilePictureImage] =
        useState(default_image);

    async function getProfilePicture() {
        try {
            const token = await SecureStore.getItemAsync("Token");
            const userID = await getID();
            let response = await fetch(
                `${baseURL}/users/${userID}/profilePicture`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.ok) {
                let data = await response.json();
                if (data != null) {
                    setProfilePictureImage(data.image);
                } else {
                    alert("Failed to fetch user data");
                    return;
                }
                return;
            } else {
                alert("Error fetching user data");
                return;
            }
        } catch (error) {
            alert("Error fetching user data");
            return;
        }
    }

    async function updateProfilePicture() {
        let image = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Image,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.2,
            base64: true,
        });
        if (!image.cancelled) {
            image = image.assets[0].base64
                ? image.assets[0].base64
                : default_image;
            setProfilePictureImage(image);
        }
        // try {
        //     const token = await SecureStore.getItemAsync("Token");
        //     const userID = await getID();
        //     let response = await fetch(
        //         `${baseURL}/users/${userID}/profilePicture`,
        //         {
        //             method: "PUT",
        //             headers: {
        //                 "Content-Type": "application/json",
        //                 Authorization: `Bearer ${token}`,
        //             },
        //             body: JSON.stringify({
        //                 image: username,
        //             }),
        //         }
        //     );
        //     if (response.ok) {
        //         alert("Username updated successfully");
        //         setUser({
        //             name: user.name,
        //             username: username,
        //             email: user.email,
        //         });
        //         return;
        //     } else if (response.status === 404) {
        //         alert("Username already exists");
        //         return;
        //     } else {
        //         alert("Error updating username");
        //         return;
        //     }
        // } catch (error) {
        //     alert("Error updating username");
        //     return;
        // }
    }

    return (
        <ScrollView>
            <View style={styles.topContainer}>
                <View
                    style={{
                        width: "30%",
                        aspectRatio: 1 / 1,
                        marginBottom: 20,
                        marginTop: 20,
                    }}
                >
                    <TouchableNativeFeedback
                        onPress={() => updateProfilePicture()}
                    >
                        <Image
                            style={{
                                resizeMode: "stretch",
                                height: "100%",
                                width: "100%",
                                borderRadius: 360,
                            }}
                            placeholder={{ blurhash }}
                            source={{
                                uri: `data:image/jpeg;base64, ${profilePictureImage}`,
                            }}
                            contentFit="cover"
                        />
                    </TouchableNativeFeedback>
                </View>
                <Text style={styles.textHeader}>User Profile</Text>
                <View>
                    <TouchableOpacity
                        style={styles.LongButton}
                        onPress={() => {
                            // Do something
                        }}
                    >
                        <Text style={styles.textBody}>
                            Manage Study Preferences
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.LongButton}
                        onPress={() => {
                            router.push("/manage-study-preferences");
                        }}
                    >
                        <Text style={styles.textBody}>Manage Courses</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.LongButton}
                        onPress={() => {
                            router.push("/manage-courses");
                        }}
                    >
                        <Text style={styles.textBody}>Manage Courses</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.LongButton}
                        onPress={() => {
                            // Do something
                            router.push("/calendar");
                        }}
                    >
                        <Text style={styles.textBody}>Calander</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.LongButton}
                        onPress={() => {
                            // Do something
                            router.push({
                                pathname: "../UserPages/MusicPage",
                                title: "Music",
                            });
                        }}
                    >
                        <Text style={styles.textBody}>Music</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.LongButton}
                        onPress={() => {
                            // Do something
                            router.push({
                                pathname: "../UserPages/timerSelection",
                                title: "Timer",
                            });
                        }}
                    >
                        <Text style={styles.textBody}>Timer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.LongButton}
                        onPress={() => {
                            // Do something
                            router.push({
                                pathname: "../UserPages/editSettings",
                                title: "Settings",
                            });
                        }}
                    >
                        <Text style={styles.textBody}>Settings</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.LongButton}
                        onPress={() => {
                            SecureStore.deleteItemAsync("Token").then(() => {
                                router.replace({
                                    pathname: "../../(Login)",
                                });
                            });
                        }}
                    >
                        <Text style={styles.textBody}>Log Out</Text>
                    </TouchableOpacity>
                </View>
                <StatusBar style="auto" />
            </View>
        </ScrollView>
    );
}
