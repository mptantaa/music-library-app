import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Favorites() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Избранная музыка</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#25292e',
  },
  title: {
    fontSize: 24,
    color: '#fff',
  },
});
