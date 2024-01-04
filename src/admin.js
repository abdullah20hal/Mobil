import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Keyboard, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../config';
import { getAuth, signOut } from 'firebase/auth';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';

const Admin = ({ route }) => {
    const { email } = route.params;
    const [todos, setTodos] = useState([]);
    const todoRef = firebase.firestore().collection('todos');
    const [addData, setAddData] = useState('');
    const navigation = useNavigation();

    const [productImage, setProductImage] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productDescription, setProductDescription] = useState('');

    const handlePress = () => {
        navigation.navigate('UrunlerIstekListele');
    };

    const handlePriceChange = (price) => {
        if (!isNaN(price) && price.trim() !== '') {
            setProductPrice(String(parseInt(price, 10))); // Sayısal bir değere dönüştür
        } else {
            setProductPrice(''); // Geçersiz girdi durumunda sıfırla
        }
    };
    const handleOrdersButtonPress = () => {
        navigation.navigate('Siparisler'); // "Siparisler" sayfasına yönlendirme
    };

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
        if (addData && productImage && productPrice && productDescription) {
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();
            const data = {
                heading: addData,
                imageUrl: productImage,
                price: parseInt(productPrice, 10), // Sayıya çevir
                description: productDescription,
                createdAt: timestamp,
            };
            todoRef
                .add(data)
                .then(() => {
                    setAddData('');
                    setProductImage('');
                    setProductPrice('');
                    setProductDescription('');
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
                <View style={styles.iconContainer}>
                    <TouchableOpacity onPress={handlePress} style={styles.iconButton2}>
                        <FontAwesome name="list-ul" size={24} color="black" />
                        <Text style={styles.iconText}>Ürünler</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={logoutUser} style={styles.iconButton}>
                        <FontAwesome name="sign-out" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.heading}>Ürün Ekleme</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Ürün Adı:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ürün Adı"
                    onChangeText={setAddData}
                    value={addData}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Ürün Görsel URL:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ürün Görsel URL"
                    onChangeText={setProductImage}
                    value={productImage}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Ürün Fiyatı (TL):</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ürün Fiyatı"
                    onChangeText={handlePriceChange}
                    value={productPrice}
                    keyboardType="numeric"
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Ürün Açıklama:</Text>
                <TextInput
                    style={styles.descriptionInput}
                    placeholder="Ürün Açıklama"
                    onChangeText={setProductDescription}
                    value={productDescription}
                    multiline
                />
            </View>
            <TouchableOpacity style={styles.button} onPress={addTodo}>
                <Text style={styles.buttonText}>Ürün Ekle</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ordersButton} onPress={handleOrdersButtonPress}>
                <Text style={styles.buttonText}>Siparişler Listesi</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    heading: {
        textAlign: 'center', // Başlığı ortala

        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    descriptionInput: {
        height: 100,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        fontSize: 16,
        textAlignVertical: 'top',
    },
    ordersButton: {
        height: 50,
        backgroundColor: '#34A853', // Yeşil renk
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 10, // Üstteki butondan boşluk
    },
    button: {
        height: 50,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    iconButton: {
        padding: 10,
    },
    iconButton2: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    iconText: {
        marginLeft: 5,
        fontSize: 16,
        color: 'black',
    },
});

export default Admin;
