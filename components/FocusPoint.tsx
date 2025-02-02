import React from 'react';
import { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';

type Props = {
  coords: {
    x: number,
    y: number,
  },
  isFocusing?: boolean,
};

export default function FocusPoint({ coords, isFocusing }: Props) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      width: 60,
      height: 60,
      borderWidth: 1,
      borderColor: 'orange',
      top: withTiming(coords.y - 30, { duration: 200 }),
      left: withTiming(coords.x - 30, { duration: 200 }),
      transform: [
        {
          scale: withTiming(isFocusing ? 1 : 2, { duration: 400 }),
        },
      ],
      opacity: withTiming(isFocusing ? 1 : 0, { duration: 250 }),
    };
  });

  return <Animated.View pointerEvents="none" style={animatedStyle} />;
}
