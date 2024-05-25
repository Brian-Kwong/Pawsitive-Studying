import mongoose from "mongoose";

const Schema = mongoose.Schema;

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
            data: Buffer,
            contentType: String,
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
            data: Buffer,
            contentType: String,
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
        creater: {
            type: Schema.Types.ObjectId,
            ref: "Users",
        },
        songs: [
            {
                name: {
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
    { collation: "Playlists" }
);

const User = mongoose.model("User", userSchema);
const Character = mongoose.model("Characters", charactersSchema);
const Playlist = mongoose.model("Playlists", playlistSchema);

export { User, Character, Playlist };
