import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import api from '~/services/api';

import Loading from '~/components/loading';

export default function Home() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [isLoading, setIsLoading] = useState(false);

  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const recognize = async () => {
    if (cameraRef) {
      const { base64 } = await cameraRef.current.takePictureAsync({
        quality: 0.5,
        base64: true,
      });
      setIsLoading(true);

      const { data } = await api.post('recognize', {
        image: base64,
        gallery_name: 'MyGallery',
        selector: 'liveness',
      });

      setIsLoading(false);

      if (data.Errors) {
        const message = data.Errors[0].Message;
        Alert.alert(message);
      }
      if (data.images) {
        const { transaction } = data.images[0];

        if (transaction.confidence > 0.6) {
          Alert.alert(`Bem vindo ${transaction.subject_id}`);
        } else {
          Alert.alert('Rosto não encontrado');
        }
      }
    }
  };

  const enroll = async () => {
    if (cameraRef) {
      const { base64 } = await cameraRef.current.takePictureAsync({
        quality: 0.5,
        base64: true,
      });

      const response = await api.post('enroll', {
        image: base64,
        subject_id: 'Marcos',
        gallery_name: 'MyGallery',
      });

      console.log(response);
    }
  };

  if (isLoading) {
    return <Loading />;
  }
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} type={type} ref={cameraRef}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
            padding: 8,
            justifyContent: 'space-between',
          }}
        >
          <TouchableOpacity
            style={{
              alignSelf: 'flex-end',
              alignItems: 'center',
              width: 140,
              backgroundColor: 'white',
              padding: 8,
            }}
            onPress={recognize}
          >
            <Text style={{ fontSize: 28, marginBottom: 10, color: 'black' }}>
              recognize
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              alignSelf: 'flex-end',
              alignItems: 'center',
              backgroundColor: 'white',
              width: 140,
              padding: 8,
            }}
            onPress={enroll}
          >
            <Text style={{ fontSize: 28, marginBottom: 10, color: 'black' }}>
              enroll
            </Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}