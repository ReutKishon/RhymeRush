import { create } from "zustand";
import { Game, User } from "../../../shared/types/gameTypes";

interface AppState {
  game: Game;
  user: User;
  isEliminated: boolean;
  eliminationReason: string;
  timer: number;
  setIsEliminated: (eliminated: boolean) => void;
  setEliminationReason: (reason: string) => void;
  setUser: (user: User) => void;
  setGame: (game: Game) => void;
  setTimer: (timer: number) => void;
}

const useAppStore = create<AppState>((set) => ({
  game: {
    code: "",
    topic: "",
    players: [],
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
  isEliminated: false,
  eliminationReason: "",
  setIsEliminated: (eliminated: boolean) =>
    set(() => ({ isEliminated: eliminated })),
  setEliminationReason: (reason: string) =>
    set(() => ({ eliminationReason: reason })),
  setUser: (user: User) => set(() => ({ user })),
  setGame: (game: Game) => set(() => ({ game })),
  setTimer: (timer: number) => set(() => ({ timer })),
}));

export default useAppStore;
