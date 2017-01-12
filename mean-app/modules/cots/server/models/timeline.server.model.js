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
    default: 'Today',
    required: 'Please fill date'
  },
  action: {
    type: String,
    default: 'quest',
    required: 'Please fill action'

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
    //required: 'Please fill action'
  },
  player: {
    type: Schema.ObjectId,
    ref: 'Player',
    required: 'Please fill action'
  }
});

mongoose.model('Timeline', TimelineSchema);
