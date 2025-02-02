import { RefObject, useCallback, useState } from 'react';
import { Camera, Point } from 'react-native-vision-camera';
import { Gesture } from 'react-native-gesture-handler';
import { runOnJS, useSharedValue } from 'react-native-reanimated';
import { useCountDown } from 'ahooks';

export default function useTapFocusGesture(cameraRef: RefObject<Camera>) {
  const [isFocusing, setIsFocusing] = useState(false);
  const [dismissFocusPointTarget, setDismissFocusPointTarget] =
    useState<number>();
  const positionX = useSharedValue(0);
  const positionY = useSharedValue(0);

  useCountDown({
    targetDate: dismissFocusPointTarget,
    onEnd: () => {
      setIsFocusing(false);
    },
  });

  const focus = useCallback(
    (point: Point) => {
      if (!cameraRef?.current) return;
      const c = cameraRef.current;
      if (c == null) return;

      setDismissFocusPointTarget(Date.now() + 2000);
      setIsFocusing(true);
      positionX.value = point.x;
      positionY.value = point.y;

      c.focus(point);
    },
    [cameraRef?.current],
  );

  const focusGesture = Gesture.Tap().onEnd(({ x, y }) => {
    runOnJS(focus)({ x, y });
  });

  return {
    focusGesture,
    isFocusing,
    focusCoords: {
      x: positionX.value,
      y: positionY.value,
    },
  };
}
