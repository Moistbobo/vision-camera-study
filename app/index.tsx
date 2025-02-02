import { StyleSheet, Text, View } from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import NoCameraPermission from '@/components/NoCameraPermission';
import NoCameraDevice from '@/components/NoCameraDevice';
import ShutterButton from '@/components/ShutterButton';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PhotoFile } from 'react-native-vision-camera/src/types/PhotoFile';
import PhotoPreview from '@/components/PhotoPreview';
import Animated, { SlideOutDown, ZoomInRotate } from 'react-native-reanimated';
import { useDebounceCallback } from 'usehooks-ts';
import { useNavigation } from 'expo-router';
import ShutterEffect from '@/components/ShutterEffect';

export default function CameraScreen() {
  const navigation = useNavigation();
  const device = useCameraDevice('back');
  const { hasPermission } = useCameraPermission();

  const cameraRef = useRef<Camera>(null);

  const [lastTakenPhoto, setLastTakenPhoto] = useState<PhotoFile | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(true);
  const [showShutterEffect, setShowShutterEffect] = useState<boolean>(false);

  const handleTakePhoto = useCallback(async () => {
    if (!cameraRef?.current) {
      console.error('Camera not ready');
      return;
    }

    setShowShutterEffect(true);
    setTimeout(() => {
      setShowShutterEffect(false);
    }, 150);

    const photo = await cameraRef.current.takePhoto();

    setLastTakenPhoto(photo);
    setIsCameraActive(false);
  }, [cameraRef?.current]);

  const handleRetake = () => {
    setIsCameraActive(true);
    setTimeout(() => {
      setLastTakenPhoto(null);
    }, 250);
  };

  const debouncedTakePhoto = useDebounceCallback(handleTakePhoto);

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
        <ShutterButton onPress={debouncedTakePhoto} />
      </View>

      {lastTakenPhoto ? (
        <Animated.View
          entering={ZoomInRotate}
          exiting={SlideOutDown}
          style={styles.fullScreenWrapper}
        >
          <PhotoPreview handleRetake={handleRetake} photo={lastTakenPhoto} />
        </Animated.View>
      ) : null}

      <ShutterEffect isShown={showShutterEffect} />
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
