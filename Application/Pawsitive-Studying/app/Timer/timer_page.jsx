import { Button, TextInput, View } from 'react-native'
import { styles } from '../../Styles/comp_styles.jsx'
import { StatusBar } from 'expo-status-bar'

export default function TimerPage() {
    const startTimer = (time = 1) => {
        const timer = setInterval(() => {
            time -= 1
            if (time <= 0) {
                clearInterval(timer)
                alert('Time is up!')
            }
        }, 1000)
    }
    var time = 0
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.TextInput}
                defaultValue="Enter time in seconds"
                onSubmitEditing={(e) => {
                    time = e.nativeEvent.text
                    console.log(time)
                }}
            ></TextInput>
            <Button
                title="Start Timer"
                onPress={() => {
                    console.log(`Starting timer... ${time} seconds`)
                    startTimer(time)
                }}
            />
            <StatusBar style="auto" />
        </View>
    )
}
