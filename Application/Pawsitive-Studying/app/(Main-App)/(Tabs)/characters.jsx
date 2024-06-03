import { Text, View } from "react-native";
import { styles, textStyles } from "../../../Styles/comp_styles.jsx";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState, setState } from "react";
import CharacterTable from "../UserPages/characterTable.jsx";
import * as SecureStore from "expo-secure-store";
import { getID } from "../../(Login)/security.js";

const baseURL = "https://studybuddyserver.azurewebsites.net/";

export default function Char() {
    [characterInfo, setCharacters] = useState({
        characters: [],
        userCharacters: [],
    });
    [userPoints, setPoints] = useState(0);

    async function getCharacters() {
        try {
            const token = await SecureStore.getItemAsync("Token");
            const userID = await getID();
            let response = await fetch(baseURL + "/characters", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Network failed to fetch characters.");
            }
            const characterList = await response.json();
            response = await fetch(`${baseURL}/users/${userID}/characters`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Network failed to fetch user characters.");
            }
            const userCharList = await response.json();
            setCharacters({
                characters: characterList,
                userCharacters: userCharList.characters,
            });
        } catch (error) {
            console.error(error);
        }
    }

    async function getPoints() {
        const token = await SecureStore.getItemAsync("Token");
        const userID = await getID();
        let response = await fetch(`${baseURL}/user/${userID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error("Network failed to fetch user points.");
        } else {
            const user = await response.json();
            setPoints(user.points);
        }
    }

    async function purchaseCharacter(id) {
        const token = await SecureStore.getItemAsync("Token");
        const userID = await getID();
        let data = await fetch(`${baseURL}/users/${userID}/character`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ characterID: id }),
        });
        if (data.ok) {
            alert("Character purchased!");
            setCharacters({
                characters: characterInfo.characters,
                userCharacters: [...characterInfo.userCharacters, id],
            });
            getPoints();
        } else if (data.status === 400) {
            alert("Insufficient funds.");
        } else {
            alert("Failed to purchase character.");
        }
    }

    useEffect(() => {
        getCharacters();
        getPoints();
    }, []);

    return (
        <View style={styles.container}>
            <Text
                style={[
                    textStyles.textSubHeader,
                    { alignSelf: "flex-end", padding: "2%" },
                ]}
            >
                Points {userPoints}
            </Text>
            <CharacterTable
                characterLists={characterInfo.characters}
                userCharacters={characterInfo.userCharacters}
                purchaseCharacter={purchaseCharacter}
            />
            <StatusBar style="auto" />
        </View>
    );
}
