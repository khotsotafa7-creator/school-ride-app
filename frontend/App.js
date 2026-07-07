// frontend/App.js
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Auth screens
import WelcomeScreen         from './screens/WelcomeScreen';
import LoginScreen           from './screens/LoginScreen';
import RegisterScreen        from './screens/RegisterScreen';
import ForgotPasswordScreen  from './screens/ForgotPasswordScreen';

// Parent screens
import HomeScreen            from './screens/HomeScreen';

// Driver screens — placeholder for now
import DriverHomeScreen      from './screens/DriverHomeScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Welcome'
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#0a1628' }
        }}
      >
        {/* Auth */}
        <Stack.Screen name='Welcome'         component={WelcomeScreen} />
        <Stack.Screen name='Login'           component={LoginScreen} />
        <Stack.Screen name='Register'        component={RegisterScreen} />
        <Stack.Screen name='ForgotPassword'  component={ForgotPasswordScreen} />

        {/* Parent */}
        <Stack.Screen name='Home'            component={HomeScreen} />

        {/* Driver */}
        <Stack.Screen name='DriverHome'      component={DriverHomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}