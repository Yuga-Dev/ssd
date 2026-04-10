import { databases, DATABASE_ID, WORDS_COLLECTION_ID, Query } from './appwrite';

interface Player {
  socketId: string;
  name: string;
}

export interface WordPair {
  realWord: string;
  imposterWord: string;
}

export interface GameRoom {
  code: string;
  hostId: string;
  status: 'lobby' | 'active' | 'reveal';
  players: Player[];
  roles: Record<string, 'Imposter' | 'Crewmate'>;
  wordPair?: WordPair;
  endTime?: number;
}

const activeRooms: Map<string, GameRoom> = new Map();

function generateCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function createRoom(hostId: string): GameRoom {
  let code = generateCode();
  while (activeRooms.has(code)) {
    code = generateCode();
  }

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
  return activeRooms.get(code.toUpperCase());
}

export function joinRoom(code: string, socketId: string, name: string): GameRoom | { error: string } {
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
  if (room.players.find(p => p.socketId === socketId)) {
    return { error: 'Already joined' };
  }

  room.players.push({ socketId, name });
  return room;
}

export async function startGame(code: string, hostId: string, durationMinutes: number = 5): Promise<GameRoom | { error: string }> {
  const room = getRoom(code);
  if (!room) return { error: 'Room not found' };
  if (room.hostId !== hostId) return { error: 'Only the host can start the game' };
  if (room.players.length < 3) return { error: 'Minimum 3 players required' };
  if (room.players.length > 12) return { error: 'Maximum 12 players allowed' };

  try {
    const docsInfo = await databases.listDocuments(
      DATABASE_ID,
      WORDS_COLLECTION_ID,
      [
        Query.equal('used', false),
        Query.limit(1)
      ]
    );

    if (docsInfo.documents.length === 0) {
      return { error: 'No words available in the database. Please try again soon.' };
    }

    const doc = docsInfo.documents[0];
    await databases.updateDocument(DATABASE_ID, WORDS_COLLECTION_ID, doc.$id, { used: true });

    room.wordPair = {
      realWord: doc.realWord,
      imposterWord: doc.imposterWord
    };
  } catch (error) {
    console.error('Failed to fetch words from Appwrite:', error);
    return { error: 'Database error fetching words' };
  }

  const imposterIndex = Math.floor(Math.random() * room.players.length);
  const imposterId = room.players[imposterIndex].socketId;

  room.players.forEach(p => {
    room.roles[p.socketId] = p.socketId === imposterId ? 'Imposter' : 'Crewmate';
  });

  room.status = 'active';
  room.endTime = Date.now() + durationMinutes * 60 * 1000;
  return room;
}

export function endGame(code: string, hostId: string): GameRoom | { error: string } {
  const room = getRoom(code);
  if (!room) return { error: 'Room not found' };
  if (room.hostId !== hostId) return { error: 'Unauthorized' };

  room.status = 'reveal';
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
