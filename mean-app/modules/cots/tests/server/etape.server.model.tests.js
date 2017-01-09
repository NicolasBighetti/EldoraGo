'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Step = mongoose.model('Step');

/**
 * Globals
 */
var user,
  step;

/**
 * Unit tests
 */
describe('Step Model Unit Tests:', function () {
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
      step = new Step({
        // Add model fields
        // ...
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      return step.save(function (err) {
        should.not.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Step.remove().exec();
    User.remove().exec();

    done();
  });
});
