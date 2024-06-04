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

const MusicPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedSong, setSelectedSong] = useState(null);
    const [playlists, setPlaylists] = useState([]);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);

    useEffect(() => {
        const fetchPlaylists = async () => {
            const user_id = await SecureStore.getItemAsync("user_id");
            const response = await fetch(`/users/${user_id}/playlists`);
            const playlists = await response.json();
            setPlaylists(playlists.map(pl => ({ label: pl.name, value: pl.id })));
        };

        fetchPlaylists();
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
            <TextInput
                style={styles.input}
                value={searchTerm}
                onChangeText={setSearchTerm}
                placeholder="Search for a song"
            />
            <TouchableOpacity style={styles.button} onPress={handleSearch}>
                <Text style={styles.buttonText}>Search</Text>
            </TouchableOpacity>
            <FlatList
                data={searchResults}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => setSelectedSong(item)}>
                        <View style={styles.songItem}>
                            <Text style={styles.songTitle}>{item.title}</Text>
                            <Text style={styles.songArtist}>{item.artist}</Text>
                        </View>
                    </TouchableOpacity>
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
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
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
    songItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
    },
    songTitle: {
        fontSize: 18,
    },
    songArtist: {
        fontSize: 14,
        color: 'gray',
    },
    dropdownContainer: {
        marginTop: 20,
    }
});

export default MusicPage;
