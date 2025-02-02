import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NoCameraDevice() {
  return (
    <View style={styles.container}>
      <View style={styles.textWrapper}>
        <Text>No camera device found.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  textWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
