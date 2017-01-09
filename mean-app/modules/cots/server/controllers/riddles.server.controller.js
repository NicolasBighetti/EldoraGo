'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Riddle = mongoose.model('Riddle'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Riddle
 */
exports.create = function (req, res) {

  var riddle = new Riddle(req.body);

  riddle.user = req.user;


  riddle.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(riddle);
    }
  });
};

/**
 * Show the current Riddle
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var riddle = req.riddle ? req.riddle.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  riddle.isCurrentUserOwner = req.user && riddle.user && riddle.user._id.toString() === req.user._id.toString();

  res.jsonp(riddle);
};

/**
 * Update a Riddle
 */
exports.update = function (req, res) {
  var riddle = req.riddle;

  riddle = _.extend(riddle, req.body);

  riddle.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(riddle);
    }
  });
};

/**
 * Delete an Riddle
 */
exports.delete = function (req, res) {
  var riddle = req.riddle;

  riddle.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(riddle);
    }
  });
};

/**
 * List of Riddles
 */
exports.list = function (req, res) {
  Riddle.find().sort('-created').populate('user', 'displayName').exec(function (err, riddles) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(riddles);
    }
  });
};

/**
 * Riddles middleware
 */
exports.riddleByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Riddle is invalid'
    });
  }

  Riddle.findById(id).populate('user', 'displayName').exec(function (err, riddle) {
    if (err) {
      return next(err);
    } else if (!riddle) {
      return res.status(404).send({
        message: 'No Riddle with that identifier has been found'
      });
    }
    req.riddle = riddle;
    next();
  });
};
