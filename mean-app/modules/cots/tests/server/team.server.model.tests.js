'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Team = mongoose.model('Team'),
  Cot = mongoose.model('Cot');

/**
 * Globals
 */
var user,
  team;

/**
 * Unit tests
 */
describe('Team Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    var cot = new Cot({
      name: 'Premiere chasse !',
      user: user,
      desc: 'Lancer vous dans la première chasse au trésor d\'Eldorago' +
      'au programme: visite de l\'école',
      time_est: 60,
      time_avg: 0,
      steps: [],
      cotImageURL: 'modules/user/client/img/profile/default.png',
      date_start: new Date(2017, 1, 7), // 7 jan

    });

    user.save(function() {
      team = new Team({
        // Add model fields
        // ...
        name: 'Team J',
        player: [],
        cot: cot
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      return team.save(function(err) {
        should.not.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Team.remove().exec();
    User.remove().exec();

    done();
  });
});
