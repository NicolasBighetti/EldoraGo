'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Step Schema
 */
var StepSchema = new Schema({
  // Step model fields
  // ...
  name: {
    type: String,
    default: '',
    required: 'Please fill step name',
    trim: true
  },
  pos: {
    type: Number
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
    //required: 'Please fill step desc',
    trim: true
  },
  quests: {
    type: [Schema.Types.ObjectId],
    ref: 'Quest'
  }
});

mongoose.model('Step', StepSchema);
