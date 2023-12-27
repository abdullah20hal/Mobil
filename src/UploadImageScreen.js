import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert, Platform } from 'react-native';
import storage from '@react-native-firebase/storage';
import * as ImagePicker from 'expo-image-picker';

const UploadImageScreen = () => {
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Üzgünüz, resimleri seçmek için izinlere ihtiyacımız var!');
        }
      }
    })();
  }, []);

  const selectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // Seçilen resmin URI'sini al ve state'i güncelle
      const selectedAsset = result.assets[0];
      setImageUri(selectedAsset.uri);
    }
  };

  const uploadImage = async () => {
    if (!imageUri) {
      Alert.alert('Lütfen önce bir resim seçin');
      return;
    }

    const fileName = imageUri.substring(imageUri.lastIndexOf('/') + 1);
    const storageRef = storage().ref(`images/${fileName}`);

    try {
      // Firebase Storage'a yükleme yapılıyor
      await storageRef.putFile(imageUri);
      Alert.alert('Resim başarıyla yüklendi!');
    } catch (error) {
      console.log('Resim yükleme hatası:', error);
      Alert.alert('Resim yüklenirken bir hata oluştu');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resim Yükleme Ekranı</Text>
      <Button title="Resim Seç" onPress={selectImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.previewImage} />}
      <Button title="Resmi Yükle" onPress={uploadImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  previewImage: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginVertical: 20,
  },
});

export default UploadImageScreen;
