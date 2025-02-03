import { useCallback, useState } from 'react';
import { CameraProps } from 'react-native-vision-camera';
import {
  Gesture,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedProps,
  useSharedValue,
} from 'react-native-reanimated';

const SCALE_FULL_ZOOM = 3;

type Props = {
  deviceMinZoom?: number,
  deviceMaxZoom?: number,
};

export default function useZoomGesture({
  deviceMinZoom,
  deviceMaxZoom,
}: Props) {
  const [isZooming, setIsZooming] = useState(false);

  const minZoom = deviceMinZoom ?? 1;
  const maxZoom = Math.min(deviceMaxZoom ?? 1, 10);
  const startZoom = useSharedValue(1.5);
  const zoom = useSharedValue(1.5);
  const panZoomX = useSharedValue(0);
  const panZoomY = useSharedValue(0);

  const handlePanZoomGesture = useCallback(
    (e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
      panZoomX.value = e.x;
      panZoomY.value = e.y;

      const _startZoom = startZoom.value ?? 0;

      const _scale = interpolate(
        -e.translationY,
        [1 - (1 / SCALE_FULL_ZOOM) * 100, 1, SCALE_FULL_ZOOM * 100],
        [-1, 0, 1],
        Extrapolation.CLAMP,
      );

      zoom.value = interpolate(
        _scale,
        [-1, 0, 1],
        [minZoom, _startZoom, maxZoom],
        Extrapolation.CLAMP,
      );
    },
    [startZoom.value],
  );

  const panZoomGesture = Gesture.Pan()
    .onStart(() => {
      startZoom.value = zoom.value;
      runOnJS(setIsZooming)(true);
    })
    .onUpdate((e) => {
      runOnJS(handlePanZoomGesture)(e);
    })
    .onEnd(() => {
      runOnJS(setIsZooming)(false);
    });

  const pinchZoomGesture = Gesture.Pinch()
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
    pinchZoomGesture,
    cameraAnimatedProps,
    panZoomGesture,
    zoomValue: zoom,
    isZooming,
    panZoomGestureCoords: {
      x: panZoomX,
      y: panZoomY,
    },
  };
}
