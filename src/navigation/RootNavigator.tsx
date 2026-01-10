import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GameSettingsScreen from '../screens/GameSettingsScreen';
import PlayerNamesScreen from '../screens/PlayerNamesScreen';
import PlayersGridScreen from '../screens/PlayersGridScreen';
import PassPhoneScreen from '../screens/PassPhoneScreen';
import PlayerTurnScreen from '../screens/PlayerTurnScreen';
import AllAnswersScreen from '../screens/AllAnswersScreen';
import VotingScreen from '../screens/VotingScreen';
import ResultsRevealScreen from '../screens/ResultsRevealScreen';

export type RootStackParamList = {
  Settings: undefined;
  PlayerNames: undefined;
  PlayersGrid: undefined;
  PassPhone: {
    title: string;
    subtitle: string;
    buttonLabel: string;
    nextScreen: keyof RootStackParamList;
    nextParams?: Record<string, unknown>;
  };
  PlayerTurn: { playerId: string };
  AllAnswers: undefined;
  Voting: undefined;
  ResultsReveal: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0B0A10' },
        }}
      >
        <Stack.Screen name="Settings" component={GameSettingsScreen} />
        <Stack.Screen name="PlayerNames" component={PlayerNamesScreen} />
        <Stack.Screen name="PlayersGrid" component={PlayersGridScreen} />
        <Stack.Screen name="PassPhone" component={PassPhoneScreen} />
        <Stack.Screen name="PlayerTurn" component={PlayerTurnScreen} />
        <Stack.Screen name="AllAnswers" component={AllAnswersScreen} />
        <Stack.Screen name="Voting" component={VotingScreen} />
        <Stack.Screen name="ResultsReveal" component={ResultsRevealScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
