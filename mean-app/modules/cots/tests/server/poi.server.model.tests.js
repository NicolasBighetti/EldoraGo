'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Poi = mongoose.model('Poi');

/**
 * Globals
 */
var user,
  poi;

/**
 * Unit tests
 */
describe('Poi Model Unit Tests:', function () {
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
      // Add model fields
      // ...
      // 43.615978, 7.072379
      poi = new Poi({

        name: 'Accueil Polytech',
        ccords: {
          longitude: 43.615978,
          latitude: 7.072379
        },


        desc: 'Demande de renseignements, feutres'

      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      return poi.save(function (err) {
        should.not.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Poi.remove().exec();
    User.remove().exec();

    done();
  });
});
