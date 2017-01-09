'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Enigme = mongoose.model('Enigme');

/**
 * Globals
 */
var user,
  enigme;

/**
 * Unit tests
 */
describe('Enigme Model Unit Tests:', function () {
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
      enigme = new Enigme({
        // Add model fields
        // ...
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      return enigme.save(function (err) {
        should.not.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Enigme.remove().exec();
    User.remove().exec();

    done();
  });
});
