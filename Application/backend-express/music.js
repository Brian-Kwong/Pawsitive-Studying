import { application } from "express";
import { Playlist, User } from "./schema.js";
import dotenv from "dotenv";
// Music
// 音乐

dotenv.config();
const soundCloudAPIKey = process.env.SOUNDCLOUD_API_KEY;
const soundCloudURL = "https://api-v2.soundcloud.com/search/tracks";

// Function to search songs from SoundCloud
export async function searchSongs(req, res) {
    const searchTerm = req.query.q; // Ensure the query parameter is named correctly
    const url = `${soundCloudURL}?q=${searchTerm}&access=playable`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `OAuth ${soundCloudAPIKey}`,
            },
        });
        const data = await response.json();

        const songs = data.collection.map((song) => ({
            id: song.id,
            title: song.title,
            artist: song.user.username,
            duration: song.duration,
            artwork: song.artwork_url,
            url: song.permalink_url,
        }));

        res.status(200).json(songs);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch songs" });
    }
}

// Add Song to Playlist
export async function addSongToPlaylist(req, res) {
    const { playlistId, song } = req.body;

    try {
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({ error: "Playlist not found" });
        }

        playlist.songs.push(song);
        playlist.numberOfSongs += 1;

        await playlist.save();

        res.status(201).json(playlist);
    } catch (error) {
        res.status(500).json({ error: "Failed to add song to playlist" });
    }
}


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
                songs: playlistSongs.songs,
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

// Returns the streaming URL of the song
export async function getStreamURL(req, res) {
    const songId = req.params.songId;
    try {
        let song = await Playlist.findOne({ "songs._id": songId }); // gets the song from the database
        song = song.songs;
        song = song.find((s) => s._id.toString() === songId);
        if (song !== null) {
            const fetchStreamURL = fetch(song.songURL, {
                // fetches the song from the URL
                method: "GET",
                headers: {
                    Authorization: `OAuth ${soundCloudAPIKey}`,
                },
            });
            fetchStreamURL.then((response) => {
                // Gets the response
                // Returns streaming link
                if (response.status === 200) {
                    // Response good?
                    response.json().then((data) => {
                        if (data !== null) {
                            // Data good?
                            res.status(200).json(data);
                        } else {
                            res.status(404).send("Song not found");
                        }
                    });
                } else {
                    res.status(404).send("Song not found");
                }
            });
        } else {
            res.status(500).send("Internal server error");
        }
    } catch (error) {
        res.status(400).send("Bad request: Invalid input data.");
    }
}
