import React, { useState, useRef } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { CircularProgress } from 'react-native-circular-progress'
import { styles, textStyles } from '../../Styles/comp_styles.jsx' // Import styles from comp-styles.jsx

export default CountdownTimer = ({ duration }) => {
    duration = 60
    const [remainingTimeMin, setRemaningTimeMin] = useState(0)
    const [remainingTimeSec, setRemaningTimeSec] = useState(0)
    const [progress, setProgress] = useState(100)
    const [isRunning, setIsRunning] = useState(false)
    const timerRef = useRef(null)

    const startTimer = () => {
        setIsRunning(true)
        const startTime = Date.now() // Convert seconds to milliseconds
        timerRef.current = setInterval(() => {
            let remainingTimeInSeconds
            if (remainingTimeSec === 0) {
                const currentTime = Date.now()
                remainingTimeInSeconds =
                    duration - Math.floor((currentTime - startTime) / 1000)
            } // Convert milliseconds to seconds
            else {
                remainingTimeInSeconds = remainingTimeSec - 1
            }
            setRemaningTimeSec(remainingTimeInSeconds)
            setRemaningTimeMin(Math.floor(remainingTimeInSeconds / 60))
            console.log(remainingTimeInSeconds)
            setProgress((remainingTimeInSeconds / duration) * 100)
            if (remainingTimeInSeconds <= 0) {
                clearInterval(timerRef.current)
                setIsRunning(false)
            }
        }, 1000)
    }

    const pauseTimer = () => {
        setIsRunning(false)
        clearInterval(timerRef.current)
    }

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
                        <View>
                            <Text style={textStyles.textSubHeader}>
                                {remainingTimeMin}m
                            </Text>
                            <Text style={textStyles.textSubHeader}>
                                {remainingTimeSec}s
                            </Text>
                        </View>
                    )}
                </CircularProgress>
                <TouchableOpacity
                    onPress={isRunning ? pauseTimer : startTimer}
                    style={styles.countdownButton}
                >
                    <Text style={styles.countdownButtonText}>
                        {isRunning ? 'Pause' : 'Start'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
