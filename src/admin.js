import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';

const Admin = ({ navigation, route }) => {
    const { email } = route.params;

    const logoutUser = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
            console.log('çıkış');
            navigation.navigate('Login'); 
        }).catch((error) => {
            console.error('hata:', error);
        });
    };

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={logoutUser}>
                    <Text style={styles.buttonText}>çıkış</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Hello Admin</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    buttonText: {
        // Buton metni için stil tanımlamaları
        color: 'black', // Örnek renk
        marginRight: 20, // Sağ kenar boşluğu
        fontSize: 18, // Font büyüklüğü
    },
});

export default Admin;
