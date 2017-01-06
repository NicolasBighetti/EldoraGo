'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Quest = mongoose.model('Quest'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Quest
 */
exports.create = function (req, res) {
  var quest = new Quest(req.body);
  quest.user = req.user;

  quest.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(quest);
    }
  });
};

/**
 * Show the current Quest
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var quest = req.quest ? req.quest.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  quest.isCurrentUserOwner = req.user && quest.user && quest.user._id.toString() === req.user._id.toString();

  res.jsonp(quest);
};

/**
 * Update a Quest
 */
exports.update = function (req, res) {
  var quest = req.quest;

  quest = _.extend(quest, req.body);

  quest.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(quest);
    }
  });
};

/**
 * Delete an Quest
 */
exports.delete = function (req, res) {
  var quest = req.quest;

  quest.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(quest);
    }
  });
};

/**
 * List of Quests
 */
exports.list = function (req, res) {
  Quest.find().sort('-created').populate('user', 'displayName').exec(function (err, quests) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(quests);
    }
  });
};

/**
 * Quest middleware
 */
exports.questByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Quest is invalid'
    });
  }

  Quest.findById(id).populate('user', 'displayName').exec(function (err, quest) {
    if (err) {
      return next(err);
    } else if (!quest) {
      return res.status(404).send({
        message: 'No Quest with that identifier has been found'
      });
    }
    req.quest = quest;
    next();
  });
};
