import { create } from "zustand";
import { Player, Sentence } from "../../../shared/types/gameTypes";

type GameState = {
  // user: User;

  gameCode: string | null;
  gameCreatorId: string | null;
  currentTurn: Player | null;
  winner: Player | null;
  players: Player[];
  lyrics: Sentence[];
  isGameEnd: boolean;
  isGameStarted: boolean;
  setGameCode: (code: string) => void;
  setGameCreatorId: (id: string) => void;
  setCurrentTurn: (turn: Player) => void;
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  setPlayers: (players: Player[]) => void;
  setWinner: (winner: Player) => void;
  addLyric: (sentence: Sentence) => void;
  setGameEnd: (end: boolean) => void;
  setGameStarted: (started: boolean) => void;
};

const useStore = create<GameState>((set) => ({
  gameCode: null,
  gameCreatorId: null,
  currentTurn: null,
  players: [],
  lyrics: [],
  isGameEnd: false,
  winner: null,
  isGameStarted: false,

  setGameCode: (code) => set({ gameCode: code }),
  setGameCreatorId: (id) => set({ gameCreatorId: id }),
  setCurrentTurn: (player) => set({ currentTurn: player }),
  setWinner: (winner) => set({ winner: winner }),
  setPlayers: (players) => set({ players: players }),
  addPlayer: (player) =>
    set((state) => ({ players: [...state.players, player] })),
  removePlayer: (playerId) =>
    set((state) => ({
      players: state.players.filter((player) => player.id !== playerId),
    })),
  addLyric: (sentence) =>
    set((state) => ({ lyrics: [...state.lyrics, sentence] })),
  setGameEnd: (end) => set({ isGameEnd: end }),
  setGameStarted: (started) => set({ isGameStarted: started }),
}));

export default useStore;
