import { create } from 'zustand';

export type Player = {
  id: string;
  name: string;
  isHost?: boolean;
};

interface GameState {
  players: Player[];
  roomId: string | null;
  isImposter: boolean;
  assignedWord: string | null;
  
  setPlayers: (players: Player[]) => void;
  setRoomId: (id: string) => void;
  setRole: (isImposter: boolean, word: string) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  players: [],
  roomId: null,
  isImposter: false,
  assignedWord: null,

  setPlayers: (players) => set({ players }),
  setRoomId: (id) => set({ roomId: id }),
  setRole: (isImposter, word) => set({ isImposter, assignedWord: word }),
  resetGame: () => set({ players: [], roomId: null, isImposter: false, assignedWord: null }),
}));
