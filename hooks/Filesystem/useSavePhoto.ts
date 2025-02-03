import { useCallback } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { PhotoFile } from 'react-native-vision-camera';

export default function useSavePhoto() {
  return useCallback(async (photoFile: PhotoFile) => {
    try {
      await MediaLibrary.saveToLibraryAsync(photoFile.path);
    } catch (error) {
      console.error(error);
    }
  }, []);
}
