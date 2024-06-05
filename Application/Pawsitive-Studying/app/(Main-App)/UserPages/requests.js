import * as SecureStore from "expo-secure-store";
import { getID } from "../../(Login)/security.js";

const baseURL = "https://studybuddyserver.azurewebsites.net/";

function addAuthHeader(otherHeaders = {}) {
    const userToken = SecureStore.getItem("Token");
    if (userToken != null) {
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

export async function editUserTask(editTask) {
    try {
        const user_id = await SecureStore.getItemAsync("user_id");
        const url = `${baseURL}users/${user_id}/tasks/`;

        const response = await fetch(url, {
            method: "put",
            headers: addAuthHeader({
                "Content-Type": "application/json",
            }),
            body: JSON.stringify(editTask),
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error(`Failed to edit user task: ${response.status}`);
        }
    } catch (error) {
        throw new Error(`Error editing task: ${error.message}`);
    }
}

export async function completeUserTask(taskId) {
    try {
        const user_id = await SecureStore.getItemAsync("user_id");
        const url = `${baseURL}users/${user_id}/tasks/${taskId}/completed`;

        const response = await fetch(url, {
            method: "put",
            headers: addAuthHeader({
                "Content-Type": "application/json",
            }),
        });

        if (response.ok) {
            return response;
        } else {
            throw new Error(`Failed to edit user task: ${response.status}`);
        }
    } catch (error) {
        throw new Error(`Error complete task: ${error.message}`);
    }
}

export async function deleteUserTask(taskId) {
    try {
        const user_id = await SecureStore.getItemAsync("user_id");
        const url = `${baseURL}users/${user_id}/tasks/${taskId}`;

        const response = await fetch(url, {
            method: "delete",
            headers: addAuthHeader({
                "Content-Type": "application/json",
            }),
        });

        if (response.ok) {
            return response;
        } else {
            throw new Error(`Failed to delete task: ${response.statusText}`);
        }
    } catch (error) {
        // 捕获任何可能的错误，并将其抛出
        throw new Error(`Error deleting task: ${error.message}`);
    }
}
