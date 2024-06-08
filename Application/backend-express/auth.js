import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, Character } from "./schema.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import crypto from "crypto";
dotenv.config();

const emailClient = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

export async function conflictUser(username) {
    User.findOne({ username }).then((user) => {
        if (user === null) {
            return false;
        }
        return true;
    });
}

export async function getUsers() {
    return User.find()
        .then((users) => {
            return users;
        })
        .catch((error) => {
            throw error;
        });
}

export async function registerUser(req, res) {
    const {
        name,
        pronouns,
        username,
        email,
        password,
        profileImage,
        tasks,
        characters,
    } = req.body;

    if (!name || !username || !email || !password) {
        return res.status(400).send("Bad request: Invalid input data.");
    }

    try {
        // 检查用户名是否已存在
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).send("Username already taken");
        }

        // 哈希密码
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
            profileImage: profileImage !== undefined ? profileImage : "None",
            points: 0,
            tasks,
            characters,
        });

        // 保存用户到数据库
        await newUser.save();

        // 生成JWT令牌
        const token = await generateAccessToken(username);
        res.status(201).send({ token });
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

// This function generates a JWT token for the user
function generateAccessToken(username, time) {
    return new Promise((resolve, reject) => {
        jwt.sign(
            { username: username },
            process.env.TOKEN_SECRET,
            { expiresIn: time ? time : "1d" },
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
    // 获取认证头的第二部分（令牌）
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        console.log("No token received");
        res.status(401).end();
    } else {
        jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
            if (decoded) {
                next();
            } else {
                console.log("JWT error:", error);
                res.status(401).end();
            }
        });
    }
}

// This function logs in the user
export async function loginUser(req, res) {
    const username = req.body["username"]; // 从表单获取
    const password = req.body["password"]; // 从表单获取
    if (!username || !password) {
        return res.status(400).send("Bad request: Invalid input data.");
    }

    //this is where we would check if the user exists in the database
    try {
        // 查找用户
        const retrievedUser = await User.findOne({ username });
        if (!retrievedUser) {
            return res
                .status(401)
                .send("Unauthorized: Invalid username or password");
        }

        // 验证密码
        const matched = await bcrypt.compare(password, retrievedUser.password);
        if (!matched) {
            return res
                .status(401)
                .send("Unauthorized: Invalid username or password");
        }

        // 生成JWT令牌
        const token = await generateAccessToken(username);
        res.status(200).send({ token });
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}

export const getUserByUsernameOrEmail = (username, email) => {
    let promise;
    if (username === undefined && email === undefined) {
        promise = User.find();
    } else if (username && !email) {
        promise = findUserByUsername(username);
    } else if (email && !username) {
        promise = findUserByEmail(email);
    } else if (username && email) {
        promise = findUserByUsernameAndEmail(username, email);
    }
    return promise;
};

function findUserByUsername(username) {
    return User.findOne({ username });
}

function findUserByEmail(email) {
    return User.findOne({ email });
}

function findUserByUsernameAndEmail(username, email) {
    return User.findOne({ username, email });
}

export const getUserById = (id) => {
    return User.findById(id);
};

export async function sendResetPasswordEmail(req, res) {
    try {
        const thirty_minutes = 30 * 60 * 1000;
        const username = req.body.username;
        let randomResetCode = await crypto.randomInt(0, 1000000);
        randomResetCode = randomResetCode.toString().padStart(6, "0");

        // Store in database
        const user = await User.findOne({ username });
        user.passwordResetToken.push({
            token: randomResetCode,
            expiration: new Date(Date.now() + thirty_minutes),
        });
        await user.save();

        // Send email
        await emailClient.sendMail({
            from: `"Study Buddy" <${process.env.EMAIL}>`,
            to: user.email,
            subject: "Password Reset",
            text: `Your password reset code is ${randomResetCode}`,
        });

        res.status(200).send(`Email sent to ${user.email}`);
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Internal Server Error");
    }
}

export async function resetPassword(req, res) {
    try {
        const { username, token, newPassword } = req.body;
        let user = await User.findOne({ username });
        if (!user) {
            return res.status(404).send("User not found");
        } else {
            let userResetTokens = user.passwordResetToken;
            if (
                userResetTokens.filter(
                    (item) =>
                        item.token.toString() === token.toString() &&
                        item.expiration.valueOf() > Date.now()
                ).length === 0
            ) {
                return res.status(401).send("Invalid reset token");
            } else {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(newPassword, salt);
                user.password = hashedPassword;
                user.passwordResetToken = [];
                await user.save();
                const jwt_token = await generateAccessToken(username, "1h");
                res.status(200).send({ token: jwt_token });
            }
        }
    } catch (error) {
        console.error("Error resetting password:", error);
    }
}

export async function findUser(req, res) {
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
}

export async function findUserByIds(req, res) {
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
}
