import { WordPair } from './models/WordPair';
import { Session } from './models/Session';

interface Player {
  socketId: string;
  name: string;
  playerId?: string;
}

export interface GameWordPair {
  realWord: string;
  imposterWord: string;
}

export interface GameRoom {
  code: string;
  hostId: string;
  status: 'lobby' | 'active' | 'reveal';
  players: Player[];
  roles: Record<string, 'Imposter' | 'Crewmate'>;
  wordPair?: GameWordPair;
  endTime?: number;
}

const activeRooms: Map<string, GameRoom> = new Map();

export async function createRoom(hostId: string): Promise<GameRoom> {
  const newSessionDb = new Session({
     hostId,
     players: [],
     status: 'lobby'
  });
  await newSessionDb.save();
  const code = newSessionDb._id.toString();

  const newRoom: GameRoom = {
    code,
    hostId,
    status: 'lobby',
    players: [],
    roles: {}
  };

  activeRooms.set(code, newRoom);
  return newRoom;
}

export function getRoom(code: string): GameRoom | undefined {
  return activeRooms.get(code);
}

export function joinRoom(code: string, socketId: string, name: string, playerId?: string): GameRoom | { error: string } {
  const room = getRoom(code);
  if (!room) {
    return { error: 'Room not found' };
  }
  if (room.status !== 'lobby') {
    return { error: 'Game already in progress' };
  }
  if (room.players.length >= 12) {
    return { error: 'Room is full' };
  }
  if (room.players.find(p => p.socketId === socketId || (playerId && p.playerId === playerId))) {
    return { error: 'Already joined' };
  }

  room.players.push({ socketId, name, playerId });
  return room;
}

export async function startGame(code: string, hostId: string, durationMinutes: number = 5): Promise<GameRoom | { error: string }> {
  const room = getRoom(code);
  if (!room) return { error: 'Room not found' };
  if (room.hostId !== hostId) return { error: 'Only the host can start the game' };
  if (room.players.length < 3) return { error: 'Minimum 3 players required' };
  if (room.players.length > 12) return { error: 'Maximum 12 players allowed' };

  try {
    const doc = await WordPair.findOneAndUpdate(
      { used: false },
      { used: true },
      { new: true }
    );

    if (!doc) {
      return { error: 'No words available in the database. Please try again soon.' };
    }

    room.wordPair = {
      realWord: doc.realWord,
      imposterWord: doc.imposterWord
    };
  } catch (error) {
    console.error('Failed to fetch words from MongoDB:', error);
    return { error: 'Database error fetching words' };
  }

  const imposterIndex = Math.floor(Math.random() * room.players.length);
  const imposterId = room.players[imposterIndex].socketId;

  room.players.forEach(p => {
    room.roles[p.socketId] = p.socketId === imposterId ? 'Imposter' : 'Crewmate';
  });

  room.status = 'active';
  room.endTime = Date.now() + durationMinutes * 60 * 1000;
  
  // Async update MongoDB
  Session.findByIdAndUpdate(code, {
    status: 'active',
    players: room.players.map(p => p.playerId).filter(Boolean) as string[],
  }).catch(err => console.error('[gameEngine] Failed to sync Session Start:', err));
  
  return room;
}

export function endGame(code: string, hostId: string): GameRoom | { error: string } {
  const room = getRoom(code);
  if (!room) return { error: 'Room not found' };
  if (room.hostId !== hostId) return { error: 'Unauthorized' };

  room.status = 'reveal';
  
  Session.findByIdAndUpdate(code, {
     status: 'reveal'
  }).catch(err => console.error('[gameEngine] Failed to sync Session End:', err));
  
  return room;
}

export function leaveRoom(socketId: string): string[] {
  const affectedRooms: string[] = [];
  for (const [code, room] of activeRooms.entries()) {
    if (room.hostId === socketId) {
      activeRooms.delete(code);
      affectedRooms.push(code);
      continue;
    }
    const idx = room.players.findIndex(p => p.socketId === socketId);
    if (idx !== -1) {
      room.players.splice(idx, 1);
      affectedRooms.push(code);
    }
  }
  return affectedRooms;
}
