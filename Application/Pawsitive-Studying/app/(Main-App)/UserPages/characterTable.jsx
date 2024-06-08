import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { styles, textStyles } from "../../../Styles/comp_styles.jsx";
import { StyleSheet } from "react-native";

const tableStyles = StyleSheet.create({
    tableContainer: {
        backgroundColor: "#F0F5FA",
    },
    cell: {
        backgroundColor: "#F0F5FA",
        alignItems: "center",
        justifyContent: "center",
        wiidth: "100%",
        aspectRatio: 1 / 1.7,
    },
    imageProp: {
        width: "90%",
        aspectRatio: 1 / 1.2,
    },
});

export default function CharacterTable(characterList) {
    const characters = characterList.characterLists;
    const userCharacters = characterList.userCharacters;
    if (characters.length === 0) {
        return (
            <View style={styles.topContainer}>
                <Text style={textStyles.textHeader}>Loading.</Text>
            </View>
        );
    } else {
        return (
            <View style={{ width: "100%", height: "90%" }}>
                <ScrollView
                    style={{ width: "100%", height: "90%" }}
                    contentContainerStyle={tableStyles.tableContainer}
                    horizontal={true}
                >
                    {characters.map((character) => {
                        const userOwns =
                            userCharacters.length > 0 &&
                            userCharacters.includes(character._id);
                        return (
                            <View style={tableStyles.cell} key={character._id}>
                                <Text
                                    style={[
                                        textStyles.textHeader,
                                        { opacity: userOwns ? 1 : 0.5 },
                                    ]}
                                >
                                    {character.name}
                                </Text>
                                <Image
                                    style={[
                                        tableStyles.imageProp,
                                        { opacity: userOwns ? 1 : 0.5 },
                                    ]}
                                    source={{
                                        uri:
                                            "data:image/png;base64," +
                                            character.image,
                                    }}
                                />
                                <Text
                                    style={[
                                        textStyles.textBody,
                                        { opacity: userOwns ? 1 : 0.5 },
                                    ]}
                                >
                                    {character.description}
                                </Text>
                                <TouchableOpacity
                                    style={[
                                        styles.Button,
                                        { opacity: userOwns ? 0.5 : 1 },
                                    ]}
                                    onPress={() => {
                                        if (!userOwns) {
                                            characterList.purchaseCharacter(
                                                character._id
                                            );
                                            return;
                                        }
                                        // Purchase character
                                    }}
                                >
                                    <Text>
                                        Purchase ({character.pointsRequired})
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                </ScrollView>
            </View>
        );
    }
}
