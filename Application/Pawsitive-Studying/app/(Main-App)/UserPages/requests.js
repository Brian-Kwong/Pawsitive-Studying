import * as SecureStore from "expo-secure-store";
import { getID } from "../../(Login)/security.js";

const baseURL = "https://studybuddyserver.azurewebsites.net/";

async function addAuthHeader(otherHeaders = {}) {
    const userToken = await SecureStore.getItemAsync("Token");
    if (userToken) {
        return {
            ...otherHeaders,
            Authorization: `Bearer ${userToken}`,
        };
    } else {
        return otherHeaders;
    }
}

export async function searchSongs(query) {
    try {
        const headers = await addAuthHeader({
            "Content-Type": "application/json",
        });

        const url = `${baseURL}searchSong?songName=${query}`;
        const response = await fetch(url, {
            method: "GET",
            headers: headers,
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error("Search API error:", response.status);
            throw new Error(`Failed to search songs: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error searching songs:", error);
        throw new Error(`Error searching songs: ${error.message}`);
    }
}

export async function addSongToPlaylist(playlistId, song) {
    try {
        const headers = await addAuthHeader({
            "Content-Type": "application/json",
        });
        const userID = await getID();
        const url = `${baseURL}users/${userID}/${playlistId}/song`;
        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(song),
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error("Add song to playlist API error:", response.status);
            throw new Error(
                `Failed to add song to playlist: ${response.statusText}`
            );
        }
    } catch (error) {
        console.error("Error adding song to playlist:", error);
        throw new Error(`Error adding song to playlist: ${error.message}`);
    }
}
