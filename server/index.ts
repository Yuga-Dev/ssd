import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import { checkAndRefillWords } from './src/services/wordEngine';

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

import { createRoom, joinRoom, startGame, leaveRoom, getRoom } from './src/gameEngine';

io.on('connection', (socket: Socket) => {
  console.log('A user connected:', socket.id);

  socket.on('create_room', () => {
    const room = createRoom(socket.id);
    socket.join(room.code);
    socket.emit('room_created', { code: room.code });
  });

  socket.on('join_room', ({ code, name }) => {
    const roomResult = joinRoom(code, socket.id, name);
    if ('error' in roomResult) {
      socket.emit('error', { message: roomResult.error });
      return;
    }
    
    socket.join(roomResult.code);
    const safeRoom = { ...roomResult, roles: undefined };
    io.to(roomResult.code).emit('room_state_update', safeRoom);
  });

  socket.on('start_game', async ({ code }) => {
    const roomResult = await startGame(code, socket.id);
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

  import { endGame } from './src/gameEngine';
  socket.on('end_game', ({ code }) => {
     const roomResult = endGame(code, socket.id);
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

  socket.on('disconnect', () => {
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
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.IO Server listening on port ${PORT}`);
  
  // Check and refill words immediately on startup
  checkAndRefillWords();

  // Schedule to run every 5 minutes (300000 ms)
  setInterval(() => {
    checkAndRefillWords();
  }, 300000);
});
