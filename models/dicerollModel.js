const mongoose = require('mongoose');

const DicerollSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  diceroll: {
    type: Number,
    required: true,
  },
  dicerollSum: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('dicerollData', DicerollSchema);
