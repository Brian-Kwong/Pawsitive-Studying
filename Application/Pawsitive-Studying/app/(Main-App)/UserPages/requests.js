import * as SecureStore from "expo-secure-store";

const baseURL = "https://studybuddyserver.azurewebsites.net/"; // URL for login requests

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

export async function fetchUserTasks() {
    try {
        const user_id = await SecureStore.getItemAsync("user_id");
        const headers = await addAuthHeader({
            "Content-Type": "application/json",
        });

        const url = baseURL + "users/" + user_id + "/tasks";

        const response = await fetch(url, {
            method: "get",
            headers: headers,
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error(
                `Failed to fetch user tasks: ${response.statusText}`
            );
        }
    } catch (error) {
        throw new Error(`Error fetching user tasks: ${error.message}`);
    }
}

export async function addUserTask(newTask) {
    try {
        const user_id = await SecureStore.getItemAsync("user_id");
        const headers = await addAuthHeader({
            "Content-Type": "application/json",
        });

        const url = baseURL + "users/" + user_id + "/task";

        const response = await fetch(url, {
            method: "post",
            headers: headers,
            body: JSON.stringify(newTask),
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error(`Failed to add user task: ${response.statusText}`);
        }
    } catch (error) {
        throw new Error(`Error adding user task: ${error.message}`);
    }
}

// Add the new API calls

export async function searchSongs(query) {
    try {
        const headers = await addAuthHeader({
            "Content-Type": "application/json",
        });

        const url = `${baseURL}searchSong?q=${query}`;
        const response = await fetch(url, {
            method: "get",
            headers: headers,
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error(`Failed to search songs: ${response.statusText}`);
        }
    } catch (error) {
        throw new Error(`Error searching songs: ${error.message}`);
    }
}

export async function addSongToPlaylist(playlistId, song) {
    try {
        const headers = await addAuthHeader({
            "Content-Type": "application/json",
        });

        const url = `${baseURL}addSongToPlaylist`;
        const response = await fetch(url, {
            method: "post",
            headers: headers,
            body: JSON.stringify({ playlistId, song }),
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error(`Failed to add song to playlist: ${response.statusText}`);
        }
    } catch (error) {
        throw new Error(`Error adding song to playlist: ${error.message}`);
    }
}
