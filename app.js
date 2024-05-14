const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const port = 3000;

const MessageModel = require('./models/messageModel');

const connectionMongoDB = require('./connectionMongoDB');
connectionMongoDB();

app.use(express.static('public'));

app.get('/messages', async (req, res) => {
  try {
    const allMessages = await MessageModel.find();
    return res.status(200).json(allMessages);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});

io.on('connection', (socket) => {
  console.log(`A client with id ${socket.id} connected to the chat!`);

  socket.on('chatMessage', (msg) => {
    io.emit('newChatMessage', msg.user + ' : ' + msg.message);

    let user = msg.user;
    let message = msg.message;

    const newMessage = new MessageModel({
      message: message,
      user: user,
    });
    newMessage.save();
  });

  socket.on('disconnect', () => {
    console.log(`Client ${socket.id} disconnected!`);
  });
});

server.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
