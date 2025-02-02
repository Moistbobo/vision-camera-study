import react from 'react';
import type { PhotoFile } from 'react-native-vision-camera/src/types/PhotoFile';
import { Button, Image, StyleSheet, View } from 'react-native';
import React from 'react';

type Props = {
  photo?: PhotoFile,
  handleRetake: () => void,
};

export default function PhotoPreview({ photo, handleRetake }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <Image style={styles.photoPreview} source={{ uri: photo?.path }} />
      </View>

      <View style={styles.buttonWrapper}>
        <Button title="Retake" onPress={handleRetake} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  contentWrapper: {
    flex: 1,
  },
  photoPreview: {
    aspectRatio: '3/4',
  },
  buttonWrapper: {
    justifyContent: 'space-between',
  },
});
