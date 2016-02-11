'use strict';

var _ = require('lodash');
var Poll = require('./poll.model');

// Get list of polls
exports.index = function(req, res) {
  Poll.find(function (err, polls) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(polls);
  });
};

// Get a single poll
exports.show = function(req, res) {
  Poll.findById(req.params.id, function (err, poll) {
    if(err) { return handleError(res, err); }
    if(!poll) { return res.status(404).send('Not Found'); }
    return res.json(poll);
  });
};

// Creates a new poll in the DB.
exports.create = function(req, res) {
  Poll.create(req.body, function(err, poll) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(poll);
  });
};

// Updates an existing poll in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Poll.findById(req.params.id, function (err, poll) {
    if (err) { return handleError(res, err); }
    if(!poll) { return res.status(404).send('Not Found'); }
    var updated = _.merge(poll, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(poll);
    });
  });
};

// Deletes a poll from the DB.
exports.destroy = function(req, res) {
  Poll.findById(req.params.id, function (err, poll) {
    if(err) { return handleError(res, err); }
    if(!poll) { return res.status(404).send('Not Found'); }
    poll.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

/**
 * Insert Vote into Poll.choices.votes
 *
 * @param req with params.pollid and body { choiceid: "", fingerprint: "" }
 * @param res
 */
exports.vote = function (req, res) {
  var pollid = req.params.id;
  var choiceid = req.body.choiceid;
  var fingerprint = req.body.fingerprint;

  //ensure fingerprint
  if (fingerprint === undefined || fingerprint === null || fingerprint === "") {
    return res.status(400).send('No client id');
  }

  Poll.findById(pollid, function (err, poll) {
    if(err) { return handleError(res, err); }
    if(!poll) { return res.status(404).send('Not Found'); }

    //check if already voted
    for (var c in poll.choices) {
      var curChoice = poll.choices[c];
      for (var v in curChoice.votes) {
        var curVote = curChoice.votes[v];
        if (curVote.fingerprint === fingerprint) {
          return res.status(400).send('already voted for poll');
        }
      }
    }

    var choice = poll.choices.id(choiceid);
    choice.votes.push({ fingerprint: fingerprint });

    poll.save(function(err, doc) {
      if (err) {
        return handleError(res, err);
      }

      return res.status(200).json(doc);
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
