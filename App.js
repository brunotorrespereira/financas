

import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';

import AuthProvider from "./src/Contexts/auth";
import Routes from "./src/routes";
import SplashScreen from './src/Components/SplashScreen';

export default function App() {
  const [loading, setLoading] = useState(true);

  const loadAppData = async () => {
    await new Promise(resolve => setTimeout(resolve, 4000));
    setLoading(false); 
  };

  useEffect(() => {
    loadAppData();
  }, []);

  if (loading) {
    return <SplashScreen loadFunction={loadAppData} />;
  }

  return (
    <NavigationContainer>
      <AuthProvider>
        <StatusBar backgroundColor='#131313' barStyle='light-content' />
        <Routes />
      </AuthProvider>
    </NavigationContainer>
  );
}
