import { create } from "zustand";
import { Player } from "../../shared/types/gameTypes";

interface UserState {
  user: Player;
  setUser: (user: Player) => void;
}
const defaultPlayer: Player = {
  id: "",
};
const useUserStore = create<UserState>((set) => ({
  user: defaultPlayer,
  setUser: (user: Player) => set({ user: user }),
}));

export default useUserStore;
