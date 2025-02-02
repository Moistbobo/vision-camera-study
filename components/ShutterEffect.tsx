import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

type Props = {
  isShown?: boolean,
};

export default function ShutterEffect({ isShown }: Props) {
  if (!isShown) return null;
  return (
    <Animated.View
      entering={FadeIn.duration(100)}
      exiting={FadeOut.duration(200)}
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
});
