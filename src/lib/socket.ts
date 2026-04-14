import { io } from 'socket.io-client';

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.startsWith('192.168.');
const URL = import.meta.env.VITE_SOCKET_URL || (window.location.protocol === 'https:' ? `https://${window.location.hostname}` : `http://${window.location.hostname}:3001`);

export const socket = io(URL, {
  autoConnect: true
});
