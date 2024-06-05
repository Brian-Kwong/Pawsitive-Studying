import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios'; 

const CompletedTasks = ({ userId }) => {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/users/${userId}/tasks/completed`);
        setCompletedTasks(response.data); 
        setLoading(false);
      } catch (error) {
        console.error('Error fetching completed tasks:', error);
        setError('Error fetching data. Please try again later.');
        setLoading(false);
      }
    };

    fetchCompletedTasks();
  }, [userId]); // Dependency array ensures this effect runs only when userId changes

  const renderCompletedTask = ({ item }) => (
    <View style={styles.taskContainer}>
      <Text style={styles.taskTitle}>{item.title}</Text>
      <Text style={styles.completedDate}>Completed on {item.completedDate}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Completed Tasks</Text>
      {completedTasks.length === 0 ? (
        <Text style={styles.noTasksText}>No completed tasks yet.</Text>
      ) : (
        <FlatList
          data={completedTasks}
          renderItem={renderCompletedTask}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.taskList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  taskList: {
    flexGrow: 1,
  },
  taskContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  completedDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  noTasksText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default CompletedTasks;
