'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Riddle = mongoose.model('Riddle');

/**
 * Globals
 */
var user,
  riddle;

/**
 * Unit tests
 */
describe('Riddle Model Unit Tests:', function () {
  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function () {
      riddle = new Riddle({
        // Add model fields
        // ...
        name:' Riddle 1  !',
        desc:' Quelle salle se trouve devant l\'acceuil ?',
        hint: '14.',
        answer: '141'
        
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      return riddle.save(function (err) {
        should.not.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Riddle.remove().exec();
    User.remove().exec();

    done();
  });
});
