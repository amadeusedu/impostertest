import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import CheckEmailScreen from '../screens/auth/CheckEmailScreen';
import ProfileScreen from '../screens/auth/ProfileScreen';
import AuthHomeScreen from '../screens/auth/AuthHomeScreen';
import UnlockPremiumScreen from '../screens/premium/UnlockPremiumScreen';

export type AuthStackParamList = {
  AuthHome: undefined;
  Login: undefined;
  Signup: undefined;
  CheckEmail: { email: string; mode: 'login' | 'signup' };
  Profile: undefined;
  UnlockPremium: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0B0A10' },
        animation: 'fade_from_bottom',
      }}
    >
      <Stack.Screen name="AuthHome" component={AuthHomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="CheckEmail" component={CheckEmailScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="UnlockPremium" component={UnlockPremiumScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
