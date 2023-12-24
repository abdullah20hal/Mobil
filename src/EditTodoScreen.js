import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Keyboard, ScrollView } from 'react-native';
import { firebase } from '../config';

const EditTodoScreen = ({ route, navigation }) => {
    const { item } = route.params;
    const [updatedHeading, setUpdatedHeading] = useState(item.heading);
    const [updatedImageUrl, setUpdatedImageUrl] = useState(item.imageUrl);
    const [updatedPrice, setUpdatedPrice] = useState(item.price.toString()); // Tamsayıya dönüştürülmüş hali
    const [updatedDescription, setUpdatedDescription] = useState(item.description);

    const todoRef = firebase.firestore().collection('todos');

    const updateTodo = () => {
        // Tamsayıya dönüştürülmüş `updatedPrice` değerini bir kez daha tamsayıya dönüştürerek kullanabilirsiniz.
        const priceAsInt = parseInt(updatedPrice, 10);

        todoRef
            .doc(item.id)
            .update({
                heading: updatedHeading,
                imageUrl: updatedImageUrl,
                price: priceAsInt, // Tamsayıya dönüştürülmüş değeri kullanın
                description: updatedDescription,
            })
            .then(() => {
                Keyboard.dismiss();
                navigation.goBack();
            })
            .catch((error) => {
                alert(error);
            });
            todoRef
            .doc(item.id)
            .collection('notifications')
            .add({
                message: `${item.heading} ürününün fiyatı düşürüldü!`,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(() => {
                console.log('Bildirim kaydedildi');
            })
            .catch((error) => {
                console.error('Bildirim kaydedilemedi:', error);
            });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Heading:</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setUpdatedHeading}
                    value={updatedHeading}
                    placeholder="Heading"
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Image URL:</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setUpdatedImageUrl}
                    value={updatedImageUrl}
                    placeholder="Image URL"
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Price:</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setUpdatedPrice}
                    value={updatedPrice}
                    placeholder="Price"
                    keyboardType="numeric" // Klavyenin sayısal olmasını sağlar
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Description:</Text>
                <TextInput
                    style={styles.descriptionInput}
                    onChangeText={setUpdatedDescription}
                    value={updatedDescription}
                    placeholder="Description"
                    multiline
                />
            </View>
            <TouchableOpacity style={styles.button} onPress={updateTodo}>
                <Text style={styles.buttonText}>Urun Guncelle</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    input: {
        height: 50,
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
});

export default EditTodoScreen;
