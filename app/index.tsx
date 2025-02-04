import { Dimensions, StyleSheet, View } from 'react-native';
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
import Animated, {
  SlideInDown,
  SlideOutDown,
  SlideOutUp,
  useAnimatedStyle,
  withTiming,
  ZoomInRotate,
} from 'react-native-reanimated';
import ShutterEffect from '@/components/ShutterEffect';
import useTapFocusGesture from '@/hooks/Camera/useTapFocusGesture';
import useZoomGesture from '@/hooks/Camera/useZoomGesture';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import FocusPoint from '@/components/FocusPoint';
import { useDebounceFn } from 'ahooks';
import ZoomGauge from '@/components/ZoomGauge';
import useSavePhoto from '@/hooks/Filesystem/useSavePhoto';
import Toast from 'react-native-toast-message';
import { useNavigation } from 'expo-router';
import CropButton from '@/components/CropButton';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const ReanimatedCamera = Animated.createAnimatedComponent(Camera);
Animated.addWhitelistedNativeProps({
  zoom: true,
});

export default function CameraScreen() {
  const navigation = useNavigation();
  const device = useCameraDevice('back');
  const { hasPermission } = useCameraPermission();

  const cameraRef = useRef<Camera>(null);

  const { focusGesture, isFocusing, focusCoords } =
    useTapFocusGesture(cameraRef);

  const {
    panZoomGestureCoords,
    panZoomGesture,
    isZooming,
    cameraAnimatedProps,
    zoomValue,
  } = useZoomGesture({
    deviceMinZoom: device?.minZoom,
    deviceMaxZoom: device?.maxZoom,
  });

  const savePhotoAsync = useSavePhoto();

  const [lastTakenPhoto, setLastTakenPhoto] = useState<PhotoFile | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(true);
  const [showShutterEffect, setShowShutterEffect] = useState<boolean>(false);

  const [cropMode, setCropMode] = useState<boolean>(false);

  useEffect(() => {
    if (cropMode) {
      navigation.setOptions({
        headerShown: false,
      });
    } else {
      navigation.setOptions({
        headerShown: false,
      });
    }
  }, [cropMode]);

  const cameraAnimatedStyle = useAnimatedStyle(() => {
    const height = cropMode ? screenWidth : screenHeight;

    return {
      height,
      width: screenWidth,
      position: cropMode ? 'relative' : 'absolute',
    };
  }, [cropMode]);

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

  const handleSavePhoto = async () => {
    if (lastTakenPhoto) {
      await savePhotoAsync(lastTakenPhoto);

      Toast.show({
        type: 'success',
        text1: 'Photo saved!',
      });

      handleRetake();
    }
  };

  const handleRetake = () => {
    setIsCameraActive(true);
    setTimeout(() => {
      setLastTakenPhoto(null);
    }, 250);
  };

  const { run: debouncedTakePhoto } = useDebounceFn(handleTakePhoto);

  const composedGestures = Gesture.Race(panZoomGesture, focusGesture);

  if (!hasPermission) {
    return <NoCameraPermission />;
  }

  if (!device) {
    return <NoCameraDevice />;
  }

  return (
    <View style={styles.container}>
      {cropMode ? (
        <Animated.View
          entering={SlideInDown}
          exiting={SlideOutUp}
          style={styles.cropBlockerTop}
        />
      ) : null}
      <GestureDetector gesture={composedGestures}>
        <ReanimatedCamera
          ref={cameraRef}
          photo
          style={cameraAnimatedStyle}
          device={device}
          isActive={isCameraActive}
          animatedProps={cameraAnimatedProps}
        />
      </GestureDetector>

      <FocusPoint coords={focusCoords} isFocusing={isFocusing} />

      <View style={styles.shutterButtonWrapper}>
        <ShutterButton onPress={debouncedTakePhoto} />
      </View>

      {lastTakenPhoto ? (
        <Animated.View
          entering={ZoomInRotate}
          exiting={SlideOutDown}
          style={styles.fullScreenWrapper}
        >
          <PhotoPreview
            handleSave={handleSavePhoto}
            handleRetake={handleRetake}
            photo={lastTakenPhoto}
          />
        </Animated.View>
      ) : null}
      {showShutterEffect ? <ShutterEffect /> : null}
      {isZooming ? (
        <ZoomGauge coords={panZoomGestureCoords} zoomValue={zoomValue} />
      ) : null}

      <View style={styles.cropButtonWrapper}>
        <CropButton
          isCropping={cropMode}
          handlePress={() => {
            setCropMode((prev) => !prev);
          }}
        />
      </View>
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
  cropButtonWrapper: {
    position: 'absolute',
    top: 32,
    right: 16,
  },
  cropBlockerTop: {
    width: screenWidth,
    height: screenHeight * 0.1,
    backgroundColor: 'white',
  },
});
