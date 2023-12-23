import React from 'react';
import { View, Text, StyleSheet,FlatList, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { getAuth, signOut } from 'firebase/auth';
const products = [
    { id: '1', name: 'Ürün 1', description: 'Açıklama 1' },
    { id: '2', name: 'Ürün 2', description: 'Açıklama 2' },

    { id: '3', name: 'Ürün 1', description: 'Açıklama 1' },
    { id: '4', name: 'Ürün 2', description: 'Açıklama 2' },
    { id: '5', name: 'Ürün 2', description: 'Açıklama 2' },
    { id: '6', name: 'Ürün 2', description: 'Açıklama 2' },
    { id: '7', name: 'Ürün 2', description: 'Açıklama 2' },
    { id: '8', name: 'Ürün 2', description: 'Açıklama 2' },


    // daha fazla ürün...
];
const Dashboard = ({ navigation, route }) => {


    
    const email = route.params?.email; // 'email' değerinin varlığını güvenli bir şekilde kontrol et
    const renderProduct = ({ item }) => (
        <View style={styles.productContainer}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text>{item.description}</Text>
        </View>
    );
    const logoutUser = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
            console.log('çdıkış');
            navigation.navigate('Login'); 
        }).catch((error) => {
            console.error('hata:', error);
        });
    };

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={logoutUser}  style={styles.logoutButton}>
            <FontAwesome name="sign-out" size={24} color="black" />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    return (
        <View style={styles.container}>

            <FlatList
                data={products}
                renderItem={renderProduct}
                keyExtractor={item => item.id}
                numColumns={2} // İki sütunlu görünüm
            />
        </View>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    logoutButton: {
        marginRight: 10,
    },
    buttonText: {
        // Buton metni için stil tanımlamaları
        color: 'black', // Örnek renk
        marginRight: 20, // Sağ kenar boşluğu
        fontSize: 18, // Font büyüklüğü
    },
    productContainer: {
        height:200,
        flex: 1,
        margin: 5,
        padding: 10,
        backgroundColor: '#ADD8E6',
        alignItems: 'center',
    },
    productName: {
        fontWeight: 'bold',
    },
});

export default Dashboard;


