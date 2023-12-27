import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getAuth, signOut } from 'firebase/auth';

import { firebase } from '../config';

const Dashboard = ({ navigation, route }) => {
  const [products, setProducts] = useState([]);
  const email = route.params?.email;

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
        setProducts(products);
      });

    return () => unsubscribe();
  }, []);

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

  const checkForNotification = async () => {
    try {
      const querySnapshot = await firebase.firestore().collection('todos').get();
      querySnapshot.forEach(async (doc) => {
        const notificationSnapshot = await doc.ref
          .collection('notifications')
          .orderBy('timestamp', 'desc')
          .limit(1)
          .get();
        notificationSnapshot.forEach((notificationDoc) => {
          const notification = notificationDoc.data();
          Alert.alert('Yeni Bildirim', notification.message, [
            {
              text: 'Tamam',
              onPress: () => {
                // Bildirimi aldığınızı işaretleme veya başka bir işlem yapma seçeneği
              },
            },
          ]);
        });
      });
    } catch (error) {
      console.error('Bildirim kontrol hatası:', error);
    }
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

  const renderProduct = ({ item }) => (
    <View style={styles.productContainer}>
      <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
      <View style={styles.textContainer}>
        <Text style={styles.productName}>{item.heading}</Text>
        <Text style={styles.productPrice}>Fiyat: {item.price}</Text>
      </View>
      <Text style={styles.productDescription}>{item.description}</Text>

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
    const user = firebase.auth().currentUser;
    if (!user) {
      console.log('Kullanıcı girişi gerekli!');
      return;
    }

    const cartRef = firebase.firestore().collection('carts');
    const cartItem = {
      userId: user.uid,
      productId: item.id,
      heading: item.heading,
      price: item.price,
      imageUrl: item.imageUrl,
      description: item.description,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    cartRef
      .add(cartItem)
      .then(() => {
        console.log('Ürün sepete eklendi');
        alert('Ürün sepete eklendi');
      })
      .catch((error) => {
        console.error('Sepete ekleme hatası:', error);
      });
  };

  const addToFavorites = (item) => {
    const user = firebase.auth().currentUser;
    if (!user) {
      console.log('Kullanıcı girişi gerekli!');
      return;
    }

    const favoritesRef = firebase.firestore().collection('favorites');
    const favoriteItem = {
      userId: user.uid,
      productId: item.id,
      heading: item.heading,
      price: item.price,
      imageUrl: item.imageUrl,
      description: item.description,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    favoritesRef
      .add(favoriteItem)
      .then(() => {
        console.log('Ürün favorilere eklendi');
        alert('Ürün favorilere eklendi');
      })
      .catch((error) => {
        console.error('Favorilere ekleme hatası:', error);
      });
  };

  useEffect(() => {
    const notificationTimer = setTimeout(() => {
      checkForNotification();
    }, 5000);

    return () => clearTimeout(notificationTimer);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  logoutButton: {
    marginRight: 10,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding:10,
    alignItems: 'center',
  },
  productContainer: {
    flex: 1,
    margin: 5,
    padding: 5,
    backgroundColor: 'white',
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
    flex: 1,
  },
  productImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  productDescription: {
    fontWeight: 'bold',
    color: '#808080',
    textAlign:'center',

  },
  productPrice: {
    fontWeight: 'bold',
    color: '#808080',
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
