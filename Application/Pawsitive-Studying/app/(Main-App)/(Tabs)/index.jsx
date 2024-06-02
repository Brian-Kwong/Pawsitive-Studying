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
import { fetchUserTasks, addUserTask } from "../UserPages/requests.js";
import { router } from "expo-router";
import { SwipeListView } from 'react-native-swipe-list-view';


const gotoTimer = (time) => {
    router.push({
        pathname: `../UserPages/timer_page`,
        params: { time: time },
    });
};

const TaskModal = ({
    selectedTask,
    modalVisible,
    setModalVisible,
    uploadTask,
}) => {

    const [task, setTask] = useState({});
    const [nameError, setNameError] = useState("");
    const [timeError, setTimeError] = useState("");
    const [buttonText, setButtonText] = useState("Add Task");

    useEffect(() => {
        if (selectedTask && Object.keys(selectedTask).length !== 0) {
            setTask(selectedTask);
            setButtonText("Update Task");
        } else {
            setTask({});
            setButtonText("Add Task");
        }
    }, [selectedTask]);

    useEffect(() => {

    }, [])


    function closeNewTaskModal() {
        setTask({});
        setNameError("");
        setTimeError("");
        setModalVisible(false);
    }

    const handleTask = () => {
        console.log(task);
        if (!task.name) {
            setNameError("must full name");
        }
        if (!task.time) {
            setTimeError("must full time");
        }

        if (task.name && task.time) {
            uploadTask(task);
            closeNewTaskModal();
        }
    };


    return (
        <Modal visible={modalVisible} animationType="fade" transparent={true}>
            <TouchableOpacity style={styles.modalBackground}
                activeOpacity={1}
                onPress={() => closeNewTaskModal()}
            >
                <View style={styles.modalContainer}
                    onStartShouldSetResponder={() => true}
                >
                    <Text style={styles.modalHeading}>Add New Task</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Task Name"
                        value={task.name}
                        placeholderTextColor="#888"
                        onChangeText={(text) => {
                            setTask({ ...task, name: text });
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
                        value={task.time}
                        onChangeText={(text) => {
                            setTask({ ...task, time: text });
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
                        value={task.course}
                        onChangeText={(text) =>
                            setTask({ ...task, course: text })
                        }
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Description(optional)"
                        placeholderTextColor="#888"
                        value={task.description}
                        onChangeText={(text) =>
                            setTask({ ...task, description: text })
                        }
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Points(optional)"
                        placeholderTextColor="#888"
                        value={task.points}
                        onChangeText={(text) =>
                            setTask({ ...task, points: text })
                        }
                    />
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={handleTask}
                    >
                        <Text style={styles.addButtonText}>{buttonText}</Text>
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
    );
}

export default function Home() {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState({});
    const [modalVisible, setModalVisible] = useState(false);


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

    let uploadTask;

    function clickAddTask() {
        setSelectedTask({});
        setModalVisible(true);
        uploadTask = addTask;
    }

    const renderItem = ({ item }) => (
        <View style={styles.taskContainer}>
            <Text>Name: {item.name}</Text>
            <Text>Time: {item.time}</Text>
            <Text>Course: {item.course}</Text>
        </View>
    );

    const renderHiddenItem = (data, rowMap) => (
        <View style={styles.rowBack}>
            <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnLeft]}
                onPress={() => console.log("Start Task", data.item)}
            >
                <Text style={styles.backTextWhite}>Start</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnCenter]}
                onPress={() => console.log("Edit Task", data.item)}
            >
                <Text style={styles.backTextWhite}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnRight]}
                onPress={() => console.log("Delete Task", data.item)}
            >
                <Text style={styles.backTextWhite}>Delete</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Tasks</Text>
            <SwipeListView
                data={tasks}
                renderItem={renderItem}
                renderHiddenItem={renderHiddenItem}
                leftOpenValue={75}
                rightOpenValue={-150}
                keyExtractor={(item) => item._id.toString()}
            />

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => clickAddTask()}
            >
                <Text style={styles.addButtonText}>Add Task</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.addButton} onPress={() => gotoTimer(60)}>
                <Text style={styles.addButtonText}>Go Timer</Text>
            </TouchableOpacity>


            <TaskModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                selectedTask={selectedTask}
                uploadTask={uploadTask}
            />


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
    taskContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnLeft: {
        backgroundColor: 'green',
        left: 0,
    },
    backRightBtnCenter: {
        backgroundColor: 'blue',
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
    },
    backTextWhite: {
        color: '#FFF',
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
