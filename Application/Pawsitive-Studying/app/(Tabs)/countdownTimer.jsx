import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { CircularProgress } from 'react-native-circular-progress';
import { styles } from './comp-styles'; // Import styles from comp-styles.jsx

const CountdownTimer = () => {
  return (
    <View style={styles.container}>
      <View style={styles.countdownContainer}>
        <CircularProgress
          size={200}
          width={10}
          fill={progress}
          tintColor="#3498db"
          backgroundColor="#f0f0f0"
          rotation={0}
          lineCap="round"
        >
          {() => <Text>{progress}%</Text>}
        </CircularProgress>
        <TouchableOpacity onPress={isRunning ? pauseTimer : startTimer} style={styles.countdownButton}>
          <Text style={styles.countdownButtonText}>{isRunning ? 'Pause' : 'Start'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CountdownTimer;
