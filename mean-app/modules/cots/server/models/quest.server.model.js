'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Quest Schema
 */
var QuestSchema = new Schema({
  // Quest model fields
  // ...
  name: {
    type: String,
    default: '',
    required: 'Please fill quest name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  desc: {
    type: String,
    default: '',
    required: 'Please fill quest desc',
    trim: true
  },
  riddle: {
    type: Schema.ObjectId,
    ref: 'Riddle'
  }
});

mongoose.model('Quest', QuestSchema);
