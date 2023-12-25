import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { firebase } from '../config';

const FavoritesScreen = () => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const user = firebase.auth().currentUser;
        if (!user) {
            console.log("Kullanıcı girişi gerekli!");
            return;
        }

        const favoritesRef = firebase.firestore().collection('favorites');
        const unsubscribe = favoritesRef
            .where('userId', '==', user.uid)
            .onSnapshot(querySnapshot => {
                const newFavorites = [];
                querySnapshot.forEach(doc => {
                    const favorite = doc.data();
                    newFavorites.push({ ...favorite, id: doc.id });
                });
                setFavorites(newFavorites);
            });

        return () => unsubscribe();
    }, []);

    const removeFromFavorites = (id) => {
        Alert.alert(
            "Favoriyi Sil",
            "Bu ürünü favorilerinizden çıkarmak istediğinizden emin misiniz?",
            [
                {
                    text: "İptal",
                    style: "cancel"
                },
                { 
                    text: "Evet", 
                    onPress: () => {
                        firebase.firestore().collection('favorites').doc(id).delete()
                            .then(() => {
                              alert('Favori ürün silindi');
                            })
                            .catch(error => {
                                alert("Ürün silinirken bir hata oluştu: " + error);
                            });
                    }
                }
            ],
            { cancelable: false }
        );
    };

    const renderItem = ({ item }) => (
      <View style={styles.item}>
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.heading}</Text>
            <Text style={styles.price}>Fiyat: {item.price}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
          <View style={styles.iconsContainer}>
          <FontAwesome name="heart" size={24} color="#E91E63" style={styles.favIcon} />
            <TouchableOpacity onPress={() => removeFromFavorites(item.id)}>
                <FontAwesome name="trash-o" size={24} color="red" style={styles.delIcon} />
            </TouchableOpacity>
          </View>
      </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={favorites}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    item: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        marginVertical: 10,
        marginHorizontal: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    price: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4CAF50',
        marginVertical: 5,
    },
    description: {
        fontSize: 14,
        color: '#666',
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 15,
        marginRight: 10,
    },
    iconsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: 100, // Mesafe eklenen alanı ekleyerek 70'ten 110'a çıkardım
  },
  favIcon: {
      marginRight: 40, // Favori simgesi ile silme simgesi arasındaki mesafeyi artırdım
  },
  delIcon: {
      marginLeft: 10,
  },

    
});

export default FavoritesScreen;
