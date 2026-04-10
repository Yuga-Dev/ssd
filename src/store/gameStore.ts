import { create } from 'zustand';

export type Player = {
  socketId: string;
  name: string;
};

interface RevealState {
  imposterId: string;
  realWord: string;
  imposterWord: string;
}

interface GameState {
  isConnected: boolean;
  isHost: boolean;
  playerName: string;
  roomCode: string | null;
  players: Player[];
  status: 'idle' | 'lobby' | 'active' | 'reveal';
  isImposter: boolean;
  assignedWord: string | null;
  endTime: number | null;
  revealState: RevealState | null;
  
  setConnected: (status: boolean) => void;
  setHost: (isHost: boolean) => void;
  setPlayerName: (name: string) => void;
  setRoom: (code: string | null, players: Player[], status: 'idle' | 'lobby' | 'active' | 'reveal') => void;
  setRole: (isImposter: boolean, word: string | null, endTime: number | null) => void;
  setReveal: (revealState: RevealState) => void;
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
  endTime: null,
  revealState: null,

  setConnected: (status) => set({ isConnected: status }),
  setHost: (isHost) => set({ isHost }),
  setPlayerName: (name) => set({ playerName: name }),
  setRoom: (roomCode, players, status) => set({ roomCode, players, status }),
  setRole: (isImposter, assignedWord, endTime) => set({ isImposter, assignedWord, endTime }),
  setReveal: (revealState) => set({ revealState, status: 'reveal' }),
  resetGame: () => set({ 
    roomCode: null, 
    players: [], 
    isHost: false, 
    status: 'idle', 
    isImposter: false, 
    assignedWord: null,
    endTime: null,
    revealState: null
  }),
}));
