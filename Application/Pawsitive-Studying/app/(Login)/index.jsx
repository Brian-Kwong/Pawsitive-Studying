import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { styles, textStyles } from "../../Styles/comp_styles.jsx";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import { router } from "expo-router";
import { generateHash } from "./secure_pass.js";

export default function Welcome() {
    var userName = null;
    var password = null;

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
                onEndEditing={(event) => (userName = event.nativeEvent.text)}
                onSubmitEditing={(event) => (userName = event.nativeEvent.text)}
            />
            <TextInput
                style={styles.TextInput}
                placeholder="Password"
                autoComplete="password"
                onEndEditing={(event) =>
                    generateHash(event.nativeEvent.text).then((hash) => {
                        password = hash;
                    })
                }
                onSubmitEditing={(event) =>
                    generateHash(event.nativeEvent.text).then((hash) => {
                        password = hash;
                    })
                }
                blurOnSubmit={true}
            />
            <TouchableOpacity
                style={styles.Button}
                onPress={() => {
                    console.log("Logging in with username: " + userName);
                    console.log("Logging in with password: " + password);
                    if (userName && password) {
                        router.replace({
                            pathname: "../(Main-App)/(Tabs)",
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
