import { Stack } from "expo-router/stack";
import "react-native-reanimated";

export default function Layout() {
    return (
        <Stack>
            <Stack.Screen name="(Login)" options={{ headerShown: false }} />
            <Stack.Screen name="(Main-App)" options={{ headerShown: false }} />
        </Stack>
    );
}
