import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { styles, textStyles } from "../../Styles/comp_styles.jsx";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import { router, useNavigation } from "expo-router";
import { useEffect } from "react";

export default function Signup() {
    var userName = null;
    var email = null;
    var password = null;

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            title: "Sign Up",
            textStyles: textStyles.textHeader,
            headerBackTitle: "Login",
        });
    }, [navigation]);

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
                ></Image>
            </View>
            <TextInput
                style={styles.TextInput}
                placeholder="Username"
                onEndEditing={(event) => (userName = event.nativeEvent.text)}
                onSubmitEditing={(event) => (userName = event.nativeEvent.text)}
            />
            <TextInput
                style={styles.TextInput}
                placeholder="Email"
                autoComplete="email"
                onEndEditing={(event) => (email = event.nativeEvent.text)}
                onSubmitEditing={(event) => (email = event.nativeEvent.text)}
            />
            <TextInput
                style={styles.TextInput}
                placeholder="Password"
                autoComplete="new-password"
                onEndEditing={(event) => (password = event.nativeEvent.text)}
                onSubmitEditing={(event) => (password = event.nativeEvent.text)}
            />
            <TouchableOpacity
                style={styles.Button}
                onPress={() => {
                    if (userName && email && password) {
                        router.replace({
                            pathname: "../(Main-App)",
                        });
                    } else {
                        alert("Please fill all fields before signing up :D");
                    }
                }}
            >
                <Text style={textStyles.textBody}>Signup</Text>
            </TouchableOpacity>
            <StatusBar style="auto" />
        </View>
    );
}
