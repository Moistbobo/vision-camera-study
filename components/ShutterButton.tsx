import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

type Props = {
  onPress: () => void,
};

export default function ShutterButton({ onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.innerButton} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 48,
    height: 48,
    width: 48,
    borderWidth: 1,
    borderColor: 'blue',
    padding: 4,
  },
  innerButton: {
    height: '90%',
    width: '90%',
  },
});
