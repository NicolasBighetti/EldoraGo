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
  keywords: {
    type: [String],
    default: [],
    trim: true
  },
  rtype:{
    type: String,
    default: 'riddle' //ou photo
  },

  theme: {
    type: String,
    default: 'culture'
    // value in culture ville plage montagne
  },
  hint: {
    type: String,
    default: '',
    trim: true
  },
  answer: {
    type: String,
    default: '',
    trim: true
  }

});

mongoose.model('Riddle', RiddleSchema);
