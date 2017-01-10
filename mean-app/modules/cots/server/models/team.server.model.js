'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Team Schema
 */
var TeamSchema = new Schema({
  // Team model fields
  // ...
  name: {
    type: String,
    default: '',
    required: 'Please fill Cot name',
    trim: true
  },
  player: {
    type: [Schema.ObjectId],
    ref: 'Player'
  },
  cot: {

  }
});

mongoose.model('Team', TeamSchema);