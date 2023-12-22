import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { firebase } from '../config';

const Registration = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const registerUser = async () => {
        if (email === '' || password === '') {
            alert('Email and password are required');
            return;
        }
    
        if (password.length < 8) {
            alert('Password should be at least 8 characters');
            return;
        }
    
        try {
            // ... Kullanıcı kaydı işlemleri ...
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            console.log('User registered: ', userCredential.user);
            console.log("Navigating to Login");
<<<<<<< HEAD
            firebase.firestore().collection('users')
            .doc(firebase.auth().currentUser.uid)
            .set({
                firstName,
                lastName,
                email,
            })

=======
>>>>>>> 51b5e915667cc0665b9208c0b59600a82d9b21b1
            navigation.navigate('Login');
        } catch (error) {
            alert(error.message);
        }
        
    };
    

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Register Here!!</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="First Name"
                    onChangeText={setFirstName}
                    autoCorrect={false}
                />
                <TextInput
                    style={styles.textInput}
                    placeholder="Last Name"
                    onChangeText={setLastName}
                    autoCorrect={false}
                />
                <TextInput
                    style={styles.textInput}
                    placeholder="Email"
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.textInput}
                    placeholder="Password"
                    onChangeText={setPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={true}
                />
                <TouchableOpacity
                    onPress={registerUser}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 100,
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 23,
    },
    inputContainer: {
        marginTop: 40,
    },
    textInput: {
        paddingTop: 20,
        paddingBottom: 10,
        width: 400,
        fontSize: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        marginBottom: 10,
        textAlign: 'center',
    },
    button: {
        marginTop: 50,
        height: 70,
      
        backgroundColor: '#026efd',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
    },
    buttonText: {
        fontWeight: 'bold',
        color:'white',
        fontSize: 22,
    },
});

export default Registration;