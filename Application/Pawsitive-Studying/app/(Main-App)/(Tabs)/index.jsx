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

const sec_per_min = 60;
const gotoTimer = (time) => {
    router.push({
        pathname: `../Timer/timer_page`,
        params: { time: time },
    });
};

export default function Home() {
    const [modalVisible, setModalVisible] = useState(true); // Brent
    const [inputText, setInputText] = useState(""); // Brent

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
                        }}
                    />
                    <View
                        style={{
                            width: "100%",
                            height: "80%",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {/* Modal Title (Top Center) */}
                        <Text style={styles.textBody}>Add Tasks</Text>
                        {/* Add Buttons Here*/}
                        <Pressable
                            // Close Button TOP LEFT Modal
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <MaterialIcons
                                name="close"
                                color="#fff"
                                size={22}
                            />
                        </Pressable>
                        <Pressable
                            // Submit Task Button (This is a check mark icon)
                            // TOP RIGHT of Modal
                            // TODO: Change the onPress to Submit to tasks
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <MaterialIcons name="done" color="#fff" size={22} />
                        </Pressable>
                        <TextInput
                            // Task Entry Button
                            // CENTER of Modal
                            placeholder="Enter Task"
                            onChangeText={(text) => setInputText(text)}
                            value={inputText}
                        />
                        <TextInput
                            // Set Time Duration Button
                            // BOTTOM LEFT Modal
                            placeholder="Enter Time"
                            onChangeText={(text) => setInputText(text)}
                            value={inputText}
                        />
                        <Pressable
                            // Untimed Button BOTTOM Right Modal
                            // TODO: Change the onPress to highlight around button
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <Text style={styles.textStyle}>No Timer</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* This is outside of the modal */}

            {/* + Button on Home Screen */}
            <Pressable
                style={[styles.plusButtonContainer]}
                onPress={() => setModalVisible(true)}
            >
                {/* BRIAN this is the Icon did I do this right*/}
                <MaterialIcons name="add" color="#808080" size={20} />
            </Pressable>

            <Text style={textStyles.textHeader}>🐈🐈Welcome!!🐈🐈</Text>
            <View>
                <TouchableOpacity
                    style={styles.Button}
                    onPress={() => {
                        gotoTimer(10 * sec_per_min);
                    }}
                >
                    <Text style={textStyles.textBody}>
                        Timer For 10 Minutes
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.Button}
                    onPress={() => {
                        gotoTimer(20 * sec_per_min);
                    }}
                >
                    <Text style={textStyles.textBody}>
                        Timer For 20 Minutes
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.Button}
                    onPress={() => {
                        gotoTimer(30 * sec_per_min);
                    }}
                >
                    <Text style={textStyles.textBody}>
                        Timer For 30 Minutes
                    </Text>
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
