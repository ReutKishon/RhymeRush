import { create } from "zustand";

interface UserState {
  gameCode: string;
  userId: string;
  username: string;
  userTurnExpired: boolean;
  setGameCode: (gameCode: string) => void;
  setUserId: (id: string) => void;
  setUsername: (username: string) => void;
  setUserTurnExpired: (turnExpired: boolean) => void;
}

const useUserStore = create<UserState>((set) => ({
  gameCode: "",
  userId: "",
  username: "",
  userTurnExpired: false,
  setGameCode: (gameCode: string) => set(() => ({ gameCode })),
  setUserId: (id: string) => set(() => ({ userId: id })),
  setUsername: (username: string) => set(() => ({ username })),
  setUserTurnExpired: (turnExpired: boolean) =>
    set(() => ({ userTurnExpired: turnExpired })),
}));

export default useUserStore;
