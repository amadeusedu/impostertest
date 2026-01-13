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
import CategoriesScreen from '../screens/CategoriesScreen';
import OtherPartyGamesScreen from '../screens/OtherPartyGamesScreen';

export type RootStackParamList = {
  Settings: undefined;
  PlayerNames: undefined;
  Categories: undefined;
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
  OtherPartyGames: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0B0A10' },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="Settings" component={GameSettingsScreen} />
        <Stack.Screen
          name="PlayerNames"
          component={PlayerNamesScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="Categories"
          component={CategoriesScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="PlayersGrid"
          component={PlayersGridScreen}
          options={{ animation: 'fade_from_bottom' }}
        />
        <Stack.Screen name="PassPhone" component={PassPhoneScreen} />
        <Stack.Screen name="PlayerTurn" component={PlayerTurnScreen} />
        <Stack.Screen name="AllAnswers" component={AllAnswersScreen} />
        <Stack.Screen name="Voting" component={VotingScreen} />
        <Stack.Screen name="ResultsReveal" component={ResultsRevealScreen} />
        <Stack.Screen
          name="OtherPartyGames"
          component={OtherPartyGamesScreen}
          options={{ animation: 'slide_from_right' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
