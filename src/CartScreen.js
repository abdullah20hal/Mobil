import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { firebase } from '../config';

const CartScreen = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const user = firebase.auth().currentUser;
    const cartRef = firebase.firestore().collection('carts');

    useEffect(() => {
        if (!user) {
            console.log("Kullanıcı girişi gerekli!");
            return;
        }

        const unsubscribe = cartRef
            .where('userId', '==', user.uid)
            .onSnapshot(querySnapshot => {
                const newCartItems = [];
                let newTotalPrice = 0;
                querySnapshot.forEach(doc => {
                    const cartItem = doc.data();
                    newCartItems.push({ ...cartItem, id: doc.id });
                    newTotalPrice += parseFloat(cartItem.price);
                });
                setCartItems(newCartItems);
                setTotalPrice(newTotalPrice);
            });

        return () => unsubscribe();
    }, [user]);

    const removeFromCart = (id) => {
        Alert.alert(
            "Ürünü Sil",
            "Bu ürünü sepetinizden çıkarmak istediğinizden emin misiniz?",
            [
                {
                    text: "İptal",
                    style: "cancel"
                },
                { 
                    text: "Evet", 
                    onPress: () => {
                        cartRef.doc(id).delete()
                            .then(() => {
                              alert('Ürün silindi');
                            })
                            .catch(error => {
                                Alert.alert("Hata", "Ürün silinemedi: " + error);
                            });
                    }
                }
            ],
            { cancelable: false }
        );
    };

    const completeOrder = () => {
        Alert.alert(
            "Siparişi Onayla",
            "Siparişi tamamlamak istediğinizden emin misiniz?",
            [
                {
                    text: "İptal",
                    style: "cancel"
                },
                { 
                    text: "Evet", 
                    onPress: () => {
                        setCartItems([]); 
                        setTotalPrice(0); 
                        alert('Siparişiniz tamamlandı.');
                    }
                }
            ],
            { cancelable: false }
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <View style={styles.itemDetails}>
                <Text style={styles.title}>{item.heading}</Text>
                <Text style={styles.price}>Fiyat: {item.price} ₺</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
            <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.deleteButton}>
                <FontAwesome name="trash-o" size={24} color="red" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {cartItems.length > 0 ? (
                <FlatList
                    data={cartItems}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    ListFooterComponent={
                        <View style={styles.totalContainer}>
                            <Text style={styles.totalText}>Toplam Fiyat: {totalPrice.toFixed(2)} ₺</Text>
                            <TouchableOpacity style={styles.orderButton} onPress={completeOrder}>
                                <Text style={styles.orderButtonText}>Sipariş Ver</Text>
                            </TouchableOpacity>
                        </View>
                    }
                />
            ) : (
                <View style={styles.emptyCartContainer}>
                    <Text style={styles.emptyCartText}>Sepetiniz Boş</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    item: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 4,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 10,
    },
    itemDetails: {
        flex: 1,
        paddingRight: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333',
    },
    price: {
        fontSize: 14,
        color: '#4CAF50',
        marginBottom: 4,
    },
    description: {
        fontSize: 12,
        color: '#666',
    },
    deleteButton: {
        padding: 6,
    },
    totalContainer: {
        padding: 16,
        borderTopWidth: 1,
        borderColor: '#ddd',
       
        alignItems: 'center',
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    orderButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
    },
    orderButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    emptyCartContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyCartText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default CartScreen;
