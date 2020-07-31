import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Text, View, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import RNCamera from '~/components/camera';
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

    console.log('effect');

    return () => {
      console.log('return effect');
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      console.log('adsfsfda');
    }, [])
  );

  const recognize = async () => {
    if (cameraRef) {
      const options = {
        quality: 0.3,
        base64: true,
        width: 480,
      };

      const { base64 } = await cameraRef.current.takePictureAsync(options);
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
          const [name] = transaction.subject_id.split('__');
          Alert.alert(`Bem vindo ${name}`);
        } else {
          Alert.alert('Rosto não encontrado');
        }
      }
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
            justifyContent: 'center',
          }}
        >
          <TouchableOpacity
            style={{
              alignSelf: 'flex-end',
              alignItems: 'center',
              width: 140,
              height: 50,
              backgroundColor: 'white',
              borderRadius: 10,
              padding: 8,
            }}
            onPress={recognize}
          >
            <Text
              style={{
                fontSize: 28,
                color: 'black',
              }}
            >
              Validar
            </Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}
