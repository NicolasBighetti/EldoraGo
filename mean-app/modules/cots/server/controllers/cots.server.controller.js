'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Cot = mongoose.model('Cot'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Cot
 */
exports.create = function (req, res) {
  var cot = new Cot(req.body);
  cot.user = req.user;

  cot.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(cot);
    }
  });
};

/**
 * Show the current Cot
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var cot = req.cot ? req.cot.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  cot.isCurrentUserOwner = req.user && cot.user && cot.user._id.toString() === req.user._id.toString();

  res.jsonp(cot);
};

/**
 * Update a Cot
 */
exports.update = function (req, res) {
  var cot = req.cot;

  cot = _.extend(cot, req.body);
  cot.steps = req.body.steps;
  cot.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(cot);
    }
  });
};

/**
 * Delete an Cot
 */
exports.delete = function (req, res) {
  var cot = req.cot;

  cot.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(cot);
    }
  });
};

/**
 * List of Cots
 */
exports.list = function (req, res) {
  Cot.find().sort('-created').populate('user', 'displayName').exec(function (err, cots) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(cots);
    }
  });
};

/**
 * Cot middleware
 */
exports.cotByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Cot is invalid'
    });
  }

  Cot.findById(id).populate('user', 'displayName').exec(function (err, cot) {
    if (err) {
      return next(err);
    } else if (!cot) {
      return res.status(404).send({
        message: 'No Cot with that identifier has been found'
      });
    }
    req.cot = cot;
    next();
  });
};
