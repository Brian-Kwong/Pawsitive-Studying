import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User, Character } from './schema.js'
import dotenv from 'dotenv'
dotenv.config()

const creds = []

export async function conflictUser(username) {
    User.findOne({ username }).then((user) => {
        console.log(user)
        if (user === null) {
            console.log('User does not exist')
            return false
        }
        return true
    })
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
    } = req.body
    console.log(req.body)

    if (!name || !username || !email || !password) {
        return res.status(400).send('Bad request: Invalid input data.')
    }

    try {
        // 检查用户名是否已存在
        const existingUser = await User.findOne({ username })
        if (existingUser) {
            return res.status(409).send('Username already taken')
        }

        // 哈希密码
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // 创建新用户
        const newUser = new User({
            name,
            pronouns,
            username,
            email,
            password: hashedPassword,
            memberSince: new Date(),
            profileImage,
            tasks,
            characters,
        })

        // 保存用户到数据库
        await newUser.save()

        // 生成JWT令牌
        const token = await generateAccessToken(username)
        res.status(201).send({ token })
    } catch (error) {
        res.status(500).send('Internal Server Error')
    }
}

function generateAccessToken(username) {
    return new Promise((resolve, reject) => {
        jwt.sign(
            { username: username },
            process.env.TOKEN_SECRET,
            { expiresIn: '1d' },
            (error, token) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(token)
                }
            }
        )
    })
}

export function authenticateUser(req, res, next) {
    const authHeader = req.headers['authorization']
    // 获取认证头的第二部分（令牌）
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
        console.log('No token received')
        res.status(401).end()
    } else {
        jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
            if (decoded) {
                next()
            } else {
                console.log('JWT error:', error)
                res.status(401).end()
            }
        })
    }
}

export async function loginUser(req, res) {
    const username = req.params['username'] // 从表单获取
    const password = req.params['password'] // 从表单获取
    console.log(username, password)
    if (!username || !password) {
        return res.status(400).send('Bad request: Invalid input data.')
    }

    try {
        // 查找用户
        const retrievedUser = await User.findOne({ username })
        if (!retrievedUser) {
            return res
                .status(401)
                .send('Unauthorized: Invalid username or password')
        }

        // 验证密码
        const matched = await bcrypt.compare(password, retrievedUser.password)
        if (!matched) {
            return res
                .status(401)
                .send('Unauthorized: Invalid username or password')
        }

        // 生成JWT令牌
        const token = await generateAccessToken(username)
        res.status(200).send({ token })
    } catch (error) {
        res.status(500).send('Internal Server Error')
    }
}
