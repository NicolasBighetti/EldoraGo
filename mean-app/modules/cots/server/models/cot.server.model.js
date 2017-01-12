'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Cot Schema
 */
var CotSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Cot name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  date_start:{
    type: Date,
    default: Date.now
  },
  date_end:{
    type: Date
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  desc: {
    type: String,
    required: 'Please fill Cot desc'
  },
  time_est: {
    type: Number,
    default: 0,
    min: 0
  },
  time_avg: {
    type: Number,
    default: 0,
    min: 0
  },
  steps: {
    type: [Schema.Types.ObjectId],
    ref: 'Step'
  },
  cotImageURL: {
    type: String,
    default: 'modules/users/client/img/profile/default.png'
  },
  participants: {
    type: [Schema.ObjectId],
    ref: 'Player'
  }
});

mongoose.model('Cot', CotSchema);
