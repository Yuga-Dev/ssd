import { io } from 'socket.io-client';

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const serverAddress = isLocalhost ? 'localhost' : window.location.hostname;
const URL = import.meta.env.VITE_SOCKET_URL || `http://${serverAddress}:3001`;

export const socket = io(URL, {
  autoConnect: true
});
