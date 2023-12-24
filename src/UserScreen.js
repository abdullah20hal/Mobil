import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { firebase } from '../config';

const UserScreen = ({navigation}) => {
    const [user, setUser] = useState({});

    useEffect(() => {
        const currentUser = firebase.auth().currentUser;
        if (currentUser) {
            const unsubscribe = firebase.firestore().collection('users').doc(currentUser.uid)
                .onSnapshot((documentSnapshot) => {
                    if (documentSnapshot.exists) {
                        setUser(documentSnapshot.data());
                    }
                }, (error) => {
                    console.log('Hata:', error);
                });

            return () => unsubscribe();
        }
    }, []);

    const navigateToUpdateScreen = () => {
        navigation.navigate('UserUpdateScreen');
    };

    return (
        <View style={styles.container}>
            <View style={styles.userInfoSection}>
                <Text style={styles.header}>Kullanıcı Bilgileri</Text>
                <Text style={styles.userInfoText}>İsim: {user.firstName} {user.lastName}</Text>
                <Text style={styles.userInfoText}>Email: {user.email}</Text>

                <TouchableOpacity style={styles.button} onPress={navigateToUpdateScreen}>
                    <Text style={styles.buttonText}>Bilgileri Güncelle</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    userInfoSection: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
        width: '90%',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#026efd',
        marginBottom: 20,
    },
    userInfoText: {
        fontSize: 18,
        marginBottom: 10,
        color: '#333',
    },
    button: {
        backgroundColor: '#026efd',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        width: '80%',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default UserScreen;
