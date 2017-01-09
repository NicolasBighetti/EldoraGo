'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  CotInstance = mongoose.model('CotInstance');

/**
 * Globals
 */
var user,
  cotInstance;

/**
 * Unit tests
 */
describe('Cot instance Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() {
      cotInstance = new CotInstance({
        name: 'Cot instance Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return cotInstance.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

   /* it('should be able to show an error when try to save without name', function(done) {
      cotInstance.name = '';

      return cotInstance.save(function(err) {
        should.exist(err);
        done();
      });
    });*/
  });

  afterEach(function(done) {
    CotInstance.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
