const socket = require('socket.io');
const express = require('express');
const app = express();
const server = app.listen(3000);
const io = socket(server);
app.use(express.static('public'));

io.sockets.on('connection', (socket) => console.log('new connection: ' + socket.id));

// app.get('/', (request, response) => response.send('Hello World!'))