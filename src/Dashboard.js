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
        const user = firebase.auth().currentUser; // Aktif kullanıcıyı al
        if (!user) {
            console.log("Kullanıcı girişi gerekli!");
            return;
        }
        
        const favoritesRef = firebase.firestore().collection('carts');
        const favoriteItem = {
            userId: user.uid, // Kullanıcının ID'sini sakla
            productId: item.id, // Ürün ID'si
            heading: item.heading, // Ürün başlığı
            price: item.price, // Ürün fiyatı
            imageUrl: item.imageUrl, // Ürün resmi URL'si
            description: item.description, // Ürün açıklaması
            createdAt: firebase.firestore.FieldValue.serverTimestamp() // Oluşturulma zamanı
        };
    
        favoritesRef.add(favoriteItem)
            .then(() => {
                console.log("Ürün sepeteye eklendi");
                alert("Ürün sepeteye eklendi");
            })
            .catch((error) => {
                console.error("sepeteye ekleme hatası:", error);
            });
    };

        const addToFavorites = (item) => {
            const user = firebase.auth().currentUser; // Aktif kullanıcıyı al
            if (!user) {
                console.log("Kullanıcı girişi gerekli!");
                return;
            }
            
            const favoritesRef = firebase.firestore().collection('favorites');
            const favoriteItem = {
                userId: user.uid, // Kullanıcının ID'sini sakla
                productId: item.id, // Ürün ID'si
                heading: item.heading, // Ürün başlığı
                price: item.price, // Ürün fiyatı
                imageUrl: item.imageUrl, // Ürün resmi URL'si
                description: item.description, // Ürün açıklaması
                createdAt: firebase.firestore.FieldValue.serverTimestamp() // Oluşturulma zamanı
            };
        
            favoritesRef.add(favoriteItem)
                .then(() => {
                    console.log("Ürün favorilere eklendi");
                    alert("Ürün favorilere eklendi");
                })
                .catch((error) => {
                    console.error("Favorilere ekleme hatası:", error);
                });
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
