import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import TrackPlayer, { Capability, useProgress, State } from 'react-native-track-player';

async function setupTrack() {

    const track = {
        url: 'https://cdn.pixabay.com/audio/2024/01/15/audio_9914e58808.mp3', // Load media from the file system
        title: 'Coverless book ( Lofi )',
        album: 'AmbientAUDIOVISION',
        artwork: 'https://cdn.pixabay.com/audio/2024/01/15/16-58-27-753_200x200.jpg',
    };


    await TrackPlayer.add([track])


    // 设置播放器选项
    TrackPlayer.updateOptions({
        stopWithApp: true,
        capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
        ]
    });
}



const MusicPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);


    useEffect(() => {
        setupTrack();

        return async () => {
            await TrackPlayer.stop();  // 停止播放器
            await TrackPlayer.removeUpcomingTracks();  // 移除所有队列中的曲目
        };
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
    }


    return (
        <View style={styles.container}>
            <Image
                source={{ uri: 'https://cdn.pixabay.com/audio/2024/01/15/16-58-27-753_200x200.jpg' }}
                style={styles.albumCover}
            />
            <View style={styles.infoAndControls}>
                <Text style={styles.songTitle}>Coverless book ( Lofi )</Text>
                <Text style={styles.albumInfo}>AmbientAUDIOVISION</Text>
                <Slider
                    style={styles.trackProgress}
                    value={progress.position}
                    minimumValue={0}
                    maximumValue={progress.duration}
                    onValueChange={value => TrackPlayer.seekTo(value)}
                    minimumTrackTintColor="#1FB28A"
                    maximumTrackTintColor="#000000"
                    thumbTintColor="#1FB28A"
                />
                <View style={styles.controls}>
                    <TouchableOpacity onPress={() => { console.log("Open play-list") }}>
                        <MaterialIcons name="playlist-play" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={skipToPrevious}>
                        <MaterialIcons name="skip-previous" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={togglePlayPause}>
                        <MaterialIcons name={isPlaying ? "pause" : "play-arrow"} size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={skipToNext}>
                        <MaterialIcons name="skip-next" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <MaterialIcons name="volume-up" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ccc', // 轻灰色背景
        borderRadius: 20,
        padding: 20,
        width: '100%',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        alignItems: 'center', // 中心对齐子项
    },
    albumCover: {
        width: 100, // 增加图片大小
        height: 100, // 增加图片大小
        borderRadius: 10,
        marginBottom: 10 // 增加底部边距
    },
    infoAndControls: {
        width: '90%', // 容器宽度调整
        justifyContent: 'space-around',
        alignItems: 'center' // 居中对齐所有子项
    },
    songTitle: {
        fontSize: 18, // 增加字体大小
        fontWeight: 'bold',
        color: '#000',
        marginVertical: 5 // 增加垂直外边距
    },
    albumInfo: {
        fontSize: 16, // 增加字体大小
        color: '#666',
        marginBottom: 10 // 增加底部边距
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around', // 平均分布控件
        width: '100%', // 控制宽度为容器宽度
        marginTop: 10 // 增加顶部外边距
    },
    trackProgress: {
        width: '100%', // 进度条宽度
        height: 40, // 调整高度以防遮挡
        marginVertical: 10 // 增加垂直外边距防止遮挡
    }
});

export default MusicPlayer;
