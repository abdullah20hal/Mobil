import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firebase } from '../config';

const UploadImageScreen = () => {
  const [uploading, setUploading] = useState(false);

  const handleUploadImage = async () => {
    try {
      setUploading(true);

      // Firebase Storage'da resmi yükle
      const storage = getStorage();
      const storageRef = ref(storage, '..images/Cat03.jpg'); // Yüklenecek resmin yolunu belirtin

      // assets klasöründeki Cat03.jpg resmini alın
      const imageUri = require('../assets/Cat03.jpg');

      // Resmi Uint8Array verisine dönüştürün
      const response = await fetch(imageUri);
      const blob = await response.blob();

      // Resmi yükleyin
      await uploadBytes(storageRef, blob);

      // Resmin indirme URL'sini al
      const downloadURL = await getDownloadURL(storageRef);

      // Firestore'a resmin URL'sini ve adını kaydet
      const firestore = firebase.firestore();
      const imagesRef = firestore.collection('images');
      await imagesRef.add({
        name: 'Cat03.jpg', // Resmin adını belirtin
        url: downloadURL,
      });

      Alert.alert('Başarılı', 'Resim başarıyla yüklendi ve Firestore veritabanına kaydedildi.');
    } catch (error) {
      console.error('Resim yüklenirken hata oluştu:', error);
      Alert.alert('Hata', 'Resim yüklenirken bir hata oluştu.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity
        style={{ backgroundColor: '#007AFF', padding: 10, borderRadius: 5 }}
        onPress={handleUploadImage}
        disabled={uploading}
      >
        <Text style={{ color: 'white' }}>Cat03.jpg'yi Yükle</Text>
      </TouchableOpacity>

      {uploading && <Text style={{ marginTop: 10 }}>Yükleniyor...</Text>}
    </View>
  );
};

export default UploadImageScreen;
