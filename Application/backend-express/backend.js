import express from "express";
import cors from "cors";
import mongoose from "mongoose";
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
    sendResetPasswordEmail,
    resetPassword,
    findUser,
    findUserByIds,
} from "./auth.js";
import serverless from "serverless-http";
import {
    addPlaylist,
    getPlaylist,
    addSong,
    fetchSongFromSoundCloud,
    getStreamURL,
    findSong,
    getPlaylistStreamURL,
} from "./music.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

const port = process.env.PORT || 3000;

const mongoUser = process.env.MONGO_USER;
const mongoPwd = process.env.MONGO_PWD;
const mongoCluster = process.env.MONGO_CLUSTER;

let mongoURI;

// Swapped to cloud database for testing
// Allows universal access to database and shared dataa
// Integrate with Vercel
if (mongoUser && mongoPwd) {
    mongoURI = `mongodb+srv://${mongoUser}:${mongoPwd}@${mongoCluster}.yzdyxed.mongodb.net/StudyBuddy?retryWrites=true&w=majority&appName=StudyBuddy/`;
} else {
    throw new Error("MongoDB username or password not found");
}

mongoose
    .connect(mongoURI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });

/* GET <server>/login/user?username=
                    <username>password=<password>
            returns user token */
app.post("/login", loginUser);

// POST <server>/user new user to db
app.post("/signup", registerUser);

app.get("/users/:id/tasks", authenticateUser, getUserTasks);
app.post("/users/:id/task", authenticateUser, addUserTask);

app.get("/user", authenticateUser, findUser);

app.get("/user/:id", authenticateUser, findUserByIds);

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

// Binds socket to port
const server = async () =>
    app.listen(port, () => {
        console.log(`REST API  is listening at ${port}`);
    });

// Starts server
server();

// Lambda handler
const handler = serverless(app);
export async function handleStart(context, req) {
    const res = await handler(context, req);
    return res;
}
