import React from 'react';
import { View, Text, TextInput } from 'react-native';

const register = () => {
  const [value, onChangeText] = React.useState('Useless Placeholder');

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
      <TextInput
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
        }}
        onChangeText={(text) => onChangeText(text)}
        editable={false}
        value={value}
      />
    </View>
  );
};

export default register;
