const socket = io();

const formUser = document.querySelector('#formUser');
const inputUser = document.querySelector('#inputUser');
const messages = document.querySelector('#messages');
const formMessage = document.querySelector('#formMessage');
const inputMessage = document.querySelector('#inputMessage');
const userContianer = document.querySelector('#userContainer');

const rollDice = document.querySelector('#rollDice');
const diceRolls = document.querySelector('#diceRolls');

let myUser;

formUser.addEventListener('submit', function (e) {
  e.preventDefault();
  myUser = inputUser.value;
  userContianer.innerHTML = '<h2>Welcome ' + myUser + '</h2>';
  document.querySelector('#user').style.display = 'none';
  document.querySelector('#message').style.display = 'block';
});

formMessage.addEventListener('submit', (e) => {
  e.preventDefault();
  if (inputMessage.value) {
    socket.emit('chatMessage', { user: myUser, message: inputMessage.value });
    inputMessage.value = '';
  }
});

rollDice.addEventListener('click', () => {
  let randDice = Math.floor(Math.random() * 6 + 1);
  console.log(randDice);
  socket.emit('diceroll', { user: myUser, diceSum: randDice });
});

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
