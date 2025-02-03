import React, { useState } from 'react';
import Animated, {
  FadeInDown,
  FadeOutUp,
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native';

type Props = {
  zoomValue: SharedValue<number>,
  coords: {
    x: SharedValue<number>,
    y: SharedValue<number>,
  },
};

export default function ZoomGauge({ zoomValue, coords }: Props) {
  // const representedValue = useDerivedValue(() => zoomValue);

  const [representedValue, setRepresentedValue] = useState<number | null>(null);

  useAnimatedReaction(
    () => zoomValue,
    (currentValue) => {
      runOnJS(setRepresentedValue)(zoomValue.value);
    },
  );

  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    top: coords?.y?.value - 100,
    left: coords?.x?.value - 50,
  }));
  return (
    <Animated.View
      style={animatedStyle}
      entering={FadeInDown}
      exiting={FadeOutUp}
    >
      <Animated.Text style={styles.text}>
        {representedValue && representedValue.toFixed(2)}
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontWeight: 'bold',
    fontSize: 28,
    backgroundColor: 'white',
    padding: 4,
    borderRadius: 24,
  },
});
