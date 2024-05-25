import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { getUserTasks, addUserTask } from "./user.js";
import {
    registerUser,
    loginUser,
    conflictUser,
    authenticateUser,
    getUsers,
    getUserByUsernameOrEmail,
    getUserById,
} from "./auth.js";
import serverless from "serverless-http";
import {
    addPlaylist,
    getPlaylist,
    addSong,
    fetchSongFromSoundCloud,
} from "./music.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

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
app.get("/login/:username/:password", (req, res) => {
    // generate the user token, do I import?
    // 200 Get request for successful retrieval
    return loginUser(req, res)
        .then(() => {})
        .catch(() => {}); //Error handling done in async function
});

// POST <server>/user new user to db
app.post("/signup", (req, res) => {
    const username = req.query.username;
    // Check if username already exists
    conflictUser(username).then((conflict) => {
        // Return 409 if username already exists
        if (conflict) {
            return res.status(409).send("Username already taken");
        }
        // Call register user if not exists
        else {
            registerUser(req, res)
                .then(() => {})
                .catch(() => {}); //Error handling done in async function
        }
    });
});

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
