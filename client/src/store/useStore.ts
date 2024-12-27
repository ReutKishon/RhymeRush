import { create } from "zustand";
import {
  User,
  GameBase as Game,
  Player,
  Sentence,
} from "../../../shared/types/gameTypes";

interface AppState {
  game: Game;
  currentLoserName: string;
  losingReason: string;
  gameCode: string;
  user: User;
  userName: string;
  timer: number;
  setUserName: (userName: string) => void;
  setUser: (user: User) => void;
  setGame: (game: Game) => void;
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  setPlayerAsLoser: (playerName: string, rank: number, reason: string) => void;
  addSentence: (sentence: Sentence) => void;
  setCurrentPlayerName: (playerName: string) => void;
  setWinnerPlayerName: (playerName: string) => void;
  setIsActive: (isActive: boolean) => void;
  setGameCode: (gameCode: string) => void;
  setTimer: (timer: number) => void;
  reset: () => void;
}

const initialGameState: Game = {
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
};

const useAppStore = create<AppState>((set) => ({
  userName: "",
  gameCode: "",
  game: { ...initialGameState },
  user: {
    username: "",
    score: 0,
    email: "",
    password: "",
    id: "",
    songs: [],
  },
  timer: 30,
  currentLoserName: "",
  losingReason: "",
  setUserName: (userName: string) => set(() => ({ userName })),
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
  setWinnerPlayerName: (playerId) =>
    set((state) => ({
      game: { ...state.game, winnerPlayerName: playerId },
    })),
  setIsActive: (isActive) =>
    set((state) => ({
      game: { ...state.game, isActive },
    })),
  setPlayerAsLoser: (playerName: string, rank: number, reason: string) =>
    set((state) => ({
      game: {
        ...state.game,
        players: state.game.players.map((player) =>
          player.name === playerName
            ? { ...player, rank, active: false }
            : player
        ),
      },
      currentLoserName: playerName,
      losingReason: reason,
    })),
  setGame: (game: Game) => set(() => ({ game })),
  setGameCode: (gameCode: string) => set(() => ({ gameCode })),
  setTimer: (timer: number) => set(() => ({ timer })),

  reset: () =>
    set({
      gameCode: "",
      game: { ...initialGameState },
      timer: 30,
      currentLoserName: "",
      losingReason: "",
    }),
}));

export default useAppStore;
