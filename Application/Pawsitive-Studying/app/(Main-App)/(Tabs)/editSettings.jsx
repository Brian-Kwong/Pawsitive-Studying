// Change Profile Picture (Pressable) Image Selector Base 64 Compression Quality<0.3
// Make boxes name email username button (password)
// Make endpoints to change everything new file in the backend
import { TouchableOpacity, Text, View, ScrollView } from "react-native";
import { styles } from "../../../Styles/comp_styles.jsx";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
export default function editSettings() {
    // Profile Picture (Circle)
    // Edit Name Button
    // Edit Username Button
    // Edit Email Button
    <View style={styles.topContainer}>
        <Text style={styles.textHeader}>Edit User</Text>
        <View>
            {"Profile Picture Circle Icon"}
            <Pressable
                onPress={onPress}
                style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: 'white',
                justifyContent: 'center',
                alignItems: 'center',
            }}
            >
            </Pressable>

            {"Change Name"}
            <TouchableOpacity
                        style={styles.LongButton}
                        onPress={() => {
                            // On press should pop up textbox to type in
                            // then should push to backend
                        }}
                    >
                        <Text style={styles.textBody}>
                            Change Name
                        </Text>
                    </TouchableOpacity>
            {"Change Username"}
            <TouchableOpacity
                        style={styles.LongButton}
                        onPress={() => {
                            // On press should pop up textbox to type in
                            // then should push to backend
                        }}
                    >
                        <Text style={styles.textBody}>Change Username</Text>
            </TouchableOpacity>
            {"Change Email"}
            <TouchableOpacity
                        style={styles.LongButton}
                        onPress={() => {
                            // On press should pop up textbox to type in
                            // then should push to backend
                        }}
                    >
                        <Text style={styles.textBody}>Change Email</Text>
            </TouchableOpacity>

        </View>
    </View>
}
