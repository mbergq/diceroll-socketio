const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const port = 3000;

const MessageModel = require('./models/messageModel');
const dicerollModel = require('./models/dicerollModel');

const connectionMongoDB = require('./connectionMongoDB');
connectionMongoDB();

app.use(express.static('public'));
//Endpoint to see all messages
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
//Endpoint showing all dicerolls
app.get('/dicerolls', async (req, res) => {
  try {
    const allDicerolls = await dicerollModel.find();
    return res.status(200).json(allDicerolls);
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
      user: user,
      message: message,
    });
    newMessage.save();
  });

  socket.on('diceroll', (data) => {
    io.emit(
      'dicerollData',
      data.user + ': ' + data.diceSum + ' Total: ' + data.total
    );

    let user = data.user;
    let diceroll = data.diceSum;
    let total = data.total;

    const newDiceroll = new dicerollModel({
      user: user,
      diceroll: diceroll,
      dicerollSum: total,
    });
    newDiceroll.save();
  });

  socket.on('disconnect', () => {
    console.log(`Client ${socket.id} disconnected!`);
  });
});

server.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
