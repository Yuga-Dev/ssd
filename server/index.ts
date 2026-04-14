import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import { checkAndRefillWords } from './src/services/wordEngine';
import { connectDatabase } from './src/database';
import { Player } from './src/models/Player';

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

import { createRoom, joinRoom, startGame, leaveRoom, getRoom, endGame } from './src/gameEngine';

io.on('connection', (socket: Socket) => {
  console.log('A user connected:', socket.id);

  socket.on('register_device', async ({ displayName, deviceId }) => {
    try {
      let player = await Player.findOne({ deviceId });
      if (!player) {
         player = new Player({ displayName, deviceId, isOnline: true });
      } else {
         player.displayName = displayName;
         player.isOnline = true;
      }
      await player.save();
      
      (socket as any).deviceId = deviceId;
      (socket as any).playerId = player._id.toString();
      (socket as any).displayName = displayName;
      
      socket.emit('device_registered', { playerId: player._id.toString(), displayName });
      
      // broadcast update for hosts listening to active players
      const players = await Player.find({ isOnline: true });
      io.emit('active_players_list', players);
    } catch (err) {
      console.error(err);
      socket.emit('error', { message: 'Failed to register device' });
    }
  });

  socket.on('get_active_players', async () => {
     try {
       const players = await Player.find({ isOnline: true });
       socket.emit('active_players_list', players);
     } catch (err) {}
  });

  socket.on('create_room', async ({ playerIds }: { playerIds: string[] }) => {
    const room = await createRoom((socket as any).playerId || socket.id);
    socket.join(room.code);
    socket.emit('room_created', { code: room.code });
    
    // Broadcast to targeted players
    if (playerIds && playerIds.length > 0) {
      io.emit('route_players_to_room', { code: room.code, targetPlayerIds: playerIds });
    }
  });

  socket.on('join_room', ({ code, name, playerId }) => {
    const roomResult = joinRoom(code, socket.id, name, playerId);
    if ('error' in roomResult) {
      socket.emit('error', { message: roomResult.error });
      return;
    }
    
    socket.join(roomResult.code);
    const safeRoom = { ...roomResult, roles: undefined };
    io.to(roomResult.code).emit('room_state_update', safeRoom);
  });

  socket.on('start_game', async ({ code, duration }) => {
    const hostId = (socket as any).playerId || socket.id;
    const roomResult = await startGame(code, hostId, duration);
    if ('error' in roomResult) {
      socket.emit('error', { message: roomResult.error });
      return;
    }

    // Broadcast that game is starting (do NOT send role map or word Pair)
    const safeRoom = { ...roomResult, roles: undefined, wordPair: undefined };
    io.to(roomResult.code).emit('game_started', safeRoom);
    io.to(roomResult.code).emit('room_state_update', safeRoom);

    // Notify each player securely of their individual role and intended word
    roomResult.players.forEach(p => {
      const isImposter = roomResult.roles[p.socketId] === 'Imposter';
      const assignedWord = isImposter ? roomResult.wordPair?.imposterWord : roomResult.wordPair?.realWord;
      
      io.to(p.socketId).emit('role_assigned', { 
        role: roomResult.roles[p.socketId],
        word: assignedWord,
        endTime: roomResult.endTime
      });
    });
  });

  socket.on('end_game', ({ code }) => {
     const hostId = (socket as any).playerId || socket.id;
     const roomResult = endGame(code, hostId);
     if ('error' in roomResult) {
        socket.emit('error', { message: roomResult.error });
        return;
     }

     // Emit public revelation
     io.to(code).emit('game_ended', {
        imposterId: Object.keys(roomResult.roles).find(key => roomResult.roles[key] === 'Imposter'),
        realWord: roomResult.wordPair?.realWord,
        imposterWord: roomResult.wordPair?.imposterWord,
     });
     
     const safeRoom = { ...roomResult, roles: undefined, wordPair: undefined };
     io.to(code).emit('room_state_update', safeRoom);
  });

  socket.on('disconnect', async () => {
    console.log('User disconnected:', socket.id);
    const affectedCodes = leaveRoom(socket.id);
    affectedCodes.forEach(code => {
      const room = getRoom(code);
      if (room) {
        const safeRoom = { ...room, roles: undefined };
        io.to(code).emit('room_state_update', safeRoom);
      } else {
        io.to(code).emit('room_closed');
      }
    });
    
    // Update MongoDB
    const deviceId = (socket as any).deviceId;
    if (deviceId) {
       await Player.findOneAndUpdate({ deviceId }, { isOnline: false });
       const players = await Player.find({ isOnline: true });
       io.emit('active_players_list', players);
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, async () => {
  console.log(`Socket.IO Server listening on port ${PORT}`);
  
  await connectDatabase();
  
  // Check and refill words immediately on startup
  checkAndRefillWords();

  // Schedule to run every 5 minutes (300000 ms)
  setInterval(() => {
    checkAndRefillWords();
  }, 300000);
});
