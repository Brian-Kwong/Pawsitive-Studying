import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View, TextInput} from 'react-native';

const taskCard = () => {
    // For modal visibility
    const [modalVisible, setModalVisible] = useState(false);
    // For user text entry
    const [inputText, setInputText] = useState('');
    return (
    // Page
    <View style={styles.pageView}>
        <Modal
            animationType="none"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}>
            <View style={styles.modalContainer}>
                <Text style={styles.textStyle}>Tasks</Text>
                
            </View>
            <View style={styles.topLeft}>
                <Pressable
                    // Close Button
                    onPress={() => setModalVisible(!modalVisible)}>
                    <MaterialIcons name="close" color="#fff" 
                        size={22} />
                </Pressable>
            </View>
            <View style={styles.topRight}>
                <Pressable
                    // Submit Task Button
                    // TODO: Change the onPress to Submit
                    onPress={() => setModalVisible(!modalVisible)}>
                    <MaterialIcons name="done" color="#fff" 
                        size={22} />
                </Pressable>
            </View>
            <View style={styles.topCenter}>
                <TextInput
                    // Task Entry Button
                    placeholder='Enter Task'
                    onChangeText={(text) => setInputText(text)}
                    value={inputText} />             
            </View>
            <View style={styles.bottomLeft}>
                <TextInput
                    // Set Time Duration Button
                    placeholder='Enter Time'
                    onChangeText={(text) => setInputText(text)}
                    value={inputText} />      
            </View>
            <View style={styles.bottomRight}>
                <Pressable
                    // Untimed Button
                    // TODO: Change the onPress to highlight around button
                    onPress={() => setModalVisible(!modalVisible)}>
                    <Text style={styles.textStyle}>No Timer</Text>
                </Pressable>
            </View>
        </Modal>
        <Pressable 
            // OUTSIDE OF THE MODAL
            // This is the + button to open modal
            style={[styles.plusButton]}
            onPress={() => setModalVisible(true)}>
            <MaterialIcons name="add" color="#fff"
                size={22} />
        </Pressable>

    </View>
    );
};

// Styles
const styles = StyleSheet.create({
    // textStyle
    // plusButton on the home screen
    // modalContainer
    modalContainer: {
        height: '50%',
        width: '70%',
        backgroundColor: '#90E4C1',
        position: 'absolute'

    },
    // topLeft and topRight can be same container size
    topButton: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    // topCenter
    bigButton: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    // bottomLeft and bottomRight can be 1 component?
    smallButton: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});
/* StyleSheet Notes
    flex: how much space to take up
*/
