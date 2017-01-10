'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  CotInstance = mongoose.model('CotInstance'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Cot instance
 */
exports.create = function(req, res) {
  var cotInstance = new CotInstance(req.body);
  cotInstance.user = req.user;

  cotInstance.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(cotInstance);
    }
  });
};

/**
 * Show the current Cot instance
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var cotInstance = req.cotInstance ? req.cotInstance.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  cotInstance.isCurrentUserOwner = req.user && cotInstance.user && cotInstance.user._id.toString() === req.user._id.toString();

  res.jsonp(cotInstance);
};

/**
 * Update a Cot instance
 */
exports.update = function(req, res) {
  var cotInstance = req.cotInstance;

  cotInstance = _.extend(cotInstance, req.body);

  cotInstance.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(cotInstance);
    }
  });
};

/**
 * Delete an Cot instance
 */
exports.delete = function(req, res) {
  var cotInstance = req.cotInstance;

  cotInstance.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(cotInstance);
    }
  });
};

/**
 * List of Cot instances
 */
exports.list = function(req, res) {
  CotInstance.find().sort('-created').populate('user', 'displayName').exec(function(err, cotInstances) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(cotInstances);
    }
  });
};

/**
 * Cot instance middleware
 */
exports.cotInstanceByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Cot instance is invalid'
    });
  }

  CotInstance.findById(id).populate('user', 'displayName').exec(function (err, cotInstance) {
    if (err) {
      return next(err);
    } else if (!cotInstance) {
      return res.status(404).send({
        message: 'No Cot instance with that identifier has been found'
      });
    }
    req.cotInstance = cotInstance;
    next();
  });
};
