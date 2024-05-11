import { Stack } from 'expo-router/stack'
import 'react-native-reanimated'

export default function Layout() {
    return (
        <Stack>
            <Stack.Screen name="(Tabs)" options={{ headerShown: false }} />
        </Stack>
    )
}
