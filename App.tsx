import "react-native-gesture-handler";
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GameProvider } from './src/utils/GameContext';
import { AuthProvider } from './src/auth/AuthProvider';
import RootNavigator from './src/navigation/RootNavigator';

const App = () => {
  return (
    <AuthProvider>
      <GameProvider>
        <StatusBar style="light" />
        <RootNavigator />
      </GameProvider>
    </AuthProvider>
  );
};

export default App;
