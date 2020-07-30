// In App.js in a new project

import * as React from 'react';
import { Text, View } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';

import HomeScreen from '~/screens/home';
import RegisterScreen from '~/screens/register';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const icons = {
  Home: {
    lib: MaterialIcons,
    name: 'home',
  },
  Register: {
    lib: MaterialIcons,
    name: 'person-add',
  },
};

function Routes() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const { lib: Icon, name } = icons[route.name];
          return <Icon name={name} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        keyboardHidesTabBar: true,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Register" component={RegisterScreen} />
    </Tab.Navigator>
  );
}

export default Routes;
