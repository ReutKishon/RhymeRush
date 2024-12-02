import { create } from "zustand";

interface UserState {
  gameCode: string;
  userId: string;
  username: string;
  isEliminated: boolean;
  eliminationReason: string;
  setGameCode: (gameCode: string) => void;
  setUserId: (id: string) => void;
  setUsername: (username: string) => void;
  setIsEliminated: (eliminated: boolean) => void;
  setEliminationReason: (reason: string) => void;
}

const useUserStore = create<UserState>((set) => ({
  gameCode: "",
  userId: "",
  username: "",
  isEliminated: false,
  eliminationReason: "",
  setGameCode: (gameCode: string) => set(() => ({ gameCode })),
  setUserId: (id: string) => set(() => ({ userId: id })),
  setUsername: (username: string) => set(() => ({ username })),
  setIsEliminated: (eliminated: boolean) =>
    set(() => ({ isEliminated: eliminated })),
  setEliminationReason: (reason: string) =>
    set(() => ({ eliminationReason: reason })),
}));

export default useUserStore;
