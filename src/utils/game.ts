import { QuestionPair } from '../data/questions';

export interface Player {
  id: string;
  name: string;
}

export interface RoundState {
  questionPair: QuestionPair;
  imposterIds: string[];
  answers: Record<string, string>;
  votes: Record<string, string>;
  completedPlayerIds: string[];
  votingOrder: string[];
  currentVoterId?: string;
}

export const generateId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const shuffle = <T,>(items: T[]) => {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const pickQuestionPair = (
  pairs: QuestionPair[],
  recentIds: string[],
  maxRecent = 8
) => {
  const available = pairs.filter((pair) => !recentIds.includes(pair.id));
  const pool = available.length > 0 ? available : pairs;
  const pair = pool[Math.floor(Math.random() * pool.length)];
  const nextRecent = [pair.id, ...recentIds].slice(0, maxRecent);
  return { pair, nextRecent };
};

export const chooseImposters = (players: Player[], count: number) => {
  const ids = shuffle(players.map((player) => player.id));
  return ids.slice(0, count);
};

export const createRound = (
  players: Player[],
  imposterCount: number,
  questionPair: QuestionPair
): RoundState => {
  return {
    questionPair,
    imposterIds: chooseImposters(players, imposterCount),
    answers: {},
    votes: {},
    completedPlayerIds: [],
    votingOrder: [],
  };
};

export const getAssignedQuestion = (round: RoundState, playerId: string) => {
  const isImposter = round.imposterIds.includes(playerId);
  return isImposter ? round.questionPair.alt : round.questionPair.main;
};

export const tallyVotes = (players: Player[], votes: Record<string, string>) => {
  const counts: Record<string, number> = {};
  players.forEach((player) => {
    counts[player.id] = 0;
  });
  Object.values(votes).forEach((votedId) => {
    if (counts[votedId] !== undefined) {
      counts[votedId] += 1;
    }
  });
  const maxVotes = Math.max(...Object.values(counts));
  const topIds = Object.keys(counts).filter((id) => counts[id] === maxVotes);
  return { counts, maxVotes, topIds };
};
