import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const MusicPage = () => {
    const [songRecommendation, setSongRecommendation] = useState(null);
    const [playlist, setPlaylist] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);

    useEffect(() => {
        // Fetch the playlist data from the backend
        const fetchPlaylist = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/playlist');
                const data = await response.json();
                setPlaylist(data);
                setSongRecommendation(data[Math.floor(Math.random() * data.length)]); // Set a random song as the daily recommendation
            } catch (error) {
                console.error('Error fetching playlist:', error);
            }
        };

        fetchPlaylist();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Music</Text>
            <TextInput style={styles.searchBar} placeholder="Search" />
            {songRecommendation && (
                <View style={styles.recommendationContainer}>
                    <Image
                        source={{ uri: songRecommendation.albumArt || 'https://via.placeholder.com/150' }}
                        style={styles.albumArt}
                    />
                    <Text style={styles.songTitle}>{songRecommendation.title}</Text>
                    <Text style={styles.songArtist}>{songRecommendation.artist}</Text>
                </View>
            )}
            <DropDownPicker
                open={dropdownOpen}
                value={selectedPlaylist}
                items={playlist.map(song => ({ label: song.title, value: song._id }))}
                setOpen={setDropdownOpen}
                setValue={setSelectedPlaylist}
                placeholder="Select a playlist"
                containerStyle={styles.dropdownContainer}
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownList}
                onChangeValue={(value) => console.log(value)}
            />
            <FlatList
                data={playlist}
                keyExtractor={item => item._id}
                renderItem={({ item }) => (
                    <View style={styles.songItem}>
                        <Text style={styles.songText}>{item.title}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    searchBar: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        marginBottom: 20,
    },
    recommendationContainer: {
        alignItems: 'center',
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
        fontWeight: 'bold',
    },
    songArtist: {
        fontSize: 16,
        color: '#888',
    },
    dropdownContainer: {
        height: 40,
        marginBottom: 20,
    },
    dropdown: {
        backgroundColor: '#fafafa',
        borderColor: '#ccc',
    },
    dropdownList: {
        backgroundColor: '#fafafa',
        borderColor: '#ccc',
    },
    songItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    songText: {
        fontSize: 16,
    },
});

export default MusicPage;
