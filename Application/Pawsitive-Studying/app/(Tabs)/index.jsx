import { Button, StyleSheet, Text, View, TextInput } from 'react-native'
import { styles } from '../../Styles/comp_styles.jsx'
import { StatusBar } from 'expo-status-bar'
import { router } from 'expo-router'

export default function Home() {
    return (
        <View style={styles.container}>
            <Text style={styles.textHeader}>🐈🐈Welcome!!🐈🐈</Text>
            <Button
                style={styles.Button}
                title="Go to Timer Page"
                onPress={() => {
                    router.push('../Timer/timer_page')
                }}
            />
            <StatusBar style="auto" />
        </View>
    )
}
