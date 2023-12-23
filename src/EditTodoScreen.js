import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import { firebase } from '../config';

const EditTodoScreen = ({ route, navigation }) => {
    const { item } = route.params;
    const [updatedHeading, setUpdatedHeading] = useState(item.heading);

    const todoRef = firebase.firestore().collection('todos');

    const updateTodo = () => {
        todoRef
            .doc(item.id)
            .update({ heading: updatedHeading })
            .then(() => {
                Keyboard.dismiss();
                navigation.goBack();
            })
            .catch((error) => {
                alert(error);
            });
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                onChangeText={setUpdatedHeading}
                value={updatedHeading}
            />
            <TouchableOpacity style={styles.button} onPress={updateTodo}>
                <Text style={styles.buttonText}>Update Todo</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    input: {
        height: 50,
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    button: {
        height: 50,
        width: '100%',
        backgroundColor: '#788eec',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
});

export default EditTodoScreen;
