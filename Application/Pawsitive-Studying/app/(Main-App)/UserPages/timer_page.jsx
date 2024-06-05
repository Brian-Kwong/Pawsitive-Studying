import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, Text, Modal } from "react-native";
import { CircularProgress } from "react-native-circular-progress";
import MusicPlayer from "../Player/player.jsx";
import { styles, textStyles } from "../../../Styles/comp_styles.jsx"; // Import styles from comp-styles.jsx
import { useLocalSearchParams, useNavigation } from "expo-router";
import { completeUserTask } from "./requests.js";
import * as SecureStore from "expo-secure-store";

const baseURL = "https://studybuddyserver.azurewebsites.net/";

export default CountdownTimer = () => {
    const duration = useLocalSearchParams().time;
    const taskId = useLocalSearchParams()._id;

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            title: "Timer",
            textStyles: textStyles.textHeader,
            headerBackTitle: "Back",
        });
    }, [navigation]);

    const [remainingTimeMin, setRemaningTimeMin] = useState(duration / 60);
    const [remainingTimeSec, setRemaningTimeSec] = useState(duration);
    const [progress, setProgress] = useState(100);
    const [isRunning, setIsRunning] = useState(false);

    const [playlistData, setPlaylistData] = useState([]); // State for playlist data

    async function completeTask() {
        try {
            const r = await completeUserTask(taskId, duration / 60);
        } catch (error) {
            console.error("Error complete task:", error);
        }
    }

    useEffect(() => {
        if (isRunning) {
            const timer = setInterval(() => {
                let remainingTimeInSeconds = remainingTimeSec - 1;
                setRemaningTimeSec(remainingTimeInSeconds);
                setRemaningTimeMin(Math.floor(remainingTimeInSeconds / 60));
                setProgress((remainingTimeInSeconds / duration) * 100);
            }, 1000);
            if (remainingTimeSec <= 0) {
                clearInterval(timer);
                setIsRunning(false);
                completeTask();
            }
            return () => clearInterval(timer);
        }
    }, [remainingTimeSec, isRunning]);

    async function fetchPlaylistData() {
        const token = await SecureStore.getItemAsync("Token");
        const user_id = await SecureStore.getItemAsync("user_id");
        const response = await fetch(`${baseURL}/users/${user_id}/playlists`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.ok) {
            const data = await response.json();
            setPlaylistData(data);
        } else {
            alert("Failed to fetch playlist data");
            return;
        }
    }

    // Fetches playlist data
    useEffect(() => {
        fetchPlaylistData();
    });

    return (
        <View style={styles.container}>
            <View style={styles.countdownContainer}>
                <CircularProgress
                    size={200}
                    width={10}
                    fill={progress}
                    tintColor="#3498db"
                    backgroundColor="#f0f0f0"
                    rotation={0}
                    lineCap="round"
                >
                    {() => (
                        <View style={{ alignItems: "center" }}>
                            <Text style={textStyles.textSubHeader}>
                                {remainingTimeMin}m
                            </Text>
                            <Text style={textStyles.textSubHeader}>
                                {remainingTimeSec % 60}s
                            </Text>
                        </View>
                    )}
                </CircularProgress>
                <TouchableOpacity
                    onPress={() => setIsRunning(!isRunning)}
                    style={styles.countdownButton}
                >
                    <Text style={styles.countdownButtonText}>
                        {isRunning
                            ? "Pause"
                            : `${duration === remainingTimeSec || remainingTimeSec <= 0 ? "Start" : "Resume"}`}
                    </Text>
                </TouchableOpacity>
            </View>
            <MusicPlayer playlistData={playlistData} />
        </View>
    );
};
