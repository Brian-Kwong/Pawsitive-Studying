import React, { useState, useRef, useEffect } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { CircularProgress } from 'react-native-circular-progress'
import { styles, textStyles } from '../../../Styles/comp_styles.jsx' // Import styles from comp-styles.jsx
import { useLocalSearchParams, useNavigation } from 'expo-router'

export default CountdownTimer = () => {
    const duration = useLocalSearchParams().time

    const navigation = useNavigation()

    useEffect(() => {
        navigation.setOptions({
            title: 'Timer',
            textStyles: textStyles.textHeader,
            headerBackTitle: 'Back',
        })
    }, [navigation])

    const [remainingTimeMin, setRemaningTimeMin] = useState(duration / 60)
    const [remainingTimeSec, setRemaningTimeSec] = useState(duration)
    const [progress, setProgress] = useState(100)
    const [isRunning, setIsRunning] = useState(false)

    useEffect(() => {
        if (isRunning) {
            const timer = setInterval(() => {
                let remainingTimeInSeconds = remainingTimeSec - 1
                setRemaningTimeSec(remainingTimeInSeconds)
                setRemaningTimeMin(Math.floor(remainingTimeInSeconds / 60))
                setProgress((remainingTimeInSeconds / duration) * 100)
            }, 1000)
            if (remainingTimeSec <= 0) {
                clearInterval(timer)
                setIsRunning(false)
            }
            return () => clearInterval(timer)
        }
    }, [remainingTimeSec, isRunning])

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
                        <View style={{ alignItems: 'center' }}>
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
                            ? 'Pause'
                            : `${duration === remainingTimeSec ? 'Start' : 'Resume'}`}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
