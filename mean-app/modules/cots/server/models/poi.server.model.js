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
  // Poi model fields
  // ...
  name: {
    type: String,
    default: '',
    required: 'Please fill Poi name',
    trim: true
  },
  desc: {
    type: String,
    default: '',
    required: 'Please fill Poi desc',
    trim: true
  },
  long:{
    type: String,
    default: '0',
    required: 'Please fill Poi longitude',
    trim: true
  },
  lat:{
    type: String,
    default: '0',
    required: 'Please fill Poi latitude',
    trim: true
  }
  
});

mongoose.model('Poi', PoiSchema);
