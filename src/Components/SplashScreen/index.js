

import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';

const SplashScreen = ({ loadFunction }) => {
  useEffect(() => {
    if (typeof loadFunction === 'function') {
      loadFunction();
    } else {
      console.error('loadFunction não é uma função');
    }
  }, [loadFunction]);

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/splash1.png')} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#131313',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', 
    resizeMode: 'cover', 
  },
});

export default SplashScreen;




