import { TouchableOpacity, TextInput, View, Text } from 'react-native'
import { styles, textStyles } from '../../../Styles/comp_styles.jsx'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router'

var userTime = 0 // User input time

export default function TimerPage() {
    const [time, timer] = useState(useLocalSearchParams().time)
    const [timerOn, setTimerOn] = useState(false)

    userTime = useLocalSearchParams().time

    const navigation = useNavigation()

    useEffect(() => {
        navigation.setOptions({
            title: 'Timer',
            textStyles: textStyles.textHeader,
            headerBackTitle: 'Back',
        })
    }, [navigation])

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
            <Text style={textStyles.textHeader}>
                {Math.floor(time / 60)} M {time % 60} S{' '}
            </Text>
            <View style={styles.horzContainer}>
                <TouchableOpacity
                    style={styles.Button}
                    onPress={() => {
                        setTimerOn(!timerOn)
                    }}
                >
                    <Text style={textStyles.textBody}>
                        {timerOn
                            ? 'Pause Timer'
                            : `${userTime === time ? 'Start Timer' : 'Resume Timer'}`}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.Button}
                    onPress={() => {
                        setTimerOn(false)
                        timer(userTime)
                    }}
                >
                    <Text style={textStyles.textBody}>Reset Timer</Text>
                </TouchableOpacity>
            </View>
            <StatusBar style="auto" />
        </View>
    )
}
