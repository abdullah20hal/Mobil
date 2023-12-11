import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { firebase } from '../config';

const Dashboard = () => {
  const [name, setName] = useState('');

  useEffect(() => {
    firebase.firestore().collection('users')
      .doc(firebase.auth().currentUser.uid).get()
      .then((snapshot) => {
        if (snapshot.exists) {
          setName(snapshot.data())
        } else {
          console.log('User does not exist');
        }
      });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>
        Hello, {name.firstName}
      </Text>
      <TouchableOpacity
        onPress={() => firebase.auth().signOut()}
        style={styles.button}
      >
        <Text style={styles.buttonText}>
          Sign out
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default Dashboard;

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
        width: 250,
        backgroundColor: '#026efd',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 22,
        color: '#fff', // assuming you might want the text color to be white for better visibility on the blue button
    },
});
