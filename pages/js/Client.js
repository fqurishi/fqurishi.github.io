import 'https://cdn.jsdelivr.net/npm/socket.io-client@3.1.0/dist/socket.io.js';

const socket = io("http://52.8.58.114:3000", {
  reconnection: false,
  transports: ['websocket'],
});

socket.on("connect", () => {
  console.log("connecting");
  socket.emit('connection');
});
