import {
    TouchableOpacity,
    StyleSheet,
    Text,
    View,
    TextInput,
} from "react-native";
import { styles, textStyles } from "../../../Styles/comp_styles.jsx";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { getID } from "../../(Login)/security.js";
import { useState } from "react";

const sec_per_min = 60;
const gotoTimer = (time) => {
    router.push({
        pathname: `../Timer/timer_page`,
        params: { time: time },
    });
};

export default function Home() {
    const { userID, setUserID } = useState(null);

    getID().then((id) => {
        console.log(id);
        setUserID(id);
    });

    return (
        <View style={styles.container}>
            <Text style={textStyles.textHeader}>🐈🐈Welcome!!🐈🐈</Text>
            <View>
                <TouchableOpacity
                    style={styles.Button}
                    onPress={() => {
                        gotoTimer(10 * sec_per_min);
                    }}
                >
                    <Text style={textStyles.textBody}>
                        Timer For 10 Minutes
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.Button}
                    onPress={() => {
                        gotoTimer(20 * sec_per_min);
                    }}
                >
                    <Text style={textStyles.textBody}>
                        Timer For 20 Minutes
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.Button}
                    onPress={() => {
                        gotoTimer(30 * sec_per_min);
                    }}
                >
                    <Text style={textStyles.textBody}>
                        Timer For 30 Minutes
                    </Text>
                </TouchableOpacity>
            </View>

            <StatusBar style="auto" />
        </View>
    );
}
