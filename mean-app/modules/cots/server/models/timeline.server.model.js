'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Timeline Schema
 */
var TimelineSchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: 'Please fill user id',

  },
  date: {
    type: Date,
    default: Date.now
  },
  action: {
    type: String,
    default: 'quest',
    required: 'Please fill action type'
  },
  poi: {
    type: Schema.ObjectId,
    ref: 'Poi'
  },
/*
  quest: {
    type: Schema.ObjectId,
    ref: 'Quest'
  },
  etape: {
    type: Schema.ObjectId,
    ref: 'Quest'
  },
*/
  team: {
    type: Schema.ObjectId,
    ref: 'Team'
  }
});

mongoose.model('Timeline', TimelineSchema);
