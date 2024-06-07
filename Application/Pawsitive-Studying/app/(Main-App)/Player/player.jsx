import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Button,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import Slider from "@react-native-community/slider";
import TrackPlayer, {
    Capability,
    useProgress,
    State,
} from "react-native-track-player";

import * as SecureStore from "expo-secure-store";
import { useTrackPlayerEvents, Event } from "react-native-track-player";

const baseURL = "https://studybuddyserver.azurewebsites.net/";

async function getSongUrls(playlistID) {
    const token = await SecureStore.getItemAsync("Token");
    const response = await fetch(
        `${baseURL}songs/stream/playlist/${playlistID}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );
    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        alert("Failed to fetch song data");
        return;
    }
}

async function newPlaylist(playlistID, playlists) {
    let songURLs = await getSongUrls(playlistID);
    let playlist = playlists.filter(
        (pl) => pl._id.toString() === playlistID.toString()
    )[0];
    const playlistName = playlist.name;
    const playlistSongs = playlist.songs;
    let tracks = playlistSongs.map((pl) => {
        return {
            url: songURLs[playlistSongs.indexOf(pl)],
            title: pl.songName,
            album: playlistName,
            artwork: pl.artistCoverURL,
            headers: {
                Authorization: `OAuth ${process.env.EXPO_PUBLIC_SOUND_CLOUD_API}`,
            },
        };
    });

    await TrackPlayer.stop(); // 停止播放器
    await TrackPlayer.removeUpcomingTracks(); // 移除所有队列中的曲目
    await TrackPlayer.add(tracks);
}

async function setupTrack(playlist, playlistName, songURLs, setupCurrent) {
    let tracks = playlist.map((pl) => {
        return {
            url: songURLs[playlist.indexOf(pl)],
            title: pl.songName,
            album: playlistName,
            artist: pl.artist,
            artwork: pl.artistCoverURL,
            headers: {
                Authorization: `OAuth 2-295991-308098488-GhuX8stsw0qvqi`,
            },
        };
    });

    await TrackPlayer.add(tracks);

    if (tracks.length <= 0) return;
    setupCurrent({
        title: tracks[0].title,
        artist: tracks[0].artist,
        album: tracks[0].album,
        artwork: tracks[0].artwork,
    });
    // 设置播放器选项
    TrackPlayer.updateOptions({
        stopWithApp: true,
        capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
        ],
    });
}

const MusicPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [modalVisible, setModalVisible] = useState(true);
    const [playlistFull, setPlaylistFull] = useState([]);
    const [playlist, setPlaylist] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [currentSong, setCurrentSong] = useState({
        title: "",
        artist: "",
        album: "",
        artwork: "",
    });
    const events = [Event.PlaybackActiveTrackChanged];

    async function fetchPlaylistData() {
        const token = await SecureStore.getItemAsync("Token");
        const user_id = await SecureStore.getItemAsync("user_id");
        const response = await fetch(`${baseURL}/users/${user_id}/playlists`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.ok) {
            const data = await response.json();
            await setPlaylistFull(data);
            let playlist = data.map((pl) => ({
                label: pl.name,
                value: pl._id,
            }));
            setPlaylist(playlist);
            return data;
        } else {
            alert("Failed to fetch playlist data");
            return;
        }
    }

    useTrackPlayerEvents(events, (event) => {
        if (event.type === Event.PlaybackActiveTrackChanged) {
            if (event.track === undefined) return;
            setCurrentSong({
                title: event.track.title,
                artist: event.track.artist,
                album: event.track.album,
                artwork: event.track.artwork,
            });
        }
    });

    useEffect(() => {
        fetchPlaylistData().then((playlistFull) => {
            if (playlistFull.length > 0) {
                const randomPlaylist =
                    playlistFull[
                        Math.floor(Math.random() * playlistFull.length)
                    ];
                getSongUrls(randomPlaylist._id).then((songURLs) => {
                    setupTrack(
                        randomPlaylist.songs,
                        randomPlaylist.name,
                        songURLs,
                        setCurrentSong
                    ).then(() => {
                        return async () => {
                            await TrackPlayer.stop(); // 停止播放器
                            await TrackPlayer.removeUpcomingTracks(); // 移除所有队列中的曲目
                        };
                    });
                });
            }
        });
    }, []);

    const progress = useProgress();
    const play = async () => await TrackPlayer.play();
    const pause = async () => await TrackPlayer.pause();
    const skipToNext = async () => await TrackPlayer.skipToNext();
    const skipToPrevious = async () => await TrackPlayer.skipToPrevious();

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
        if (isPlaying) {
            pause();
        } else {
            play();
        }
    };

    return (
        <View style={styles.container}>
            <Image
                source={{
                    uri:
                        currentSong.artwork === ""
                            ? "https://cdn.pixabay.com/audio/2024/01/15/16-58-27-753_200x200.jpg"
                            : `${currentSong.artwork}`,
                }}
                style={styles.albumCover}
            />
            <View style={styles.infoAndControls}>
                <Text style={styles.songTitle}>
                    {currentSong.title === undefined || currentSong.title === ""
                        ? "Unknown"
                        : currentSong.title}
                </Text>
                <Text style={styles.albumInfo}>
                    {currentSong.artist === undefined ||
                    currentSong.artist === ""
                        ? "Unknown"
                        : currentSong.artist}
                </Text>
                <Slider
                    style={styles.trackProgress}
                    value={progress.position}
                    minimumValue={0}
                    maximumValue={progress.duration}
                    onValueChange={(value) => TrackPlayer.seekTo(value)}
                    minimumTrackTintColor="#1FB28A"
                    maximumTrackTintColor="#000000"
                    thumbTintColor="#1FB28A"
                />
                <View style={styles.controls}>
                    <TouchableOpacity
                        onPress={() => {
                            console.log("Open play-list");
                        }}
                    >
                        <MaterialIcons
                            name="playlist-play"
                            size={24}
                            color="black"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={skipToPrevious}>
                        <MaterialIcons
                            name="skip-previous"
                            size={24}
                            color="black"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={togglePlayPause}>
                        <MaterialIcons
                            name={isPlaying ? "pause" : "play-arrow"}
                            size={24}
                            color="black"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={skipToNext}>
                        <MaterialIcons
                            name="skip-next"
                            size={24}
                            color="black"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <MaterialIcons
                            name="volume-up"
                            size={24}
                            color="black"
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <Modal
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={modalStyles.modalContainer}>
                    <Text style={modalStyles.modalTitle}>Select Playlist</Text>
                    <DropDownPicker
                        open={dropdownOpen}
                        value={selectedPlaylist}
                        items={playlist}
                        setOpen={setDropdownOpen}
                        setValue={setSelectedPlaylist}
                        placeholder="Select a playlist"
                        containerStyle={modalStyles.dropdownContainer}
                        style={modalStyles.dropdown}
                        dropDownContainerStyle={modalStyles.dropdownList}
                    />
                    <Button
                        title="Select Playlist"
                        onPress={() => {
                            if (selectedPlaylist !== null) {
                                newPlaylist(selectedPlaylist, playlistFull);
                            }
                            setModalVisible(false);
                        }}
                    />
                    <Button
                        title="Cancel"
                        onPress={() => setModalVisible(false)}
                    />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ccc", // 轻灰色背景
        borderRadius: 20,
        padding: 20,
        width: "100%",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        alignItems: "center", // 中心对齐子项
    },
    albumCover: {
        width: 100, // 增加图片大小
        height: 100, // 增加图片大小
        borderRadius: 10,
        marginBottom: 10, // 增加底部边距
    },
    infoAndControls: {
        width: "90%", // 容器宽度调整
        justifyContent: "space-around",
        alignItems: "center", // 居中对齐所有子项
    },
    songTitle: {
        fontSize: 18, // 增加字体大小
        fontWeight: "bold",
        color: "#000",
        marginVertical: 5, // 增加垂直外边距
    },
    albumInfo: {
        fontSize: 16, // 增加字体大小
        color: "#666",
        marginBottom: 10, // 增加底部边距
    },
    controls: {
        flexDirection: "row",
        justifyContent: "space-around", // 平均分布控件
        width: "100%", // 控制宽度为容器宽度
        marginTop: 10, // 增加顶部外边距
    },
    trackProgress: {
        width: "100%", // 进度条宽度
        height: 40, // 调整高度以防遮挡
        marginVertical: 10, // 增加垂直外边距防止遮挡
    },
});

const modalStyles = StyleSheet.create({
    dropdownContainer: {
        height: 40,
        marginBottom: 20,
    },
    dropdown: {
        backgroundColor: "#fafafa",
        borderColor: "#ccc",
    },
    dropdownList: {
        backgroundColor: "#fafafa",
        borderColor: "#ccc",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
});

export default MusicPlayer;
