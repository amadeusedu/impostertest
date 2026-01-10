import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GameProvider } from './src/utils/GameContext';
import RootNavigator from './src/navigation/RootNavigator';

const App = () => {
  return (
    <GameProvider>
      <StatusBar style="light" />
      <RootNavigator />
    </GameProvider>
  );
};

export default App;
