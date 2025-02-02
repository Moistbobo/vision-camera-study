import { StyleSheet, Text, View } from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import NoCameraPermission from '@/components/NoCameraPermission';
import NoCameraDevice from '@/components/NoCameraDevice';
import ShutterButton from '@/components/ShutterButton';
import { useCallback, useRef, useState } from 'react';
import { PhotoFile } from 'react-native-vision-camera/src/types/PhotoFile';
import PhotoPreview from '@/components/PhotoPreview';

export default function Index() {
  const device = useCameraDevice('back');
  const { hasPermission } = useCameraPermission();

  const cameraRef = useRef<Camera>(null);

  const [lastTakenPhoto, setLastTakenPhoto] = useState<PhotoFile | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(true);

  const handleTakePhoto = useCallback(async () => {
    if (!cameraRef?.current) {
      console.error('Camera not ready');
      return;
    }

    const photo = await cameraRef.current.takePhoto();
    setLastTakenPhoto(photo);
    setIsCameraActive(false);
  }, [cameraRef?.current]);

  const handleRetake = () => {
    setLastTakenPhoto(null);
    setIsCameraActive(true);
  };

  if (!hasPermission) {
    return <NoCameraPermission />;
  }

  if (!device) {
    return <NoCameraDevice />;
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        photo
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isCameraActive}
      />

      <View style={styles.shutterButtonWrapper}>
        <ShutterButton onPress={handleTakePhoto} />
      </View>

      {lastTakenPhoto ? (
        <View style={styles.fullScreenWrapper}>
          <PhotoPreview handleRetake={handleRetake} photo={lastTakenPhoto} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  shutterButtonWrapper: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
  },
  fullScreenWrapper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
  },
});
