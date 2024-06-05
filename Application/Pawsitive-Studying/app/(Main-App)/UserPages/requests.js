import * as SecureStore from "expo-secure-store";

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

        const url = `${baseURL}searchSong?q=${query}`;
        console.log(`Searching for songs with URL: ${url}`);
        const response = await fetch(url, {
            method: "get",
            headers: headers,
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Search API response:", data);
            return data;
        } else {
            console.error("Search API error:", response.statusText);
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

        const url = `${baseURL}addSongToPlaylist`;
        console.log(`Adding song to playlist with URL: ${url}`);
        const response = await fetch(url, {
            method: "post",
            headers: headers,
            body: JSON.stringify({ playlistId, song }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Add song to playlist API response:", data);
            return data;
        } else {
            console.error("Add song to playlist API error:", response.statusText);
            throw new Error(`Failed to add song to playlist: ${response.statusText}`);
        }
    } catch (error) {
        console.error("Error adding song to playlist:", error);
        throw new Error(`Error adding song to playlist: ${error.message}`);
    }
}
