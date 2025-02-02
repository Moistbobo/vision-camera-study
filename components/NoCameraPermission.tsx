import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useCameraPermission } from 'react-native-vision-camera';

export default function NoCameraPermission() {
  const { requestPermission } = useCameraPermission();

  return (
    <View style={styles.container}>
      <View style={styles.textWrapper}>
        <Text>Camera permissions not granted.</Text>
      </View>

      <View style={styles.buttonWrapper}>
        <Button title={'Grant permissions'} onPress={requestPermission} />
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
  buttonWrapper: {
    paddingBottom: 16,
  },
});
