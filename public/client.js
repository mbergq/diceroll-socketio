const socket = io();

const formUser = document.querySelector('#formUser');
const inputUser = document.querySelector('#inputUser');
const messages = document.querySelector('#messages');
const formMessage = document.querySelector('#formMessage');
const inputMessage = document.querySelector('#inputMessage');
const userContianer = document.querySelector('#userContainer');
const sendMsgBtn = document.querySelector('#sendMsgBtn');

const rollDice = document.querySelector('#rollDice');
const diceRolls = document.querySelector('#diceRolls');

let myUser;
inputMessage.style.display = 'none';
sendMsgBtn.style.display = 'none';
rollDice.style.display = 'none';
formUser.addEventListener('submit', function (e) {
  e.preventDefault();
  myUser = inputUser.value;
  userContianer.innerHTML = '<h2>Welcome ' + myUser + '</h2>';
  document.querySelector('#user').style.display = 'none';
  document.querySelector('#message').style.display = 'block';
  inputMessage.style.display = 'block';
  sendMsgBtn.style.display = 'block';
  rollDice.style.display = 'block';
});

//Send to server
formMessage.addEventListener('submit', (e) => {
  e.preventDefault();
  if (inputMessage.value) {
    socket.emit('chatMessage', { user: myUser, message: inputMessage.value });
    inputMessage.value = '';
  }
});
let totalSum = 0;
rollDice.addEventListener('click', () => {
  let randDice = Math.floor(Math.random() * 6 + 1);
  function countTotal() {
    totalSum = totalSum + randDice;
  }
  countTotal();
  console.log('Rolled:' + randDice);
  console.log('Total: ' + totalSum);
  socket.emit('diceroll', { user: myUser, diceSum: randDice, total: totalSum });
});

//On response coming from server
socket.on('newChatMessage', (msg) => {
  let item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
});

socket.on('dicerollData', (data) => {
  let diceroll = document.createElement('li');
  diceroll.textContent = data;
  diceRolls.appendChild(diceroll);
});
