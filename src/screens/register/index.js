import React, { useState, useRef } from 'react';
import {
  View,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  Button,
  Alert,
  Platform,
} from 'react-native';
import { Camera } from 'expo-camera';
import api from '~/services/api';

const register = () => {
  const camRef = useRef(null);

  const [value, onChangeText] = useState();
  const [type, setType] = useState(Camera.Constants.Type.back);

  const enroll = async () => {
    if (camRef) {
      const { base64 } = await camRef.current.takePictureAsync({
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

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera style={{ flex: 1 }} type={type} ref={camRef} />
      </View>
      <KeyboardAvoidingView
        style={styles.inputContainer}
        enabled={Platform.OS === 'ios'}
        behavior="position"
        contentContainerStyle={{ backgroundColor: '#000' }}
      >
        <TextInput
          style={styles.input}
          onChangeText={(text) => onChangeText(text)}
          placeholder="Digite o nome"
          value={value}
        />
        <Button title="Cadastrar" onPress={enroll} />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: 'blue',
  },
  inputContainer: {
    height: 110,
    backgroundColor: 'black',
  },
  input: {
    height: 40,
    fontSize: 15,
    paddingLeft: 8,
    margin: 8,
    borderRadius: 10,
    backgroundColor: '#ccc',
  },
});

export default register;
