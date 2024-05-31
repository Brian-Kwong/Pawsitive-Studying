import mongoose from "mongoose";

const Schema = mongoose.Schema;
const thirty_min_in_ms = 1800000;

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        pronouns: {
            type: String,
            trim: true,
        },
        username: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
        memberSince: {
            type: Date,
            required: true,
            default: Date(),
        },
        profileImage: {
            type: String,
            default: "None",
        },
        points: {
            type: Number,
            required: true,
            default: 0,
        },
        tasks: [
            {
                name: {
                    type: String,
                    required: true,
                    trim: true,
                },
                course: {
                    type: String,
                    trim: true,
                    default: "None",
                },
                description: {
                    type: String,
                    trim: true,
                    default: "None",
                },
                time: {
                    type: Number,
                    required: true,
                    default: 0,
                },
                points: {
                    type: Number,
                    required: true,
                    default: 0,
                },
            },
        ],
        characters: [
            {
                type: Schema.Types.ObjectId,
                ref: "Characters",
            },
        ],
        passwordResetToken: [
            {
                token: {
                    type: Number,
                    required: true,
                    trim: true,
                },
                expiration: {
                    type: Date,
                    required: true,
                    default: Date(Date.now() + thirty_min_in_ms),
                },
            },
        ],
    },
    { collection: "Users" }
);

const charactersSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            default: "None",
        },
        pointsRequired: {
            type: Number,
            required: true,
            default: 0,
        },
        image: {
            type: String,
            default: "None",
        },
    },
    { collection: "Characters" }
);

const playlistSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            default: "None",
        },
        numberOfSongs: {
            type: Number,
            required: true,
            default: 0,
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: "Users",
        },
        songs: [
            {
                songName: {
                    type: String,
                    required: true,
                    trim: true,
                },
                length: {
                    type: Number,
                    required: true,
                },
                artist: {
                    type: String,
                    required: true,
                    trim: true,
                },
                artistCoverURL: {
                    type: String,
                    required: false,
                    trim: true,
                },
                songURL: {
                    type: String,
                    required: true,
                    trim: true,
                },
                soundCloudURL: {
                    type: String,
                    required: true,
                    trim: true,
                },
            },
        ],
    },
    { collection: "Playlists" }
);

const User = mongoose.model("User", userSchema);
const Character = mongoose.model("Characters", charactersSchema);
const Playlist = mongoose.model("Playlists", playlistSchema);

export { User, Character, Playlist };
