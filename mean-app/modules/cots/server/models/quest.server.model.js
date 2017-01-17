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
  desc: {
    type: String,
    default: '',
    //required: 'Please fill quest desc',
    trim: true
  },
  optional:{
    type: Boolean,
    default: false
  },
  riddle: {
    type: Schema.ObjectId,

    ref: 'Riddle'
  },
  poi: {
    type: Schema.ObjectId,
    ref: 'Poi'
  },
  avg_time: {
    type: Number,
    default: 0
  },
  est_time: {
    type: Number,
    default: 0
  },
  success: {
    type: Number,
    default: 12,
    required: 'Please specify the pourcent of success',
    trim: true
  }
});

mongoose.model('Quest', QuestSchema);
