import {
    TouchableOpacity,
    StyleSheet,
    Text,
    View,
    TextInput,
    Modal,
    Pressable,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons"; // For + button
import React, { useState } from "react"; // added brent
import { styles, textStyles } from "../../../Styles/comp_styles.jsx";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useEffect } from "react";
import { useNavigation } from "expo-router";

const gotoTimer = (time) => {
    router.push({
        pathname: "/UserPages/timer_page",
        params: { time: time },
    });
};

export default function Home() {
    const [modalVisible, setModalVisible] = useState(false); // Brent
    const [inputText, setInputText] = useState(""); // Brent
    const [timerText, setTimerText] = useState(""); // Brent

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            title: "Timer Selection",
            textStyles: textStyles.textHeader,
            headerBackTitle: "Back",
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Modal
                // Brent
                // Create the modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalView}>
                    <View
                        style={{
                            width: "110%",
                            height: "20%",
                            backgroundColor: "#90E4C1",
                            top: "-5%",
                            left: "0%",
                            justifyContent: "flex-end",
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        {/* Add Buttons Here*/}
                        <Pressable
                            // Close Button TOP LEFT Modal
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <MaterialIcons
                                name="close"
                                color="#fff"
                                size={32}
                            />
                        </Pressable>
                    </View>
                    <View
                        style={{
                            width: "100%",
                            height: "80%",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {/* Modal Title (Top Center) */}
                        {/* <Text style={styles.textBody}>Add Tasks</Text>
                        <Pressable
                            // Submit Task Button (This is a check mark icon)
                            // TOP RIGHT of Modal
                            // TODO: Change the onPress to Submit to tasks
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <MaterialIcons name="done" color="#fff" size={22} />
                        </Pressable> */}
                        <TextInput
                            // Set Time Duration Button
                            // BOTTOM LEFT Modal
                            style={styles.inputModal}
                            placeholder="Enter Time"
                            placeholderTextColor="#888"
                            onChangeText={(text) => setTimerText(text)}
                            value={timerText}
                        />
                        <Pressable
                            // Untimed Button BOTTOM Right Modal
                            // TODO: Change the onPress to highlight around button
                            onPress={() => {
                                setModalVisible(!modalVisible);
                                gotoTimer(timerText);
                            }}
                        >
                            <Text style={styles.textStyle}>Start Timer</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* This is outside of the modal */}

            {/* + Button on Home Screen */}

            <Text style={textStyles.textHeader}>Study Timer</Text>
            <View>
                <TouchableOpacity
                    style={styles.Button}
                    onPress={() => {
                        gotoTimer(20);
                    }}
                >
                    <Text style={textStyles.textBody}>
                        Timer For 20 Minutes
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.Button}
                    onPress={() => {
                        gotoTimer(30);
                    }}
                >
                    <Text style={textStyles.textBody}>
                        Timer For 30 Minutes
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.Button}
                    onPress={() => {
                        gotoTimer(45);
                    }}
                >
                    <Text style={textStyles.textBody}>
                        Timer For 45 Minutes
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.Button}
                    onPress={() => {
                        setModalVisible(true);
                    }}
                >
                    <Text style={textStyles.textBody}>Custom Timer</Text>
                </TouchableOpacity>
            </View>

            <StatusBar style="auto" />
        </View>
    );
}

// When + button is pressed on Home Screen, open Modal
// IN MODAL VIEW
// On X button press, close out Modal
// On CHECK button press, add to tasks if valid
/* On Big Button press, open 
     a Modal text box to enter what task is */
// 2 Small Buttons Below
// Bottom Left: On Press Enter Time (Mins)
// Bottom Right: Untimed (Don't add time)
// When bottom right is pressed, highlight it
