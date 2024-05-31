import { Text, View } from "react-native";
import { styles } from "../../../Styles/comp_styles.jsx";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState, setState } from "react";
import CharacterTable from "../UserPages/characterTable.jsx";
import * as SecureStore from "expo-secure-store";
import { getID } from "../../(Login)/security.js";

const baseURL = "https://studybuddyserver.azurewebsites.net/";

async function getCharacters() {
    try {
        const token = await SecureStore.getItemAsync("Token");
        const userID = await getID();
        console.log(baseURL + "/characters");
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
        return {
            characters: characterList,
            userCharacters: userCharList.characters,
        };
    } catch (error) {
        console.error(error);
    }
}

export default function Char() {
    [characterInfo, setCharacters] = useState({
        characters: [],
        userCharacters: [],
    });

    useEffect(() => {
        getCharacters()
            .then((data) => {
                setCharacters(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    return (
        <View style={styles.container}>
            <CharacterTable
                characterLists={characterInfo.characters}
                userCharacters={characterInfo.userCharacters}
            />
            <StatusBar style="auto" />
        </View>
    );
}
