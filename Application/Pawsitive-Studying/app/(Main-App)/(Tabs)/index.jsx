import { StatusBar } from 'expo-status-bar'
import { router } from 'expo-router'

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet } from 'react-native';


const sec_per_min = 60
const gotoTimer = (time) => {
    router.push({
        pathname: `../Timer/timer_page`,
        params: { time: time },
    })
}

export default function Home() {
    const [tasks, setTasks] = useState([
        { id: 1, name: 'Task 1', time: '1 hour', category: 'Work' },
        { id: 2, name: 'Task 2', time: '30 minutes', category: 'Study' },
        { id: 3, name: 'Task 3', time: '45 minutes', category: 'Exercise' },
    ]);

    const [modalVisible, setModalVisible] = useState(false);
    const [newTask, setNewTask] = useState({ name: '', time: '', category: '' });

    const handleAddTask = () => {
        setTasks([...tasks, { ...newTask, id: tasks.length + 1 }]);
        setNewTask({ name: '', time: '', category: '' });
        setModalVisible(false);
    };


    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Tasks</Text>
            {tasks.map(task => (
                <View key={task.id} style={styles.task}>
                    <Text>{task.name}</Text>
                    <Text>{task.time}</Text>
                    <Text>{task.category}</Text>
                </View>
            ))}
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.addButtonText}>Add Task</Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Task Name"
                        value={newTask.name}
                        onChangeText={text => setNewTask({ ...newTask, name: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Time Needed"
                        value={newTask.time}
                        onChangeText={text => setNewTask({ ...newTask, time: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Category"
                        value={newTask.category}
                        onChangeText={text => setNewTask({ ...newTask, category: text })}
                    />
                    <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
                        <Text style={styles.addButtonText}>Add Task</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    task: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    addButton: {
        backgroundColor: 'blue',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        width: '100%',
    },
    cancelButton: {
        backgroundColor: 'red',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    cancelButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
