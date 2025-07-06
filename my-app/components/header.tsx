import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Header() {
  const handlePress = () => {
    console.log('Icon button pressed!');
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.spacer} /> 
      <Image
        source={require('../assets/icon.png')}
        style={styles.logo}
      />
      <TouchableOpacity onPress={handlePress}>
        <Ionicons name="settings-outline" size={28} color="#f9f9fb" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  spacer: {
    width: 28,
  },
});
