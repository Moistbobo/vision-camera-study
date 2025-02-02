import { RefObject, useEffect } from 'react';
import { Camera, CameraProps } from 'react-native-vision-camera';
import { Gesture } from 'react-native-gesture-handler';
import {
  Extrapolation,
  interpolate,
  useAnimatedProps,
  useSharedValue,
} from 'react-native-reanimated';

const SCALE_FULL_ZOOM = 3;

type Props = {
  deviceMinZoom?: number,
  deviceMaxZoom?: number,
  deviceNeutralZoom?: number,
};

export default function useZoomGesture({
  deviceMinZoom,
  deviceMaxZoom,
  deviceNeutralZoom,
}: Props) {
  const minZoom = deviceMinZoom ?? 1;
  const maxZoom = Math.min(deviceMaxZoom ?? 1, 10);
  const startZoom = useSharedValue(1.5);
  const zoom = useSharedValue(1.5);

  const zoomGesture = Gesture.Pinch()
    .onStart(() => {
      startZoom.value = zoom.value;
    })
    .onUpdate((e) => {
      const _startZoom = startZoom.value ?? 0;
      const _scale = interpolate(
        e.scale,
        [1 - 1 / SCALE_FULL_ZOOM, 1, SCALE_FULL_ZOOM],
        [-1, 0, 1],
        Extrapolation.CLAMP,
      );
      zoom.value = interpolate(
        _scale,
        [-1, 0, 1],
        [minZoom, _startZoom, maxZoom],
        Extrapolation.CLAMP,
      );
    });

  const cameraAnimatedProps = useAnimatedProps<CameraProps>(() => {
    const z = Math.max(Math.min(zoom.value, maxZoom), minZoom);
    return {
      zoom: z,
    };
  }, [maxZoom, minZoom, zoom]);

  return {
    zoomGesture,
    cameraAnimatedProps,
  };
}
