import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { User, Character } from './schema.js'
import dotenv from 'dotenv';


dotenv.config();


const creds = [];


//this function is used to login a user
export function registerUser(req, res) {
    const { username, pwd } = req.body; 
    if (!username || !pwd) {
        res.status(400).send("Bad request: Invalid input data.");
    } else if (creds.find((c) => c.username === username)) {
        res.status(409).send("Username already taken");
    } else {
        bcrypt.genSalt(10) //this function is used to generate a salt
            .then((salt) => bcrypt.hash(pwd, salt)) //this function is used to hash the password
            .then((hashedPassword) => { //this function is used to save the user to the database
                const newUser = new User({
                    username,
                    password: hashedPassword,
                    email: "",  // new
                    name: username,  // new
                });

                newUser.save() //this function is used to save the user to the database
                    .then(() => generateAccessToken(username))//this function is used to generate a token
                    .then((token) => {
                        console.log("token", token);
                        res.status(201).send({ token });
                        creds.push({ username, hashedPassword });
                    })
                    .catch((error) => {
                        console.error("Error saving user to the database:", error);
                        res.status(500).send("Internal server error");
                    });
            })
            .catch((error) => {
                console.error("Error hashing password:", error);
                res.status(500).send("Internal server error");
            });
    }
}

function generateAccessToken(username) {
    return new Promise((resolve, reject) => {
        jwt.sign(
            { username: username },
            process.env.TOKEN_SECRET,
            { expiresIn: "1d" },
            (error, token) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(token);
                }
            }
        );
    });
}


//this function is used to get a user
export async function getUser(req, res) {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).send("User not found");
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send("Internal server error");
    }
}

