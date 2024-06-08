import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication";

const baseURL = "https://studybuddyserver.azurewebsites.net/"; // URL for login requests

export async function getID() {
    return await SecureStore.getItemAsync("user_id")
        .then((id) => {
            if (id != null) {
                return id;
            } else {
                return null;
            }
        })
        .catch(() => {
            return null;
        });
}

function saveID(username, token) {
    let idURL = baseURL + "user";
    return new Promise((resolve, reject) => {
        fetch(idURL + `?username=${username}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (response.status === 200) {
                    response.json().then((data) => {
                        SecureStore.setItemAsync("user_id", data._id).then(
                            () => {
                                resolve(200);
                            }
                        );
                    });
                } else {
                    reject(response.status);
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
}

// Fetches login request from server
function login(username, password) {
    const loginURL = baseURL + "login";
    return fetch(loginURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            password: password,
        }),
    });
}

function savePassword(password) {
    return new Promise((resolve, reject) => {
        if (SecureStore.canUseBiometricAuthentication()) {
            SecureStore.setItemAsync("Password", password, {
                requireAuthentication: true,
                authenticationPrompt:
                    "2FA : Authenticate to store password for future logins",
            })
                .then(() => {
                    resolve(200);
                })
                .catch((err) => {
                    console.log(err);
                    reject(err);
                });
        } else {
            return resolve(200);
        }
    });
}

// This function logs in a user with a username and password
export function logInWithPassword(user) {
    return new Promise((resolve, reject) => {
        login(user.username, user.password)
            .then((response) => {
                SecureStore.setItemAsync("Username", user.username).then(() => {
                    savePassword(user.password).then(() => {
                        if (response.status === 200) {
                            response.json().then((data) => {
                                if (data != null) {
                                    SecureStore.setItemAsync(
                                        "Token",
                                        data.token
                                    )
                                        .then(() => {
                                            saveID(user.username, data.token)
                                                .then(() => {
                                                    resolve(200);
                                                })
                                                .catch((err) => {
                                                    alert(
                                                        "Failed to store user id Try restarting the app."
                                                    );
                                                    reject(err);
                                                });
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
                    });
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
        if (SecureStore.canUseBiometricAuthentication()) {
            SecureStore.getItemAsync("Username")
                .then((username) => {
                    if (username != null) {
                        SecureStore.getItemAsync("Password", {
                            requireAuthentication: true,
                            authenticationPrompt:
                                "Authenticate to login with FaceID",
                        })
                            .then((password) => {
                                if (password != null) {
                                    login(username, password)
                                        .then((response) => {
                                            if (response.status === 200) {
                                                response.json().then((data) => {
                                                    if (data != null) {
                                                        SecureStore.setItemAsync(
                                                            "Token",
                                                            data.token
                                                        )
                                                            .then(() => {
                                                                saveID(
                                                                    username,
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
                                                                        (
                                                                            err
                                                                        ) => {
                                                                            alert(
                                                                                "Failed to store user id Try restarting the app."
                                                                            );
                                                                            reject(
                                                                                err
                                                                            );
                                                                        }
                                                                    );
                                                            })
                                                            .catch(() => {
                                                                // Failed to store token cant continue...
                                                                alert(
                                                                    "Failed to store login Try restarting the app."
                                                                );
                                                                reject(400);
                                                            });
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
                            })
                            .catch(() => {
                                reject(401);
                            });
                    } else {
                        alert(
                            // Cant find previous user                                        // Cant find previous user
                            "No username stored You will need to login through username and password first."
                        );
                        reject(401);
                    }
                })
                .catch(() => {
                    reject(401);
                });
        } else {
            alert(
                "Cannot use FaceID login with this device. Maybe you are using Expo Go? FaceID is not supported in Expo Go."
            );
            reject(500);
        }
    });
}

export function makeNewUser(user) {
    return new Promise((resolve, reject) => {
        // Fetches signup request from server
        const signupURL = baseURL + "signup";
        fetch(signupURL, {
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
                                        saveID(user.username, data.token)
                                            .then(() => {
                                                resolve(200);
                                            })
                                            .catch((err) => {
                                                alert(
                                                    "Failed to store user id Try restarting the app."
                                                );
                                                reject(err);
                                            });
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

export function sendPasswordResetRequest(username) {
    return new Promise((resolve, reject) => {
        fetch(`${baseURL}/send-reset-password`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
            }),
        })
            .then((response) => {
                if (response.status === 200) {
                    response.text().then((data) => {
                        if (data !== null) {
                            resolve(data);
                        } else {
                            alert("Unable to find user");
                            reject(404);
                        }
                    });
                } else {
                    alert("Unable to find user");
                    reject(404);
                }
            })
            .catch((err) => {
                alert("Failed to send reset password request", err);
                reject(err);
            });
    });
}

// Code for resetting password
export function resetPassword(username, token, newPassword) {
    return new Promise((resolve, reject) => {
        fetch(`${baseURL}/reset-password`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                token: token,
                newPassword: newPassword,
            }),
        })
            .then((response) => {
                if (response.status === 200) {
                    response.json().then((data) => {
                        if (data !== null) {
                            savePassword(newPassword)
                                .then(() => {
                                    saveID(username, data.token)
                                        .then(() => {
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
                                        })
                                        .catch((err) => {
                                            alert(
                                                "Failed to store user id Try restarting the app."
                                            );
                                            reject(err);
                                        });
                                })
                                .catch((err) => {
                                    alert(
                                        "Failed to store login Try restarting the app."
                                    );
                                    reject(err);
                                });
                        } else {
                            alert("Unable to find user");
                            reject(404);
                        }
                    });
                } else {
                    console.log(response.status);
                    alert("Incorrect token. Please try again.");
                    reject(404);
                }
            })
            .catch((err) => {
                alert("Failed to reset password", err);
                reject(err);
            });
    });
}
