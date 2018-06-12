const socket = require('socket.io');
const express = require('express');
const app = express();
const server = app.listen(3000);
const io = socket(server);
app.use(express.static('public'));

let connections = 0;
let roomID = 0;

io.sockets.on('connection', (socket) => {
	console.log('new connection: ' + socket.id);
	connections++;
	roomID = Math.ceil(connections/2);
	socket.emit('room', {id: roomID});
});

// app.get('/', (request, response) => response.send('Hello World!'))