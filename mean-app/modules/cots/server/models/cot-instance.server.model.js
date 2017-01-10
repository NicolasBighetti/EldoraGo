'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Cot instance Schema
 */
var CotInstanceSchema = new Schema({
  player: {
    type: Schema.ObjectId,
    ref: 'Player'
  },
  started: {
    type: Date,
    default: Date.now
  },
  ended: {
    type: Date
  }
});

mongoose.model('CotInstance', CotInstanceSchema);
