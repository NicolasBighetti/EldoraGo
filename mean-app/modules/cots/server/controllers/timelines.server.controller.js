'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Timeline = mongoose.model('Timeline'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Timeline
 */
exports.create = function(req, res) {
  var timeline = new Timeline(req.body);
  timeline.user = req.user;

  timeline.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(timeline);
    }
  });
};

/**
 * Show the current Timeline
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var timeline = req.timeline ? req.timeline.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  timeline.isCurrentUserOwner = req.user && timeline.user && timeline.user._id.toString() === req.user._id.toString();

  res.jsonp(timeline);
};

/**
 * Update a Timeline
 */
exports.update = function(req, res) {
  var timeline = req.timeline;

  timeline = _.extend(timeline, req.body);

  timeline.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(timeline);
    }
  });
};

/**
 * Delete an Timeline
 */
exports.delete = function(req, res) {
  var timeline = req.timeline;

  timeline.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(timeline);
    }
  });
};

/**
 * List of Timelines
 */
exports.list = function(req, res) {
  Timeline.find().sort('-created').populate('user', 'displayName').exec(function(err, timelines) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(timelines);
    }
  });
};

/**
 * Timeline middleware
 */
exports.timelineByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Timeline is invalid'
    });
  }

  Timeline.findById(id).populate('user', 'displayName').exec(function (err, timeline) {
    if (err) {
      return next(err);
    } else if (!timeline) {
      return res.status(404).send({
        message: 'No Timeline with that identifier has been found'
      });
    }
    req.timeline = timeline;
    next();
  });
};
