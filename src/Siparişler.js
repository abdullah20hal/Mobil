import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { firebase } from '../config';

const Siparisler = () => {
    const [urunler, setUrunler] = useState([]);

    useEffect(() => {
        const urunlerRef = firebase.firestore().collection('todos'); // 'urunler' koleksiyonunu referans al
        urunlerRef.onSnapshot(
            querySnapshot => {
                const urunler = [];
                querySnapshot.forEach(doc => {
                    const { heading, price, description } = doc.data();
                    urunler.push({
                        id: doc.id,
                        heading,
                        price,
                        description,
                    });
                });
                setUrunler(urunler);
            });
    }, []);

    return (
        <ScrollView style={styles.container}>
            {urunler.map((urun, index) => (
                <View key={index} style={styles.urunContainer}>
                    <Text style={styles.urunAdi}>{urun.heading}</Text>
                    <Text style={styles.urunFiyati}>Fiyat: {urun.price} TL</Text>
                    <Text style={styles.urunAciklamasi}>{urun.description}</Text>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    urunContainer: {
        backgroundColor: '#f0f0f0',
        padding: 20,
        marginVertical: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 5,
    },
    urunAdi: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    urunFiyati: {
        fontSize: 16,
        color: '#34A853',
    },
    urunAciklamasi: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
});

export default Siparisler;
