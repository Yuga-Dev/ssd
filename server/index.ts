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

io.on('connection', (socket: Socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
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
