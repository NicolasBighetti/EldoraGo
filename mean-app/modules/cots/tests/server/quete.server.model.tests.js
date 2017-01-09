'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Quest = mongoose.model('Quest'),
  Riddle = mongoose.model('Riddle'),
  Cot = mongoose.model('Cot');

/**
 * Globals
 */
var user,
  quest,riddle;

/**
 * Unit tests
 */
describe('Quest Model Unit Tests:', function () {
  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    riddle = new Riddle({});
    

    user.save(function () {
      quest = new Quest({
        // Add model fields
        // ...
        nom: 'Aller à l\'acceuil',
        desc: 'Pour cette première quête rendez vous à l\'acceuil et répondez à l\'énigme',
        riddle: 'Riddle'

      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      return quest.save(function (err) {
        should.not.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Quest.remove().exec();
    User.remove().exec();

    done();
  });
});
