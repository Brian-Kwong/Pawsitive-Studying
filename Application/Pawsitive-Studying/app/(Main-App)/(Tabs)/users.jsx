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
import { getID } from "../../(Login)/security.js";

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
                `${baseURL}/users/${userID}/profileImage`,
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
                if (data != null || data.profileImage != "None") {
                    setProfilePictureImage(data.profileImage);
                } else if (data.profileImage == "None") {
                    return;
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

    useEffect(() => {
        getProfilePicture();
    }, []);

    async function updateProfilePicture() {
        let image = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Image,
            allowsEditing: true,
            aspect: [1, 3],
            quality: 0,
            base64: true,
        });
        if (!image.cancelled) {
            image = image.assets[0].base64;
            try {
                const token = await SecureStore.getItemAsync("Token");
                const userID = await getID();
                let response = await fetch(
                    `${baseURL}/users/${userID}/profileImage`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            profileImage: image,
                        }),
                    }
                );
                if (response.ok) {
                    setProfilePictureImage(image);
                    return;
                } else {
                    console.log(response.status);
                    alert("Error updating image");
                    return;
                }
            } catch (error) {
                alert("Error updating image");
                return;
            }
        }
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
                            router.push({
                                pathname: "../UserPages/completedTasks",
                                title: "Completed Tasks",
                            });
                        }}
                    >
                        <Text style={styles.textBody}>Completed Tasks</Text>
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
