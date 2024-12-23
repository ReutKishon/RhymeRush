import { create } from "zustand";
import {
  User,
  GameBase as Game,
  Player,
  Sentence,
} from "../../../shared/types/gameTypes";

interface AppState {
  game: Game;
  gameCode: string;
  user: User;
  timer: number;
  setUser: (user: User) => void;
  setGame: (game: Game) => void;
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  setPlayerAsLoser: (playerId: string, rank: number) => void;
  addSentence: (sentence: Sentence) => void;
  setCurrentPlayerId: (playerId: string) => void;
  setWinnerPlayerId: (playerId: string) => void;
  setIsActive: (isActive: boolean) => void;
  setGameCode: (gameCode: string) => void;
  setTimer: (timer: number) => void;
}

const useAppStore = create<AppState>((set) => ({
  gameCode: "",
  game: {
    code: "",
    topic: "",
    players: [],
    turnOrder: [],
    currentTurnIndex: 0,
    isActive: false,
    currentPlayerId: "",
    lyrics: [],
    winnerPlayerId: "",
    gameCreatorId: "",
    songId: "",
  },
  user: {
    username: "",
    score: 0,
    email: "",
    password: "",
    id: "",
    songs: [],
  },
  timer: 30,
  setUser: (user: User) => set(() => ({ user })),
  addPlayer: (player: Player) =>
    set((state) => ({
      game: { ...state.game, players: [...state.game.players, player] },
    })),
  removePlayer: (playerId: string) =>
    set((state) => ({
      game: {
        ...state.game,
        players: state.game.players.filter((p) => p.id !== playerId),
      },
    })),
  addSentence: (sentence: Sentence) =>
    set((state) => ({
      game: { ...state.game, lyrics: [...state.game.lyrics, sentence] },
    })),
  setCurrentPlayerId: (playerId: string) =>
    set((state) => ({ game: { ...state.game, currentPlayerId: playerId } })),
  setWinnerPlayerId: (playerId) =>
    set((state) => ({
      game: { ...state.game, winnerPlayerId: playerId },
    })),
  setIsActive: (isActive) =>
    set((state) => ({
      game: { ...state.game, isActive },
    })),
  setPlayerAsLoser: (playerId: string, rank: number) =>
    set((state) => ({
      game: {
        ...state.game,
        isActive: false,
        players: state.game.players.map((player) =>
          player.id === playerId ? { ...player, rank } : player
        ),
      },
    })),
  setGame: (game: Game) => set(() => ({ game })),
  setGameCode: (gameCode: string) => set(() => ({ gameCode })),
  setTimer: (timer: number) => set(() => ({ timer })),
}));

export default useAppStore;
