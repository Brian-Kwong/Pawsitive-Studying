import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    TextInput,
    StyleSheet,
    FlatList,
} from "react-native";
import { fetchUserTasks, addUserTask } from "./requests.js";

export default function Home() {
    const [tasks, setTasks] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newTask, setNewTask] = useState({});
    const [nameError, setNameError] = useState("");
    const [timeError, setTimeError] = useState("");

    useEffect(() => {
        fetchTasks();
    }, []);

    async function fetchTasks() {
        try {
            const userTasks = await fetchUserTasks();
            console.log("User tasks:", userTasks);
            setTasks(userTasks.tasks);
        } catch (error) {
            console.error("Error fetching user tasks:", error);
        }
    }

    async function addTask(newTask) {
        try {
            const addedTask = await addUserTask(newTask);
            console.log("New task added:", addedTask);
            // 更新任务列表
            fetchTasks();
        } catch (error) {
            console.error("Error adding task:", error);
        }
    }

    function closeNewTaskModal() {
        setModalVisible(false);
        setNewTask({});
        setNameError("");
        setTimeError("");
    }

    const handleAddTask = () => {
        console.log(newTask);
        if (!newTask.name) {
            setNameError("must full name");
        }
        if (!newTask.time) {
            setTimeError("must full time");
        }

        addTask(newTask);
        closeNewTaskModal();
    };

    const renderItem = ({ item }) => (
        <View style={styles.task}>
            <Text>{item.name}</Text>
            <Text>{item.time}</Text>
            <Text>{item.course}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Tasks</Text>
            <FlatList
                data={tasks}
                renderItem={renderItem}
                keyExtractor={(item) => item._id.toString()}
            />

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.addButtonText}>Add Task</Text>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                animationType="fade"
                transparent={true}
            >
                <TouchableOpacity
                    style={styles.modalBackground}
                    activeOpacity={1}
                    onPress={() => closeNewTaskModal()} // 点击背景关闭模态
                >
                    <View
                        style={styles.modalContainer}
                        onStartShouldSetResponder={() => true}
                    >
                        <Text style={styles.modalHeading}>Add New Task</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Task Name"
                            value={newTask.name}
                            placeholderTextColor="#888"
                            onChangeText={(text) => {
                                setNewTask({ ...newTask, name: text });
                                setNameError("");
                            }}
                        />
                        {nameError ? (
                            <Text style={styles.error}>{nameError}</Text>
                        ) : null}
                        <TextInput
                            style={styles.input}
                            placeholder="Time"
                            placeholderTextColor="#888"
                            value={newTask.time}
                            onChangeText={(text) => {
                                setNewTask({ ...newTask, time: text });
                                setTimeError("");
                            }}
                        />
                        {timeError ? (
                            <Text style={styles.error}>{timeError}</Text>
                        ) : null}
                        <TextInput
                            style={styles.input}
                            placeholder="Course(optional)"
                            placeholderTextColor="#888"
                            value={newTask.category}
                            onChangeText={(text) =>
                                setNewTask({ ...newTask, course: text })
                            }
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Description(optional)"
                            placeholderTextColor="#888"
                            value={newTask.category}
                            onChangeText={(text) =>
                                setNewTask({ ...newTask, description: text })
                            }
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Points(optional)"
                            placeholderTextColor="#888"
                            value={newTask.category}
                            onChangeText={(text) =>
                                setNewTask({ ...newTask, points: text })
                            }
                        />
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={handleAddTask}
                        >
                            <Text style={styles.addButtonText}>Add Task</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => closeNewTaskModal()}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
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
        fontWeight: "bold",
        marginBottom: 10,
    },
    task: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    addButton: {
        backgroundColor: "blue",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 20,
    },
    addButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        width: "80%",
    },
    modalHeading: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    error: {
        color: "red",
        marginBottom: 10,
    },
    cancelButton: {
        backgroundColor: "red",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 10,
    },
    cancelButtonText: {
        color: "white",
        fontWeight: "bold",
    },
});
