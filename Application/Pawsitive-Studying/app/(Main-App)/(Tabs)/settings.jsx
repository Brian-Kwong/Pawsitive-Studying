import { TouchableOpacity, Text, View, ScrollView } from 'react-native'
import { styles } from '../../../Styles/comp_styles.jsx'
import { StatusBar } from 'expo-status-bar'
import { Image } from 'expo-image'
import { router } from 'expo-router'

const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj['

export default function Settings() {
    return (
        <ScrollView>
            <View style={styles.topContainer}>
                <View
                    style={{
                        width: '30%',
                        aspectRatio: 1 / 1,
                        marginBottom: 20,
                        marginTop: 20,
                    }}
                >
                    <Image
                        style={{
                            resizeMode: 'stretch',
                            height: '100%',
                            width: '100%',
                            borderRadius: 360,
                        }}
                        placeholder={{ blurhash }}
                        source="https://images.unsplash.com/photo-1615497001839-b0a0eac3274c?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        contentFit="cover"
                    ></Image>
                </View>
                <Text style={styles.textHeader}>User Profile</Text>
                <View>
                    <TouchableOpacity
                        style={styles.LongButton}
                        onPress={() => {
                            // Do something
                        }}
                    >
                        <Text style={styles.textBody}>
                            Manage Study Preferences
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.LongButton}
                        onPress={() => {
                            // Do something
                        }}
                    >
                        <Text style={styles.textBody}>Manage Courses</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.LongButton}
                        onPress={() => {
                            // Do something
                        }}
                    >
                        <Text style={styles.textBody}>Calendar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.LongButton}
                        onPress={() => {
                            // Do something
                        }}
                    >
                        <Text style={styles.textBody}>Music</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.LongButton}
                        onPress={() => {
                            // Do something
                        }}
                    >
                        <Text style={styles.textBody}>Timer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.LongButton}
                        onPress={() => {
                            // Do something
                        }}
                    >
                        <Text style={styles.textBody}>Settings</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.LongButton}
                        onPress={() => {
                            router.replace({
                                pathname: `../../(Login)`,
                            })
                        }}
                    >
                        <Text style={styles.textBody}>Log Out</Text>
                    </TouchableOpacity>
                </View>
                <StatusBar style="auto" />
            </View>
        </ScrollView>
    )
}
