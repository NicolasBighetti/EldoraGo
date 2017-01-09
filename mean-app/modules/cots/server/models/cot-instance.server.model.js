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
  user: {
    type: Schema.ObjectId,
    required: 'Please fill user',
    ref: 'User'
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
