import React, { createContext, useContext, useMemo, useState } from 'react';
import { questionPairs } from '../data/questions';
import {
  Player,
  RoundState,
  createRound,
  generateId,
  getAssignedQuestion,
  pickQuestionPair,
} from './game';

interface GameContextValue {
  players: Player[];
  imposterCount: number;
  showCategory: boolean;
  selectedCategories: string[];
  round: RoundState | null;
  recentQuestionIds: string[];
  setImposterCount: (count: number) => void;
  setShowCategory: (value: boolean) => void;
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  updatePlayerName: (id: string, name: string) => void;
  addPlayer: () => void;
  removePlayer: () => void;
  startGame: () => void;
  resetToSettings: () => void;
  submitAnswer: (playerId: string, answer: string) => void;
  startVoting: () => void;
  setCurrentVoter: (playerId?: string) => void;
  submitVote: (voterId: string, votedId: string) => void;
  playAgain: () => void;
  getQuestionForPlayer: (playerId: string) => string;
}

const defaultPlayers = ['Alex', 'Lucas', 'Nic', 'Dimi', 'Steli'];
const maxPlayers = 100;

const createDefaultPlayers = () =>
  defaultPlayers.map((name) => ({ id: generateId(), name }));

const GameContext = createContext<GameContextValue | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [players, setPlayers] = useState<Player[]>(createDefaultPlayers());
  const [imposterCount, setImposterCount] = useState(1);
  const [showCategory, setShowCategory] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [round, setRound] = useState<RoundState | null>(null);
  const [recentQuestionIds, setRecentQuestionIds] = useState<string[]>([]);

  const updatePlayerName = (id: string, name: string) => {
    setPlayers((prev) => prev.map((player) => (player.id === id ? { ...player, name } : player)));
  };

  const addPlayer = () => {
    setPlayers((prev) => {
      if (prev.length >= maxPlayers) {
        return prev;
      }
      const nextIndex = prev.length + 1;
      return [...prev, { id: generateId(), name: `Player ${nextIndex}` }];
    });
  };

  const removePlayer = () => {
    setPlayers((prev) => (prev.length > 3 ? prev.slice(0, -1) : prev));
  };

  const startGame = () => {
    const filteredPairs =
      selectedCategories.length > 0
        ? questionPairs.filter((pair) => selectedCategories.includes(pair.category))
        : questionPairs;
    const pool = filteredPairs.length > 0 ? filteredPairs : questionPairs;
    const { pair, nextRecent } = pickQuestionPair(pool, recentQuestionIds);
    setRecentQuestionIds(nextRecent);
    setRound(createRound(players, imposterCount, pair));
  };

  const resetToSettings = () => {
    setRound(null);
  };

  const submitAnswer = (playerId: string, answer: string) => {
    setRound((prev) => {
      if (!prev) return prev;
      const completed = prev.completedPlayerIds.includes(playerId)
        ? prev.completedPlayerIds
        : [...prev.completedPlayerIds, playerId];
      return {
        ...prev,
        answers: { ...prev.answers, [playerId]: answer },
        completedPlayerIds: completed,
      };
    });
  };

  const startVoting = () => {
    setRound((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        votingOrder: players.map((player) => player.id),
        currentVoterId: players[0]?.id,
      };
    });
  };

  const setCurrentVoter = (playerId?: string) => {
    setRound((prev) => (prev ? { ...prev, currentVoterId: playerId } : prev));
  };

  const submitVote = (voterId: string, votedId: string) => {
    setRound((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        votes: { ...prev.votes, [voterId]: votedId },
      };
    });
  };

  const playAgain = () => {
    const filteredPairs =
      selectedCategories.length > 0
        ? questionPairs.filter((pair) => selectedCategories.includes(pair.category))
        : questionPairs;
    const pool = filteredPairs.length > 0 ? filteredPairs : questionPairs;
    const { pair, nextRecent } = pickQuestionPair(pool, recentQuestionIds);
    setRecentQuestionIds(nextRecent);
    setRound(createRound(players, imposterCount, pair));
  };

  const getQuestionForPlayer = (playerId: string) => {
    if (!round) return '';
    return getAssignedQuestion(round, playerId);
  };

  const value = useMemo(
    () => ({
      players,
      imposterCount,
      showCategory,
      selectedCategories,
      round,
      recentQuestionIds,
      setImposterCount,
      setShowCategory,
      setSelectedCategories,
      updatePlayerName,
      addPlayer,
      removePlayer,
      startGame,
      resetToSettings,
      submitAnswer,
      startVoting,
      setCurrentVoter,
      submitVote,
      playAgain,
      getQuestionForPlayer,
    }),
    [
      players,
      imposterCount,
      showCategory,
      selectedCategories,
      round,
      recentQuestionIds,
      setImposterCount,
      setShowCategory,
      setSelectedCategories,
    ]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};
