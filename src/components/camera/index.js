import React from 'react';
import { Camera } from 'expo-camera';

const RNCamera = ({ children }, type, ref) => {
  return (
    <Camera style={{ flex: 1 }} type={type} ref={ref}>
      {children}
    </Camera>
  );
};

export default RNCamera;
