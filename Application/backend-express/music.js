import { Playlist, User } from "./schema.js";
import dotenv from "dotenv";
// Music
// 音乐

dotenv.config();
const soundCloudAPIKey = process.env.SOUNDCLOUD_API_KEY;
const soundCloudURL = "https://api-v2.soundcloud.com/search/tracks";

// Get playlists
export async function getPlaylist(req, res) {
    const userId = req.params.id;
    const playlistID = req.query.playlistID;
    try {
        let playlists = 8;
        if (playlistID !== undefined) {
            playlists = await Playlist.findById(playlistID);
        } else {
            playlists = await Playlist.find({ creator: userId });
        }
        playlists !== null
            ? res.status(200).json(playlists)
            : res.status(404).send("No playlist not found");
    } catch (error) {
        console.log(error);
        res.status(404).send("Playlists not found");
    }
}

export async function addPlaylist(req, res) {
    const userId = req.params.id;
    const playlist = req.body;
    try {
        let newPlaylist = {
            name: playlist.name,
            description: playlist.description,
            numberOfSongs: playlist.songs.length,
            creator: userId,
            songs: playlist.songs.map((song) => {
                return {
                    songName: song.songName,
                    length: song.length,
                    artist: song.artist,
                    artistCoverURL: song.artistCoverURL,
                    songURL: song.songURL,
                    soundCloudURL: song.soundCloudURL,
                };
            }),
        };
        newPlaylist = new Playlist(newPlaylist); // Makes a new playlist
        await newPlaylist.save(); // Saves to DB
        res.status(201).json(newPlaylist);
    } catch (error) {
        console.log(error);
        res.status(400).send("Bad request: Invalid input data.");
    }
}

export function findSong(req, res) {
    const songId = req.query.songId;
    try {
        const song = Playlist.findOne({ "songs._id": songId });
        song !== null
            ? res.status(200).json(song)
            : res.status(404).send("Song not found");
    } catch {
        res.status(404).send("Song not found");
    }
}

// Adds a song to the given  playlist Returns the updated playlist
export async function addSong(req, res) {
    const playlistId = req.params.playlistId;
    const song = req.body;
    try {
        if (playlistId === null || song === null) {
            res.status(400).send("Bad request: Invalid input data.");
            return;
        }

        if (
            song.name === null ||
            song.length === null ||
            song.artist === null ||
            song.songURL === null ||
            song.soundCloudURL === null
        ) {
            res.status(400).send("Bad request: Invalid input data.");
            return;
        }

        const newSong = {
            songName: song.name,
            length: song.length,
            artist: song.artist,
            artistCoverURL: song.artistCoverURL,
            songURL: song.songURL,
            soundCloudURL: song.soundCloudURL,
        };
        let playlistSongs = await Playlist.findById(playlistId).select("songs"); // Gets the cuurent user's playlists
        let playlistSize =
            await Playlist.findById(playlistId).select("numberOfSongs");
        playlistSongs.songs.push(newSong); // Updates their playlists list with the new playlist
        const newPlaylist = await Playlist.findByIdAndUpdate(
            // Updates the user's playlists list on the DB
            playlistId,
            {
                songs: playlistSongs,
                numberOfSongs: playlistSize.numberOfSongs + 1,
            },
            { new: true }
        );
        res.status(201).json(newPlaylist);
    } catch (error) {
        console.log(error);
        res.status(400).send("Bad request: Invalid input data.");
    }
}

export async function fetchSongFromSoundCloud(req, res) {
    const songName = req.query.songName;
    console.log(`${soundCloudURL}?q=${songName}&access=playable`);
    const request = fetch(`${soundCloudURL}?q=${songName}&access=playable`, {
        method: "GET",
        headers: {
            Authorization: `OAuth ${soundCloudAPIKey}`,
        },
    });
    await request
        .then((response) => {
            if (response.status === 200) {
                response.json().then((data) => {
                    //console.log(data);
                    //console.log(data.collection);
                    const newSongs = data.collection
                        .map((song) => {
                            if (!song.media) {
                                return null;
                            }
                            return {
                                songName: song.title,
                                length: Math.floor(song.duration / 1000),
                                artist: !song.publisher_metadata
                                    ? "Unknown"
                                    : song.publisher_metadata.artist,
                                artistCoverURL: song.artwork_url,
                                songURL: song.media.transcodings[0].url,
                                soundCloudURL: song.permalink_url,
                            };
                        })
                        .filter((song) => song !== null);
                    res.status(200).json(newSongs);
                });
            } else {
                console.log(response.status);
                res.status(404).send("Song not found");
            }
        })
        .catch((error) => {
            res.status(500).send("Internal server error");
        });
}
