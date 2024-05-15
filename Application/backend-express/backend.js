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
    mongoURI = `mongodb+srv://${mongoUser}:${mongoPwd}@${mongoCluster}.mongodb.net/myDatabase?retryWrites=true&w=majority`;
} else {
    mongoURI = `mongodb://localhost:27017/${mongoCluster}`;
}

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

app.post("/signup", registerUser);

app.get("/user/:username", getUser);

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
});
