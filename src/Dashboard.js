import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getAuth, signOut } from 'firebase/auth';

import { firebase } from '../config';

const Dashboard = ({ navigation, route }) => {
    const [products, setProducts] = useState([]); // Ürünleri saklamak için bir dizi tanımla
    const email = route.params?.email;

    // Firestore verilerini çek
    useEffect(() => {
        const productRef = firebase.firestore().collection('todos');
        const unsubscribe = productRef
            .orderBy('createdAt', 'desc')
            .onSnapshot((querySnapshot) => {
                const products = [];
                querySnapshot.forEach((doc) => {
                    const { heading, imageUrl, price, description } = doc.data();
                    products.push({
                        id: doc.id,
                        heading,
                        imageUrl,
                        price,
                        description,
                    });
                });
                setProducts(products); // Ürünleri ayarla
            });

        return () => unsubscribe();
    }, []);

    // Kullanıcıyı çıkış yapmaya yönlendir
    const logoutUser = () => {
        const auth = getAuth();
        signOut(auth)
            .then(() => {
                console.log('Çıkış yapıldı');
                navigation.navigate('Login');
            })
            .catch((error) => {
                console.error('Hata:', error);
            });
    };

    // Bildirimi kontrol etmek için bir fonksiyon
    const checkForNotification = () => {
        // Firebase'den en son bildirimi çek
        firebase.firestore().collection('todos').get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    doc.ref.collection('notifications').orderBy('timestamp', 'desc').limit(1)
                        .get().then((notificationSnapshot) => {
                            notificationSnapshot.forEach((notificationDoc) => {
                                const notification = notificationDoc.data();
                                // Bildirimi göster (Expo Notifications kullanılabilir)
                                Alert.alert(
                                    'Yeni Bildirim',
                                    notification.message,
                                    [
                                        {
                                            text: 'Tamam',
                                            onPress: () => {
                                                // Bildirimi aldığınızı işaretleme veya başka bir işlem yapma seçeneği
                                            },
                                        },
                                    ],
                                    { cancelable: false }
                                );
                            });
                        });
                });
            });
    };

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={styles.iconContainer}>
                    <TouchableOpacity onPress={logoutUser} style={styles.logoutButton}>
                        <FontAwesome name="sign-out" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation]);

    // Ürünleri listeleyen bir bileşen oluştur
    const renderProduct = ({ item }) => (
        <View style={styles.productContainer}>
            <Text style={styles.productName}>{item.heading}</Text>
            <Text style={styles.productPrice}>Fiyat: {item.price}</Text>
            <Text style={styles.productDescription}>{item.description}</Text>
            <Text style={styles.productImageUrl}>Resim URL: {item.imageUrl}</Text>

            <View style={styles.iconRow}>
                <TouchableOpacity onPress={() => addToCart(item)} style={styles.iconButton}>
                    <FontAwesome name="shopping-cart" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => addToFavorites(item)} style={styles.iconButton}>
                    <FontAwesome name="heart" size={24} color="red" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const addToCart = (item) => {
        console.log("urununuz septeye eklendi")  
        alert("urununuz septeye eklendi");    };

    const addToFavorites = (item) => {
console.log("favoru urun olarak kayid")  
alert("favoru urun olarak kayit edildi");

};

    // Kullanıcı giriş yaptıktan 5 saniye sonra bildirimi kontrol et
    useEffect(() => {
        const notificationTimer = setTimeout(() => {
            checkForNotification();
        }, 5000);

        return () => clearTimeout(notificationTimer);
    }, []);

    return (
        <View style={styles.container}>
            {/* Firestore'dan gelen ürünleri listeleyen bileşen */}
            <FlatList
                data={products}
                renderItem={renderProduct}
                keyExtractor={(item) => item.id}
                numColumns={2} // Tek sütunlu görünüm
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#FFFFFF', // Temiz beyaz arka plan
    },
    logoutButton: {
        marginRight: 10,
    },
    productContainer: {
        flex: 1,
        margin: 5,
        padding: 15,
        backgroundColor: 'white', // Hafif gri tonu
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    productName: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
    },
    productDescription: {
        color: '#757575', // Koyu gri tonu
    },
    productPrice: {
        fontWeight: 'bold',
        color: '#1E88E5', // Parlak mavi tonu
        marginTop: 5,
    },
    productImageUrl: {
        color: 'gray',
        marginTop: 10,
        fontSize: 12,
    },
    iconRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    iconButton: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
    },
});

export default Dashboard;
