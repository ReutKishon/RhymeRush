import { create } from "zustand";

interface UserState {
  gameCode: string;
  userId: string;
  username: string;
  setGameCode: (gameCode: string) => void;
  setUserId: (id: string) => void;
  setUsername: (username: string) => void;
}

const useUserStore = create<UserState>((set) => ({
  gameCode:"",
  userId: "",
  username: "",
  setGameCode: (gameCode:string) =>set(()=>({gameCode})),
  setUserId: (id: string) => set(() => ({ userId: id })),
  setUsername: (username: string) => set(() => ({ username })),
}));

export default useUserStore;
