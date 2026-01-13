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
import VotingResultsScreen from '../screens/VotingResultsScreen';
import RevealScreen from '../screens/RevealScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import CategoryDetailScreen from '../screens/CategoryDetailScreen';
import OtherPartyGamesScreen from '../screens/OtherPartyGamesScreen';

export type RootStackParamList = {
  Settings: undefined;
  PlayerNames: undefined;
  Categories: undefined;
  CategoryDetail: { category: string };
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
  VotingResults: undefined;
  Reveal: undefined;
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
          animation: 'fade_from_bottom',
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
          name="CategoryDetail"
          component={CategoryDetailScreen}
          options={{ animation: 'fade_from_bottom' }}
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
        <Stack.Screen name="VotingResults" component={VotingResultsScreen} />
        <Stack.Screen name="Reveal" component={RevealScreen} />
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
