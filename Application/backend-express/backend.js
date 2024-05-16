import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { registerUser, loginUser, conflictUser } from './auth.js'
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const port = process.env.PORT || 3000

const mongoUser = process.env.MONGO_USER
const mongoPwd = process.env.MONGO_PWD
const mongoCluster = process.env.MONGO_CLUSTER

let mongoURI

if (mongoUser && mongoPwd) {
    //mongoURI = `mongodb://${mongoUser}:${mongoPwd}@localhost:27017/${mongoCluster}?authSource=admin`;
    mongoURI = `mongodb+srv://${mongoUser}:${mongoPwd}@${mongoCluster}.yzdyxed.mongodb.net/StudyBuddy?retryWrites=true&w=majority&appName=StudyBuddy/`
} else {
    //mongoURI = `mongodb://localhost:27017/${mongoCluster}`;
}

mongoose
    .connect(mongoURI)
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error)
    })

app.post('/signup', registerUser)
app.post('/login', loginUser)

/* GET <server>/login/user?username=
                    <username>password=<password>
            returns user token */
app.get('/users', (req, res) => {
    // generate the user token, do I import?
    // 200 Get request for successful retrieval
    return loginUser(req, res).then(() => {})
})

// POST <server>/user new user to db
app.post('/users', (req, res) => {
    const newUser = req.body
    const username = req.query.username
    // Check if username already exists
    conflictUser(username).then((conflict) => {
        if (conflict) {
            return res.status(409).send('Username already taken')
        }
        // Call register user if not exists
        else registerUser(req, res).then(() => {})
    })
})

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
})
