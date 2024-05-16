import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication";

const loginURL = "http://10.151.71.149:3000/users/";

// Fetches login request from server
function login(username, password) {
    const url = loginURL + username + "/" + password;
    return fetch(url, {
        method: "GET",
    });
}

// This function logs in a user with a username and password
export function logInWithPassword(user) {
    return new Promise((resolve, reject) => {
        login(user.username, user.password)
            .then((response) => {
                SecureStore.setItemAsync("Username", user.username).then(() => {
                    SecureStore.setItemAsync("Password", user.password).then(
                        () => {
                            if (response.status === 200) {
                                response.json().then((data) => {
                                    if (data != null) {
                                        SecureStore.setItemAsync(
                                            "Token",
                                            data.token
                                        )
                                            .then(() => {
                                                resolve(200);
                                            })
                                            .catch((err) => {
                                                alert(
                                                    "Failed to store login Try restarting the app."
                                                );
                                                reject(err);
                                            });
                                    }
                                });
                            } else {
                                alert("Server failed to authenticate account");
                                reject(401);
                            }
                        }
                    );
                });
            })
            .catch((err) => {
                reject(err);
            });
    });
}

// This function logs in a user with FaceID
export function logInWithFaceID() {
    return new Promise((resolve, reject) => {
        LocalAuthentication.authenticateAsync({ disableDeviceFallback: false })
            .then((result) => {
                if (result.success) {
                    SecureStore.getItemAsync("Username").then((username) => {
                        if (username != null) {
                            SecureStore.getItemAsync("Password").then(
                                (password) => {
                                    if (password != null) {
                                        login(username, password)
                                            .then((response) => {
                                                if (response.status === 200) {
                                                    response
                                                        .json()
                                                        .then((data) => {
                                                            if (data != null) {
                                                                SecureStore.setItemAsync(
                                                                    "Token",
                                                                    data.token
                                                                )
                                                                    .then(
                                                                        () => {
                                                                            resolve(
                                                                                200
                                                                            );
                                                                        }
                                                                    )
                                                                    .catch(
                                                                        () => {
                                                                            // Failed to store token cant continue...
                                                                            alert(
                                                                                "Failed to store login Try restarting the app."
                                                                            );
                                                                            reject(
                                                                                400
                                                                            );
                                                                        }
                                                                    );
                                                            }
                                                        });
                                                } else {
                                                    alert(
                                                        // Cant find user
                                                        "Server failed to authenticate account"
                                                    );
                                                    reject(401);
                                                }
                                            })

                                            .catch((err) => {
                                                alert(
                                                    // User not found
                                                    `Server failed to authenticate account ${err}`
                                                );
                                                reject(err);
                                            });
                                    } else {
                                        alert(
                                            // Cant find previous user
                                            "No password stored You will need to login through username and password first."
                                        );
                                        reject(401);
                                    }
                                }
                            );
                        } else {
                            alert(
                                // Cant find previous user                                        // Cant find previous user
                                "No username stored You will need to login through username and password first."
                            );
                            reject(401);
                        }
                    });
                }
            })
            .catch(() => {
                alert("Failed to authenticate with FaceID ");
                reject(500);
            });
    });
}

export function makeNewUser(user) {
    return new Promise((resolve, reject) => {
        // Fetches signup request from server
        fetch(loginURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: user.name,
                pronouns: user.pronouns,
                username: user.username,
                email: user.email,
                password: user.password,
                memberSince: Date.now(),
                tasks: [],
                characters: [],
            }),
        })
            .then((response) => {
                if (response.status === 201) {
                    // Made new user okay
                    response
                        .json()
                        .then((data) => {
                            if (data !== null) {
                                // Store the token
                                SecureStore.setItemAsync("Token", data.token)
                                    .then(() => {
                                        resolve(200);
                                    })
                                    .catch(
                                        // Failed to store token
                                        () => {
                                            alert(
                                                "Failed to store login Try restarting the app."
                                            );
                                            reject(400);
                                        }
                                    );
                            }
                        })
                        .catch((err) => {
                            alert(err);
                            reject(410);
                        });
                } else if (response.status === 410) {
                    // Username already taken chose another one
                    alert("Username already taken");
                    reject(410);
                } else if (response.status >= 500) {
                    // Idk not my problem backend's problem
                    alert("Failed to create user Internal Server Error");
                    reject(500);
                } else {
                    alert("Failed to create user");
                    reject(500);
                }
            })
            .catch((err) => {
                // Something went wrong oops try again?
                alert(`Failed to create user ${err}`);
                reject(500);
            });
    });
}
