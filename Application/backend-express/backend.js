import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
    getUserTasks,
    addUserTask,
    removeUserTask,
    editTasksDetails,
    getCompletedTasks,
    markTaskAsDone,
    getUserUsername,
    addUserUsername,
    getUserEmail,
    addUserEmail,
    getUserName,
    addUserName,
    getUserProfileImage,
    addUserProfileImage,
    addPoints,
} from "./user.js";
import { getCharacters, addCharToUser } from "./chracters.js";
import {
    registerUser,
    loginUser,
    authenticateUser,
    getUserByUsernameOrEmail,
    getUserById,
    sendResetPasswordEmail,
    resetPassword,
} from "./auth.js";
import {
    addPlaylist,
    getPlaylist,
    addSong,
    fetchSongFromSoundCloud,
    getStreamURL,
    findSong,
    getPlaylistStreamURL,
} from "./music.js";

import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let memServer;

export function initDatabase() {
    return new Promise((resolve, reject) => {
        MongoMemoryServer.create()
            .then((mongo) => {
                const mongoURI = mongo.getUri();
                mongoose
                    .connect(mongoURI)
                    .then(() => {
                        memServer = mongo;
                        //console.log("Connected to MongoDB");
                        resolve();
                    })
                    .catch((error) => {
                        console.error("Error connecting to MongoDB:", error);
                        reject(error);
                    });
            })
            .catch((error) => {
                console.error("Error starting database:", error);
                reject(error);
            });
    });
}

export function closeDatabase() {
    return new Promise((resolve, reject) => {
        memServer
            .stop()
            .then(() => {
                mongoose.connection.close().then(() => {
                    //console.log("Disconnected from MongoDB");
                    resolve();
                });
            })
            .catch((error) => {
                console.error("Error stopping database:", error);
                reject(error);
            });
    });
}

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

/* GET <server>/login/user?username=
                    <username>password=<password>
            returns user token */
app.post("/login", loginUser);

// POST <server>/user new user to db
app.post("/signup", registerUser);

app.get("/users/:id/tasks", authenticateUser, getUserTasks);
app.post("/users/:id/task", authenticateUser, addUserTask);

app.get("/user", (req, res) => {
    const { username, email } = req.query;
    getUserByUsernameOrEmail(username, email)
        .then((user) => {
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.json(user);
        })
        .catch((error) => {
            console.error("Error fetching user:", error);
            res.status(500).json({ error: "Internal server error" });
        });
});

app.get("/user/:id", (req, res) => {
    const { id } = req.params;
    getUserById(id)
        .then((user) => {
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.json(user);
        })
        .catch((error) => {
            console.error("Error fetching user:", error);
            res.status(500).json({ error: "Internal server error" });
        });
});

app.get("/users/:id/playlists", authenticateUser, getPlaylist);
app.post("/users/:id/playlist", authenticateUser, addPlaylist);
app.post("/users/:id/:playlistId/song", authenticateUser, addSong);
app.get("/searchSong", authenticateUser, fetchSongFromSoundCloud);
app.get("/song/:id", authenticateUser, findSong);
app.get("/songs/stream/:songId", authenticateUser, getStreamURL);
app.get(
    "/songs/stream/playlist/:playlistId",
    authenticateUser,
    getPlaylistStreamURL
);

// Character endpoints
app.get("/characters", authenticateUser, getCharacters);
app.get("/users/:id/characters", authenticateUser, getCharacters);
app.post("/users/:id/character", authenticateUser, addCharToUser);

// Updating tasks
app.delete("/users/:id/tasks/:taskId", authenticateUser, removeUserTask);
app.put("/users/:id/tasks/", authenticateUser, editTasksDetails);
app.get("/users/:id/tasks/completed", authenticateUser, getCompletedTasks);
app.put("/users/:id/tasks/:taskId/completed", authenticateUser, markTaskAsDone);

// Reset password
app.put("/send-reset-password", sendResetPasswordEmail);
app.put("/reset-password", resetPassword);

// Brent
// ADD ENDPOINTS FOR SETTINGS
// ACTUAL GET to get user from database
// Edit with new data
// Object.save to update

// Name
app.get("/users/:id/name", authenticateUser, getUserName);
app.put("/users/:id/name", authenticateUser, addUserName);
// Username
app.get("/users/:id/username", authenticateUser, getUserUsername);
app.put("/users/:id/username", authenticateUser, addUserUsername);
// Email
app.get("/users/:id/email", authenticateUser, getUserEmail);
app.put("/users/:id/email", authenticateUser, addUserEmail);
// Profile Picture
app.get("/users/:id/profileImage", authenticateUser, getUserProfileImage);
app.put("/users/:id/profileImage", authenticateUser, addUserProfileImage);

// Add points
app.put("/users/:id/addPoints", authenticateUser, addPoints, markTaskAsDone);

export default app;
