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
app.get("/users/:username/:password", (req, res) => {
    // generate the user token, do I import?
    // 200 Get request for successful retrieval
    return loginUser(req, res)
        .then(() => {})
        .catch(() => {}); //Error handling done in async function
});

// POST <server>/user new user to db
app.post("/users", (req, res) => {
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

//get all users
app.get("/users", authenticateUser, async (req, res) => {
    getUsers()
        .then((users) => {
            res.status(200).send(users);
        })
        .catch(() => {
            res.status(500).send("Internal Server Error");
        });
});

app.get("/users/:id/tasks", authenticateUser, getUserTasks);
app.post("/users/:id/task", authenticateUser, addUserTask);

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
});

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
