import { create } from 'zustand';

export type Player = {
  socketId: string;
  name: string;
};

interface GameState {
  isConnected: boolean;
  isHost: boolean;
  playerName: string;
  roomCode: string | null;
  players: Player[];
  status: 'idle' | 'lobby' | 'active';
  isImposter: boolean;
  assignedWord: string | null;
  
  setConnected: (status: boolean) => void;
  setHost: (isHost: boolean) => void;
  setPlayerName: (name: string) => void;
  setRoom: (code: string | null, players: Player[], status: 'idle' | 'lobby' | 'active') => void;
  setRole: (isImposter: boolean, word: string | null) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  isConnected: false,
  isHost: false,
  playerName: '',
  roomCode: null,
  players: [],
  status: 'idle',
  isImposter: false,
  assignedWord: null,

  setConnected: (status) => set({ isConnected: status }),
  setHost: (isHost) => set({ isHost }),
  setPlayerName: (name) => set({ playerName: name }),
  setRoom: (roomCode, players, status) => set({ roomCode, players, status }),
  setRole: (isImposter, assignedWord) => set({ isImposter, assignedWord }),
  resetGame: () => set({ 
    roomCode: null, 
    players: [], 
    isHost: false, 
    status: 'idle', 
    isImposter: false, 
    assignedWord: null 
  }),
}));
