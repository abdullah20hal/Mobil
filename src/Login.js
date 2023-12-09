import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../config';

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginUser = async () => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      // Optionally navigate to another screen upon successful login
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Login</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          onChangeText={setPassword}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
        />
      </View>
      <TouchableOpacity onPress={loginUser} style={styles.button}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Registration')} style={styles.registerLink}>
        <Text style={styles.registerText}>Don't have an account? Register Now</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 100,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 26
  },
  inputContainer: {
    marginTop: 40
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
    width: 250,
    backgroundColor: '#026efd',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#fff'
  },
  registerLink: {
    marginTop: 20
  },
  registerText: {
    fontWeight: 'bold',
    fontSize: 16
  }
});
