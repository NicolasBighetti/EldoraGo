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

  date: {
    type: Date,
    default: Date.now
  },
  date_s: {
    type: String,
    default: 'Today'
  },
  action: {
    type: String,
    default: 'quest'
  },
  poi: {
    type: Schema.ObjectId,
    ref: 'Poi'
  },
  quest: {
    type: Schema.ObjectId,
    ref: 'Quest'
  },
  team: {
    type: Schema.ObjectId,
    ref: 'Team'
  },
  player: {
    type: Schema.ObjectId,
    ref: 'Player'
  }
});

mongoose.model('Timeline', TimelineSchema);
