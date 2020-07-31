import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  Button,
  Text,
  Platform,
  Alert,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Camera } from 'expo-camera';
import { v4 as uuidv4 } from 'uuid';
import { MaterialIcons } from '@expo/vector-icons';
import api from '~/services/api';

import Loading from '~/components/loading';

const genero = {
  M: 'Masculino',
  F: 'Feminino',
};

const register = ({ navigation }) => {
  const camRef = useRef(null);

  const [value, onChangeText] = useState();
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const enroll = async () => {
    if (camRef) {
      const options = {
        quality: 0.3,
        base64: true,
        width: 480,
      };

      const { base64 } = await camRef.current.takePictureAsync(options);
      setIsLoading(true);

      const { data } = await api.post('enroll', {
        image: base64,
        subject_id: `${value.replace(/\s{1,}/g, '')}__${uuidv4()}`,
        gallery_name: 'MyGallery',
      });

      setIsLoading(false);

      if (data.Errors) {
        const message = data.Errors[0].Message;
        Alert.alert(message);
      }
      if (data.images) {
        const { transaction, attributes } = data.images[0];
        const [name] = transaction.subject_id.split('__');
        const { age, gender } = attributes;

        Alert.alert(
          `${name} foi cadastrado(a) com sucesso!`,
          `Aparenta ter ${age} anos e ser do sexo ${genero[gender.type]}`
        );
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
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera style={{ flex: 1 }} type={type} ref={camRef}>
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              flexDirection: 'row',
              padding: 16,
              justifyContent: 'flex-end',
            }}
          >
            <TouchableOpacity
              style={{
                width: 32,
                height: 32,
                marginRight: 16,
                marginTop: 16,
                alignSelf: 'flex-start',
              }}
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}
            >
              <MaterialIcons name="refresh" size={32} color="white" />
            </TouchableOpacity>
          </SafeAreaView>
        </Camera>
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
