import { create } from "zustand";
import { User, GameBase as Game } from "../../../shared/types/gameTypes";

interface AppState {
  game: Game;
  user: User;
  timer: number;
  setUser: (user: User) => void;
  setGame: (game: Game) => void;
  setTimer: (timer: number) => void;
}

const useAppStore = create<AppState>((set) => ({
  game: {
    code: "",
    topic: "",
    players: {},
    turnOrder: [],
    currentTurnIndex: 0,
    isActive: false,
    currentPlayerId: "",
    lyrics: [],
    winnerPlayerId: "",
    gameCreatorId: "",
  },
  user: {
    username: "",
    score: 0,
    email: "",
    password: "",
    id: "",
  },
  timer: 30,
  setUser: (user: User) => set(() => ({ user })),
  setGame: (game: Game) => set(() => ({ game })),
  setTimer: (timer: number) => set(() => ({ timer })),
}));

export default useAppStore;
