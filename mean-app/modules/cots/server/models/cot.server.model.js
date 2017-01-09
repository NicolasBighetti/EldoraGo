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
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  desc: {
    type: String,
    default: '',
    required: 'Please fill Cot desc',
    trim: true
  },
  duree_estime: {
    type: Number,
    default: 0,
    min: 0
  },
  duree_moyenne: {
    type: Number,
    default: 0,
    min: 0
  },
  etapes: {
    type: [Schema.Types.ObjectId],
    ref: 'Step'
  },
  cotImageURL: {
    type: String,
    default: 'modules/cots/client/img/profile/default.png'
  }
});

mongoose.model('Cot', CotSchema);
