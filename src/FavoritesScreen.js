import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { firebase } from '../config'; // Firebase yapılandırmanızın olduğu yolu buraya yazın

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

    const renderItem = ({ item }) => (
      <View style={styles.item}>
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
          <Text style={styles.title}>{item.heading}</Text>
          <Text style={styles.price}>Fiyat: {item.price}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <FontAwesome name="heart" size={24} color="#E91E63" style={styles.icon} />
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
  },
  title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 5,
  },
  price: {
      fontSize: 16,
      fontWeight: '600',
      color: '#4CAF50',
      marginBottom: 5,
  },
  description: {
      fontSize: 14,
      color: '#666',
      marginBottom: 10,
  },
 // image: {
 //     width: '100%',
   //   height: 200,
     // borderRadius: 15,
     // marginBottom: 10,
 // },
  icon: {
      alignSelf: 'flex-end',
  },
});

export default FavoritesScreen;