'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Riddle Schema
 */
var RiddleSchema = new Schema({
  // Riddle model fields
  // ...
  name: {
    type: String,
    default: '',
    required: 'Please fill riddle name',
    trim: true
  },
  desc: {
    type: String,
    default: '',
    required: 'Please fill riddle desc',
    trim: true
  },
  kewords: {
    type: [String],
    default: '',
    trim: true
  },
  hint: {
    type: String,
    default: '',
    trim: true
  },
  answer: {
    type: String,
    default: '',
    required: 'Please fill riddle answer',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }

});

mongoose.model('Riddle', RiddleSchema);
