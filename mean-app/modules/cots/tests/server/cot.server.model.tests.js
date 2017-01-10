'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Cot = mongoose.model('Cot');

/**
 * Globals
 */
var user,
  cot;

/**
 * Unit tests
 */
describe('Cot Model Unit Tests:', function () {
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
      cot = new Cot({
        name: 'Premiere chasse !',
        user: user,
        desc: 'Lancez vous dans la première chasse au trésor d\'Eldorago au programme: visite de l\'école',
        time_est: 60,
        time_avg: 0,
        steps: [],
        cotImageURL: 'modules/user/client/img/profile/default.png',
        date_start: new Date(2017, 1, 7) // 7 jan

      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(0);
      return cot.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function (done) {
      cot.name = '';

      return cot.save(function (err) {
        should.exist(err);
        done();
      });
    });
    it('should be able to show an error when try to save without description', function (done) {
      cot.desc = '';

      return cot.save(function (err) {
        should.exist(err);
        done();
      });
    });

  });

  afterEach(function (done) {
    Cot.remove().exec(function () {
      User.remove().exec(function () {
        done();
      });
    });
  });
});
