import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_SOCKET_URL || (window.location.protocol === 'https:' ? `https://${window.location.hostname}` : `http://${window.location.hostname}:3001`);
console.log(URL)
export const socket = io(URL, {

  autoConnect: true
});
