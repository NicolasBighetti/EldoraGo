'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Poi Schema
 */
var PoiSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Poi name',
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
  desc : {
	type: String,
	default: 'desc',
	trim: true,
	required: 'Please fill Poi desc'
  }
  
});

mongoose.model('Poi', PoiSchema);
