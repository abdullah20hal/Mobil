import React, { useState, useEffect } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { firebase } from './config';

import Login from "./src/Login";
import Registration from "./src/Registration";
import Dashboard from "./src/Dashboard";
import Header from "./components/Header";

const Stack = createStackNavigator();

function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return () => subscriber(); // Unsubscribe on unmount
  }, []);

  if (initializing) return null;

  // Render the navigation container and screens
  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen 
            name="Dashboard" 
            component={Dashboard}
            options={{
              headerTitle: () => <Header name="Abdullah"/>,
              headerStyle: {
                height: 150,
                borderBottomLeftRadius: 25,
                borderBottomRightRadius: 25,
                backgroundColor: '#00e4d0',
                shadowColor: '#000',
                elevation: 25
              }
            }} 
          />
          {/* Add other screens for logged-in users here */}
        </>
      ) : (
        <>
          <Stack.Screen 
            name="Login" 
            component={Login}
            options={{
              headerTitle: () => <Header name="Abdullah"/>,
              headerStyle: {
                height: 150,
                borderBottomLeftRadius: 25,
                borderBottomRightRadius: 25,
                backgroundColor: '#00e4d0',
                shadowColor: '#000',
                elevation: 25
              }
            }} 
          />
          <Stack.Screen 
            name="Registration" 
            component={Registration}
            options={{
              headerTitle: () => <Header name="Abdullah"/>,
              headerStyle: {
                height: 150,
                borderBottomLeftRadius: 25,
                borderBottomRightRadius: 25,
                backgroundColor: '#00e4d0',
                shadowColor: '#000',
                elevation: 25
              }
            }} 
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function NavigationWrapper() {
  return (
    <NavigationContainer>
      <App />
    </NavigationContainer>
  );
}
