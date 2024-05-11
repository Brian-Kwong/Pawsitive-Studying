import { Button, TextInput, View, Text } from 'react-native'
import { styles } from '../../Styles/comp_styles.jsx'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'

var userTime = 0 // User input time

export default function TimerPage() {
    const [time, timer] = useState(0)
    const [timerOn, setTimerOn] = useState(false)

    /* Timer function */
    useEffect(() => {
        if (timerOn) {
            const one_sec_timer = setInterval(() => {
                timer(time - 1)
            }, 1000)
            if (time <= 0) {
                setTimerOn(false)
            }
            return () => clearInterval(one_sec_timer)
        }
    }, [time, timerOn])

    return (
        <View style={styles.container}>
            <Text style={styles.textHeader}>{time} seconds </Text>
            <TextInput
                style={styles.TextInput}
                placeholder="Enter time in seconds"
                onSubmitEditing={(e) => {
                    userTime = e.nativeEvent.text
                    timer(userTime)
                }}
            ></TextInput>
            <Button
                title={timerOn ? 'Pause Timer' : 'Start Timer'}
                onPress={() => {
                    setTimerOn(!timerOn)
                }}
            />
            <Button
                title="Reset Timer"
                onPress={() => {
                    setTimerOn(false)
                    timer(userTime)
                }}
            />
            <StatusBar style="auto" />
        </View>
    )
}
