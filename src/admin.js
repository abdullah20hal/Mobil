import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, Pressable, Keyboard } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../config';
import { getAuth, signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';


const Admin = ({ route }) => {
    const { email } = route.params;
    const [todos, setTodos] = useState([]);
    const todoRef = firebase.firestore().collection('todos');
    const [addData, setAddData] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        todoRef
            .orderBy('createdAt', 'desc')
            .onSnapshot(
                querySnapshot => {
                    const todos = [];
                    querySnapshot.forEach(doc => {
                        const { heading } = doc.data();
                        todos.push({
                            id: doc.id,
                            heading,
                        });
                    });
                    setTodos(todos);
                });
    }, []);

    // Edit a todo item
    const editTodo = (todo) => {
        console.log("Edit Todo: ", todo);
        // Burada düzenleme ekranına yönlendirme yapabilirsiniz
         navigation.navigate('EditTodoScreen', { todo });
    };

    // Delete a todo from Firestore DB
    const deleteTodo = (todo) => {
        todoRef
            .doc(todo.id)
            .delete()
            .then(() => {
                alert('Deleted Successfully');
            })
            .catch(error => {
                alert(error);
            });
    };

    // Add a todo
    const addTodo = () => {
        if (addData && addData.length > 0) {
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();
            const data = {
                heading: addData,
                createdAt: timestamp,
            };
            todoRef
                .add(data)
                .then(() => {
                    setAddData('');
                    Keyboard.dismiss();
                })
                .catch(error => {
                    alert(error);
                });
        }
    };

    const logoutUser = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
            console.log('Logged out');
            navigation.navigate('Login');
        }).catch((error) => {
            console.error('Error:', error);
        });
    };

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={logoutUser}>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    placeholder='Add A New Todo'
                    placeholderTextColor='#aaaaaa'
                    onChangeText={(heading) => setAddData(heading)}
                    value={addData}
                    underlineColorAndroid='transparent'
                    autoCapitalize='none'
                />
                <TouchableOpacity style={styles.button} onPress={addTodo}>
                    <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={todos}
                numColumns={1}
                renderItem={({ item }) => (
                    <View style={styles.container}>
                        <Pressable onPress={() => navigation.navigate('AdminDetails', { item })}>
                            <Text style={styles.itemHeading}>
                                {item.heading[0].toUpperCase() + item.heading.slice(1)}
                            </Text>
                        </Pressable>
                        <FontAwesome name='edit' size={24} color='blue' onPress={() => navigation.navigate('EditTodoScreen', { item })} />
                        <FontAwesome name='trash-o' size={24} color='red' onPress={() => deleteTodo(item)} />
                    </View>
                )}
                keyExtractor={item => item.id}
            />
            <StatusBar style='auto' />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#e5e5e5',
        padding: 15,
        borderRadius: 15,
        margin: 5,
        marginHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Ensure items are spaced out
    },
    itemHeading: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    formContainer: {
        flexDirection: 'row',
        height: 80,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 100,
    },
    input: {
        height: 48,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        paddingLeft: 16,
        flex: 1,
        marginRight: 5,
    },
    button: {
        height: 47,
        borderRadius: 5,
        backgroundColor: '#788eec',
        width: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
    },
});

export default Admin;
