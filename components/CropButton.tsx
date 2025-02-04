import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

type Props = {
  isCropping: boolean,
  handlePress: () => void,
};

export default function CropButton({ isCropping, handlePress }: Props) {
  return (
    <TouchableOpacity onPress={handlePress}>
      <Text
        style={{
          backgroundColor: 'white',
          color: 'black',
          fontSize: 24,
          padding: 8,
          borderRadius: 32,
        }}
      >
        {isCropping ? 'Crop' : 'Full'}
      </Text>
    </TouchableOpacity>
  );
}
