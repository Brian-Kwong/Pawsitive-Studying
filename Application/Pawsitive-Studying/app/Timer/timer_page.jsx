import { Button, TextInput, View, Text } from 'react-native'
import { styles } from '../../Styles/comp_styles.jsx'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'

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
                defaultValue="Enter time in seconds"
                onSubmitEditing={(e) => {
                    timer(e.nativeEvent.text)
                }}
            ></TextInput>
            <Button
                title="Start Timer"
                onPress={() => {
                    setTimerOn(true)
                }}
            />
            <StatusBar style="auto" />
        </View>
    )
}
