'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Player Schema
 */
var PlayerSchema = new Schema({
  // Player model fields
  // ...

  //on a besoin d'avoir les instance de cot associé au joueur
  // une instance de jeu aurait :
  //cotid, status(en cours/réussite/abandonnée) + temps + distance
  //liste quetes terminées et en cours/disponibles + temps
  //etapeid
  name: {
    type: String,
    default: '',
    required: 'Please fill User name',
    trim: true
  },

 /* user: {
    type: Schema.ObjectId,
    ref: 'User'
  },*/
  cots: {
    type: [Object],
    default: [],
    ref: 'Cot'
  },
  teams: {
    type: [Schema.ObjectId],
    default: [],
    ref: 'Team'
  }
  //trésors ...
});

mongoose.model('Player', PlayerSchema);
