import React from 'react';
import type { PhotoFile } from 'react-native-vision-camera/src/types/PhotoFile';
import { Button, Image, StyleSheet, View } from 'react-native';

type Props = {
  photo?: PhotoFile,
  handleSave: () => void,
  handleRetake: () => void,
};

export default function PhotoPreview({
  photo,
  handleSave,
  handleRetake,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        <Image style={styles.photoPreview} source={{ uri: photo?.path }} />
      </View>

      <View style={styles.buttonWrapper}>
        <Button title="Save" onPress={handleSave} />

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
