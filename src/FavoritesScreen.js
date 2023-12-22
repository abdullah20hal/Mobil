import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FavoritesScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>FavoritesScreen hos geldiniz</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', // Arka plan rengi
  },
  text: {
    fontSize: 24, // Yazı boyutu
    fontWeight: 'bold', // Yazı kalınlığı
  },
});

export default FavoritesScreen;