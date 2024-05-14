import { Stack } from 'expo-router/stack'
import { useNavigation } from 'expo-router'
import { useEffect } from 'react'

export default function Layout() {
    return (
        <Stack options={{ headerShown: false }}>
            <Stack.Screen name="(Tabs)" options={{ headerShown: false }} />
        </Stack>
    )
}
