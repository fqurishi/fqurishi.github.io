import 'https://cdn.jsdelivr.net/npm/socket.io-client@3.1.0/dist/socket.io.js';

const socket = io("https://52.8.58.114:3000", {
  reconnection: false,
  transports: ['websocket'],
});

let messages = document.getElementById('messages');
let form = document.getElementById('form');
let input = document.getElementById('input');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', input.value);
    input.value = '';
  }
});

socket.on('chat message', function(msg) {
  let item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on("connect", () => {
  console.log("connecting");
  socket.emit('connection');
});
