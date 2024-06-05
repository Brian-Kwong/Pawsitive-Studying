import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "expo-router";
import { textStyles } from "../../../Styles/comp_styles.jsx";
import { searchSongs, addSongToPlaylist } from './requests';

const baseURL = "https://studybuddyserver.azurewebsites.net/"; // URL for login requests

const MusicPage = () => {
    const [songRecommendation, setSongRecommendation] = useState(null);
    const [playlist, setPlaylist] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedSong, setSelectedSong] = useState(null);
    const [playlists, setPlaylists] = useState([]);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            title: "Music",
            textStyles: textStyles.textHeader,
            headerBackTitle: "Back",
        });

        const fetchPlaylist = async () => {
            try {
                const token = await SecureStore.getItemAsync("Token");
                const user_id = await SecureStore.getItemAsync("user_id");
                const response = await fetch(`${baseURL}/users/${user_id}/playlists`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                setPlaylist(data);
                setPlaylists(data.map(pl => ({ label: pl.name, value: pl._id })));
                const randomPlaylist = data[Math.floor(Math.random() * data.length)];
                setSongRecommendation(randomPlaylist.songs[Math.floor(Math.random() * randomPlaylist.songs.length)]);
            } catch (error) {
                console.error("Error fetching playlist:", error);
            }
        };
        fetchPlaylist();
    }, []);

    const handleSearch = async () => {
        const results = await searchSongs(searchTerm);
        setSearchResults(results);
    };

    const handleAddSong = async () => {
        if (!selectedSong || !value) return;

        const response = await addSongToPlaylist(value, selectedSong);
        if (response) {
            alert('Song added successfully');
            setSelectedSong(null);
            setValue(null);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Music</Text>
            <TextInput
                style={styles.searchBar}
                value={searchTerm}
                onChangeText={setSearchTerm}
                placeholder="Search for a song"
            />
            <TouchableOpacity style={styles.button} onPress={handleSearch}>
                <Text style={styles.buttonText}>Search</Text>
            </TouchableOpacity>
            {songRecommendation && (
                <View style={styles.recommendationContainer}>
                    <Image
                        source={{ uri: songRecommendation.albumArt || "https://images.unsplash.com/3/www.madebyvadim.com.jpg?q=80&w=2964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }}
                        style={styles.albumArt}
                    />
                    <Text style={styles.songTitle}>{songRecommendation.title}</Text>
                    <Text style={styles.songArtist}>{songRecommendation.artist}</Text>
                </View>
            )}
            <DropDownPicker
                open={dropdownOpen}
                value={selectedPlaylist}
                items={playlists}
                setOpen={setDropdownOpen}
                setValue={setSelectedPlaylist}
                placeholder="Select a playlist"
                containerStyle={styles.dropdownContainer}
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownList}
            />
            <FlatList
                data={playlist}
                keyExtractor={item => item._id}
                renderItem={({ item }) => (
                    <View style={styles.songItem}>
                        <Text style={styles.songText}>{item.name}</Text>
                    </View>
                )}
            />
            {selectedSong && (
                <View style={styles.dropdownContainer}>
                    <DropDownPicker
                        open={open}
                        value={value}
                        items={playlists}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setPlaylists}
                        placeholder="Select a playlist"
                        containerStyle={{ height: 40 }}
                        style={{ backgroundColor: "#fafafa" }}
                        dropDownStyle={{ backgroundColor: "#fafafa" }}
                    />
                    <TouchableOpacity style={styles.button} onPress={handleAddSong}>
                        <Text style={styles.buttonText}>Add to Playlist</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    searchBar: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        marginBottom: 20,
    },
    recommendationContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    albumArt: {
        width: 200,
        height: 200,
        marginBottom: 10,
        borderRadius: 10,
    },
    songTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    songArtist: {
        fontSize: 16,
        color: "#888",
    },
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
    songItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    songText: {
        fontSize: 16,
    },
    button: {
        backgroundColor: 'blue',
        padding: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default MusicPage;
