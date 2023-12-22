import React, { useState, useEffect } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { createStackNavigator } from "@react-navigation/stack";
import { firebase } from './config';
import Admin from './src/admin';
import Login from './src/Login';
import Registration from "./src/Registration";
import Dashboard from "./src/Dashboard";
import Header from "./components/Header";
import Icon from 'react-native-vector-icons/Ionicons';

import UserScreen from './src/UserScreen';
import FavoritesScreen from './src/FavoritesScreen';
import CartScreen from './src/CartScreen';



const Tab = createBottomTabNavigator();

const MyTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'User') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Dashboard} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="User" component={UserScreen} />
    </Tab.Navigator>
  );
};







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



    
      <Stack.Navigator initialRouteName="Login">
      {/* Giriş yapmış kullanıcılar için Dashboard ekranı */}
      <Stack.Screen 
        name="Dashboard" 
        component={Dashboard}
        options={{
          headerTitle: () => <Header name="Dashboard"/>,
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
  
      {/* Herkese açık Admin ekranı */}
      <Stack.Screen name="Admin" component={Admin} 
       options={{
        headerTitle: () => <Header name="Admin"/>,
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
  
      {/* Giriş yapmamış kullanıcılar için Login ve Registration ekranları */}
      <Stack.Screen 
        name="Login" 
        component={Login}
        options={{
          headerTitle: () => <Header name="Login"/>,
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
          headerTitle: () => <Header name="Registration"/>,
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
                    <Stack.Screen name="Home" component={MyTabs} options={{ headerShown: false }} />

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
