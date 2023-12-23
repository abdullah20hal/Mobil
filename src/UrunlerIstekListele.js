import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../config';

const UrunlerIstekListele = () => {
    const [todos, setTodos] = useState([]);
    const todoRef = firebase.firestore().collection('todos');
    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = todoRef
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
        return () => unsubscribe();
    }, []);

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

    return (
        <FlatList
            data={todos}
            numColumns={1}
            renderItem={({ item }) => (
                <View style={styles.container}>
                    <Pressable>
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
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#e5e5e5',
        padding: 15,
        borderRadius: 15,
        margin: 5,
        marginHorizontal: 10,
    },
    itemHeading: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    // Diğer stil tanımlamaları
});

export default UrunlerIstekListele;
