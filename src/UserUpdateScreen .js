import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { firebase } from '../config';
import * as Notifications from 'expo-notifications';
const UserUpdateScreen = ({navigation}) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        const currentUser = firebase.auth().currentUser;
        if (currentUser) {
            firebase.firestore().collection('users').doc(currentUser.uid).get()
            .then((documentSnapshot) => {
                if (documentSnapshot.exists) {
                    const userData = documentSnapshot.data();
                    setFirstName(userData.firstName);
                    setLastName(userData.lastName);
                    setEmail(userData.email);
                }
            });
        }
    }, []);

    const updateUser = () => {
        const currentUser = firebase.auth().currentUser;
        if (currentUser) {
            firebase.firestore().collection('users').doc(currentUser.uid).set({
                firstName,
                lastName,
                email,
            }, { merge: true })
            .then(() => {
                navigation.navigate('User');

              
                Notifications.scheduleNotificationAsync({
                    content: {
                      title: "guncelleme islemi",
                      body: 'kulannci bilgileri basarile guncellendi',
                    },
                    trigger: { seconds: 1 },
                  });            })
            .catch((error) => {
                Alert.alert('Hata', error.message);
            });
        }
    };

    const changePassword = () => {
        const user = firebase.auth().currentUser;
        const credential = firebase.auth.EmailAuthProvider.credential(
            user.email, 
            currentPassword
        );

        user.reauthenticateWithCredential(credential).then(() => {
            user.updatePassword(newPassword).then(() => {
                Alert.alert('Başarılı', 'Şifre başarıyla güncellendi');
            }).catch((error) => {
                Alert.alert('Hata', error.message);
            });
        }).catch((error) => {
            Alert.alert('Hata', 'Mevcut şifre doğru değil');
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Kullanıcı Bilgilerini Güncelle</Text>

            <View style={styles.inputGroup}>
                <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                />
                <TouchableOpacity style={styles.button} onPress={updateUser}>
                    <Text style={styles.buttonText}>Bilgileri Güncelle</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.title}>Şifre Değiştir</Text>
            <View style={styles.inputGroup}>
                <TextInput
                    style={styles.input}
                    placeholder="Mevcut Şifre"
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry
                />
                <TextInput
                    style={styles.input}
                    placeholder="Yeni Şifre"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                />
                <TouchableOpacity style={styles.button} onPress={changePassword}>
                    <Text style={styles.buttonText}>Şifreyi Değiştir</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f4f4f4',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 20,
        marginBottom: 10,
        textAlign: 'center',
    },
    inputGroup: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 20,
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#026efd',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default UserUpdateScreen;