import { create } from "zustand";
import {
  User,
  Player,
  Sentence,
  GameBase,
} from "../../../shared/types/gameTypes";

interface AppState {
  game: GameBase;
  user: User;
  connectionStatus: boolean;
  setUserName: (name: string) => void;
  setUser: (user: User) => void;
  setGame: (game: GameBase) => void;
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  setPlayerScore: (playerName: string, score: number) => void;
  addSentence: (sentence: Sentence) => void;
  setCurrentPlayerName: (playerName: string) => void;
  setGameIsActive: (isActive: boolean) => void;
  setGameCode: (gameCode: string) => void;
  resetGame: () => void;
  setConnectionStatus: (status: boolean) => void;
}

const initialGameState: GameBase = {
  code: "",
  topic: "",
  players: [],
  currentTurnIndex: 0,
  isActive: false,
  currentPlayerName: "",
  lyrics: [],
  winnerPlayerName: "",
  gameCreatorName: "",
  songId: "",
  timerInMinutes: 0,
};

const useAppStore = create<AppState>((set) => ({
  connectionStatus: false,
  game: { ...initialGameState },
  user: {
    username: "",
    score: 0,
    email: "",
    password: "",
    id: "",
    songs: [],
  },
  setUserName: (username) => {
    console.log("Setting username to: ", username);
    set((state) => ({ user: { ...state.user, username } }));
  },
  setUser: (user: User) => set(() => ({ user })),
  addPlayer: (player: Player) =>
    set((state) => ({
      game: { ...state.game, players: [...state.game.players, player] },
    })),
  removePlayer: (playerName: string) =>
    set((state) => ({
      game: {
        ...state.game,
        players: state.game.players.filter((p) => p.name !== playerName),
      },
    })),
  addSentence: (sentence: Sentence) =>
    set((state) => ({
      game: { ...state.game, lyrics: [...state.game.lyrics, sentence] },
    })),
  setCurrentPlayerName: (playerName: string) =>
    set((state) => ({
      game: { ...state.game, currentPlayerName: playerName },
    })),

  setGameIsActive: (isActive) =>
    set((state) => ({
      game: { ...state.game, isActive },
    })),
  setPlayerScore: (playerName: string, score: number) =>
    set((state) => ({
      game: {
        ...state.game,
        players: state.game.players.map((player: Player) =>
          player.name === playerName ? { ...player, score } : player
        ),
      },
    })),
  setGame: (game: GameBase) => set(() => ({ game })),
  setGameCode: (gameCode: string) =>
    set((state) => ({ game: { ...state.game, code: gameCode } })),
  resetGame: () =>
    set({
      game: { ...initialGameState },
    }),
  setConnectionStatus: (status: boolean) =>
    set(() => ({ connectionStatus: status })),
}));

export default useAppStore;
