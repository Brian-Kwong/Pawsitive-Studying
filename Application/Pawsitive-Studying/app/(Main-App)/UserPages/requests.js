import * as SecureStore from "expo-secure-store";

const baseURL = "https://studybuddyserver.azurewebsites.net/"; // URL for login requests


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

export async function fetchUserTasks() {
    try {
        const user_id = await SecureStore.getItemAsync("user_id");

        const url = baseURL + "users/" + user_id + "/tasks";

        const response = await fetch(url, {
            method: "get",
            headers: addAuthHeader({
                "Content-Type": "application/json",
            }),
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
        // 捕获任何可能的错误，并将其抛出
        throw new Error(`Error fetching user tasks: ${error.message}`);
    }
}

export async function addUserTask(newTask) {
    try {
        const user_id = await SecureStore.getItemAsync("user_id");
        const url = baseURL + "users/" + user_id + "/task";

        const response = await fetch(url, {
            method: "post",
            headers: addAuthHeader({
                "Content-Type": "application/json",
            }),
            body: JSON.stringify(newTask),
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error(`Failed to add user task: ${response.statusText}`);
        }
    } catch (error) {
        // 捕获任何可能的错误，并将其抛出
        throw new Error(`Error adding user task: ${error.message}`);
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
            body: JSON.stringify(editTask)
        });

        if(response.ok) {
            const data = await response.json();
            return data;
        } else{
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
            })
        })


        if(response.ok) {
            return response
        } else{
            throw new Error(`Failed to edit user task: ${response.status}`);
        }


    } catch(error){
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
            return response
        } else {
            throw new Error(`Failed to delete task: ${response.statusText}`);
        }
    } catch (error) {
        // 捕获任何可能的错误，并将其抛出
        throw new Error(`Error deleting task: ${error.message}`);
    }
}