import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv';

import { registerUser, getUser } from "./auth.js"; 

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

//User registration
app.post("/register", registerUser);

//Get user data
app.get("/user", getUser);


app.listen(port, () => {
    console.log(
        `app listening at http://localhost:${port}`
    );
});
