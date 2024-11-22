import { create } from "zustand";

interface UserState {
  userId: string;
  username: string;
  setUserId: (id: string) => void;
  setUsername: (username: string) => void;
}

const useUserStore = create<UserState>((set) => ({
  userId: "",
  username: "",
  setUserId: (id: string) => set(() => ({ userId: id })),
  setUsername: (username: string) => set(() => ({ username })),
}));

export default useUserStore;
