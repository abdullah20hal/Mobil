import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { firebase } from '../config';

const Siparisler = () => {
    const [urunler, setUrunler] = useState([]);

    useEffect(() => {
        const urunlerRef = firebase.firestore().collection('todos');
        urunlerRef.onSnapshot(
            querySnapshot => {
                const urunler = [];
                let siparisNo = 1; // Sipariş numarası için başlangıç değeri
                querySnapshot.forEach(doc => {
                    const { heading, price, description } = doc.data();
                    urunler.push({
                        id: doc.id,
                        siparisNo, // Sipariş numarasını ekle
                        heading,
                        price,
                        description,
                    });
                    siparisNo++; // Her bir ürün için sipariş numarasını artır
                });
                setUrunler(urunler);
            });
    }, []);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.siparisContainer}>
                <Text style={styles.header}>Sipariş Detayları</Text>
                {urunler.map((urun, index) => (
                    <View key={index} style={styles.urunCard}>
                        <Text style={styles.siparisNo}>Sipariş No: {urun.siparisNo}</Text>
                        <Text style={styles.urunAdi}>{urun.heading}</Text>
                        <Text style={styles.urunFiyati}>Fiyat: {urun.price} TL</Text>
                        <Text style={styles.urunAciklamasi}>{urun.description}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    siparisContainer: {
        margin: 20,
    },
    siparisNo: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 5,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        paddingBottom: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#34A853',
        marginBottom: 20,
    },
    urunCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    urunAdi: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    urunFiyati: {
        fontSize: 16,
        color: '#34A853',
        marginBottom: 5,
    },
    urunAciklamasi: {
        fontSize: 14,
        color: '#666',
    },
});

export default Siparisler;
