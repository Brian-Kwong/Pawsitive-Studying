import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, Character } from './schema.js'
import dotenv from 'dotenv';
dotenv.config();


const creds = [];

export async function registerUser(req, res) {
    const { name, pronouns, username, email, password, profileImage, tasks, characters } = req.body;
    console.log(req.body)

    if (!name || !pronouns || !username || !email || !password) {
        return res.status(400).send("Bad request: Invalid input data.");
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).send("Username already taken");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //This is where we would add the character to the database
        const newUser = new User({
            name,
            pronouns,
            username,
            email,
            password: hashedPassword,
            memberSince: new Date(),
            profileImage,
            tasks,
            characters
        });

        await newUser.save();

        const token = await generateAccessToken(username);
        res.status(201).send({ token });

    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

// This function generates a JWT token for the user
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

// This function verifies the JWT token
export function authenticateUser(req, res, next) {
    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        console.log("No token received");
        res.status(401).end();
    } else {
        jwt.verify(
            token,
            process.env.TOKEN_SECRET,
            (error, decoded) => {
                if (decoded) {
                    next();
                } else {
                    console.log("JWT error:", error);
                    res.status(401).end();
                }
            }
        );
    }
}

// This function logs in the user
export async function loginUser(req, res) {
    const { username, password } = req.body; // 从表单获取
    if (!username || !password) {
        return res.status(400).send("Bad request: Invalid input data.");
    }

    //this is where we would check if the user exists in the database
    try {
        const retrievedUser = await User.findOne({ username });
        if (!retrievedUser) {
            return res.status(401).send("Unauthorized: Invalid username or password");
        }

        const matched = await bcrypt.compare(password, retrievedUser.password);
        if (!matched) {
            return res.status(401).send("Unauthorized: Invalid username or password");
        }

        const token = await generateAccessToken(username);
        res.status(200).send({ token });

    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}