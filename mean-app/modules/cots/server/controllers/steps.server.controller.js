'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Step = mongoose.model('Step'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Step
 */
exports.create = function (req, res) {
  var step = new Step(req.body);
  step.user = req.user;

  step.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(step);
    }
  });
};

/**
 * Show the current Step
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var step = req.step ? req.step.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  //step.isCurrentUserOwner = req.user && step.user && step.user._id.toString() === req.user._id.toString();

  res.jsonp(step);
};

/**
 * Update a Step
 */
exports.update = function (req, res) {
  var step = req.step;
  console.log(req.body);
  step = _.extend(step, req.body);
  step.quests = req.body.quests;
  step.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(step);
    }
  });
};

/**
 * Delete an Step
 */
exports.delete = function (req, res) {
  var step = req.step;

  step.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(step);
    }
  });
};

/**
 * List of Steps
 */
exports.list = function (req, res) {
  Step.find().sort('-created').populate('user', 'displayName').exec(function (err, steps) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(steps);
    }
  });
};

/**
 * Step middleware
 */
exports.stepByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Step is invalid'
    });
  }

  Step.findById(id).populate('user', 'displayName').exec(function (err, step) {
    if (err) {
      return next(err);
    } else if (!step) {
      return res.status(404).send({
        message: 'No Step with that identifier has been found'
      });
    }
    req.step = step;
    next();
  });
};
