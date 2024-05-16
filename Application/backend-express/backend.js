import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import {getUserTasks,addUserTask} from "./user.js"
import { registerUser, loginUser, authenticateUser } from "./auth.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

const mongoUser = process.env.MONGO_USER;
const mongoPwd = process.env.MONGO_PWD;
const mongoCluster = process.env.MONGO_CLUSTER;

let mongoURI;

if (mongoUser && mongoPwd) {
    mongoURI = `mongodb://${mongoUser}:${mongoPwd}@localhost:27017/${mongoCluster}?authSource=admin`;
} else {
    mongoURI = `mongodb://localhost:27017/${mongoCluster}`;
}

mongoose.connect(mongoURI).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

app.post("/signup", registerUser);
app.post('/login', loginUser);

//get all users
app.get('/users', authenticateUser, async (req, res) => {  
    try {
        const users = await User.find();
        res.status(200).send(users);
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }
});


app.get('/users/:id/tasks', authenticateUser, getUserTasks);
app.post('/users/:id/task',authenticateUser, addUserTask);

app.listen(port, () => {
    console.log(
        `app listening at http://localhost:${port}`
    );
});