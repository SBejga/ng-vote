'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Subdocument schema for votes
var voteSchema = new mongoose.Schema({
  fingerprint: String,
  user: String
});

// Subdocument schema for poll choices
var choiceSchema = new mongoose.Schema({
  text: String,
  votes: [voteSchema]
});

var PollSchema = new Schema({
  question: String,
  choices: [choiceSchema],
  active: {type: Boolean, default: false},
  closed: {type: Boolean, default: false}
});

module.exports = mongoose.model('Poll', PollSchema);
