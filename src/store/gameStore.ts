import { create } from 'zustand';

export type Player = {
  socketId: string;
  name: string;
  playerId?: string;
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
  playerId: string | null;
  deviceId: string | null;
  
  roomCode: string | null;
  players: Player[];
  activePlayers: { _id: string; displayName: string; isOnline: boolean }[];
  
  status: 'idle' | 'lobby' | 'active' | 'reveal';
  isImposter: boolean;
  assignedWord: string | null;
  endTime: number | null;
  revealState: RevealState | null;
  
  setConnected: (status: boolean) => void;
  setHost: (isHost: boolean) => void;
  setIdentity: (playerId: string, deviceId: string, name: string) => void;
  setActivePlayers: (players: any[]) => void;
  setRoom: (code: string | null, players: Player[], status: 'idle' | 'lobby' | 'active' | 'reveal') => void;
  setRole: (isImposter: boolean, word: string | null, endTime: number | null) => void;
  setReveal: (revealState: RevealState) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  isConnected: false,
  isHost: false,
  playerName: '',
  playerId: null,
  deviceId: null,
  roomCode: null,
  players: [],
  activePlayers: [],
  status: 'idle',
  isImposter: false,
  assignedWord: null,
  endTime: null,
  revealState: null,

  setConnected: (status) => set({ isConnected: status }),
  setHost: (isHost) => set({ isHost }),
  setIdentity: (playerId, deviceId, name) => set({ playerId, deviceId, playerName: name }),
  setActivePlayers: (players) => set({ activePlayers: players }),
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
