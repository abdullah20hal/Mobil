import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, FlatList, Image } from 'react-native';
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
                        const { heading, imageUrl, price, description } = doc.data();
                        todos.push({
                            id: doc.id,
                            heading,
                            imageUrl, 
                            price,
                            description,
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
                        <Image
                            source={{ uri: item.imageUrl }}
                            style={styles.itemImage}
                        />
                        <Text style={styles.itemDescription}>
                            Price: {item.price}
                        </Text>
                        <Text style={styles.itemDescription}>
                            Description: {item.description}
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
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 15,
        margin: 10,
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    itemHeading: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 5,
    },
    itemImage: {
        width: 200,
        height: 200,
        resizeMode: 'cover',
        borderRadius: 10,
        marginBottom: 5,
    },
    itemDescription: {
        fontSize: 14,
        color: 'gray',
    },
    editButton: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    editButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default UrunlerIstekListele;
