// import React from 'react';
// import { View, TouchableOpacity, Text } from 'react-native';
// import { CircularProgress } from 'react-native-circular-progress';
// import { styles } from './comp-styles'; // Import styles from comp-styles.jsx

// const CountdownTimer = () => {
//   return (
//     <View style={styles.container}>
//       <View style={styles.countdownContainer}>
//         <CircularProgress
//           size={200}
//           width={10}
//           fill={progress}
//           tintColor="#3498db"
//           backgroundColor="#f0f0f0"
//           rotation={0}
//           lineCap="round"
//         >
//           {() => <Text>{progress}%</Text>}
//         </CircularProgress>
//         <TouchableOpacity onPress={isRunning ? pauseTimer : startTimer} style={styles.countdownButton}>
//           <Text style={styles.countdownButtonText}>{isRunning ? 'Pause' : 'Start'}</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default CountdownTimer;


import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { CircularProgress } from 'react-native-circular-progress';
import { styles } from '../../Styles/comp_styles.jsx'; 
; // Import styles from comp-styles.jsx

const CountdownTimer = ({ duration }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [progress, setProgress] = useState(100);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  const startTimer = () => {
    setIsRunning(true);
    const startTime = Date.now() - elapsedTime * 1000; // Convert seconds to milliseconds
    timerRef.current = setInterval(() => {
      const currentTime = Date.now();
      const elapsedTimeInSeconds = Math.floor((currentTime - startTime) / 1000); // Convert milliseconds to seconds
      setElapsedTime(elapsedTimeInSeconds);
      setProgress(100 - (elapsedTimeInSeconds / duration) * 100);
      if (elapsedTimeInSeconds >= duration) {
        clearInterval(timerRef.current);
        setIsRunning(false);
      }
    }, 1000);
  };

  const pauseTimer = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
  };

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
          {() => <Text>{elapsedTime}s</Text>}
        </CircularProgress>
        <TouchableOpacity onPress={isRunning ? pauseTimer : startTimer} style={styles.countdownButton}>
          <Text style={styles.countdownButtonText}>{isRunning ? 'Pause' : 'Start'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CountdownTimer;

