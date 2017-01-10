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
  coords: {
    longitude:{
      type: Number,
      default: 0,
      required: 'Please fill Poi longitude',
    },
    latitude:{
      type: Number,
      default: 0,
      required: 'Please fill Poi latitude',
    }
  },
  image:{
    type: String,
    default: './images/default.jpg'
  },
  people:{
    type: Number,
    default: 0
  },
  avg_time:{
    type: Number,
    default: 0
  }

});

mongoose.model('Poi', PoiSchema);
