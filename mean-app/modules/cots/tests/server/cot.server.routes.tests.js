'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Cot = mongoose.model('Cot'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  cot;

/**
 * Cot routes tests
 */
describe('Cot CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Cot
    user.save(function () {
      cot = new Cot({
        name: 'Premiere chasse !',
        user: user,
        desc: 'Lancer vous dans la première chasse au trésor d\'Eldorago au programme: visite de l\'école',
        time_est: 60,
        time_avg: 0,
        steps: [],
        cotImageURL: 'modules/user/client/img/profile/default.png',
        date_start: new Date(2017, 1, 7)

      });

      done();
    });
  });

  it('should be able to save a Cot if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }
        console.log('BBBBBBBBB');
        // Get the userId
        var userId = user.id;
        console.log('DDD');

        // Save a new Cot
        agent.post('/api/cots')
          .send(cot)
          .expect(200)
          .end(function (cotSaveErr, cotSaveRes) {
            // Handle Cot save error
            console.log('GGGGG');
            //console.log(cotSaveRes);
            if (cotSaveErr) {
              console.log('ERRRR');
              return done(cotSaveErr);
            }
            console.log('CCC');
            // Get a list of Cots
            agent.get('/api/cots')
              .end(function (cotsGetErr, cotsGetRes) {
                // Handle Cots save error
                if (cotsGetErr) {
                  return done(cotsGetErr);
                }
                console.log('DDDD');

                // Get Cots list
                var cots = cotsGetRes.body;

                // Set assertions
                (cots[0].user._id).should.equal(userId);
                (cots[0].name).should.match('Cot name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  /*  it('should not be able to save an Cot if not logged in', function (done) {
   agent.post('/api/cots')
   .send(cot)
   .expect(403)
   .end(function (cotSaveErr, cotSaveRes) {
   // Call the assertion callback
   done(cotSaveErr);
   });
   });*/

  it('should not be able to save an Cot if no name is provided', function (done) {
    // Invalidate name field
    cot.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Cot
        agent.post('/api/cots')
          .send(cot)
          .expect(400)
          .end(function (cotSaveErr, cotSaveRes) {
            // Set message assertion
            (cotSaveRes.body.message).should.match('Please fill Cot name');

            // Handle Cot save error
            done(cotSaveErr);
          });
      });
  });

  it('should be able to update an Cot if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Cot
        agent.post('/api/cots')
          .send(cot)
          .expect(200)
          .end(function (cotSaveErr, cotSaveRes) {
            // Handle Cot save error
            if (cotSaveErr) {
              return done(cotSaveErr);
            }

            // Update Cot name
            cot.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Cot
            agent.put('/api/cots/' + cotSaveRes.body._id)
              .send(cot)
              .expect(200)
              .end(function (cotUpdateErr, cotUpdateRes) {
                // Handle Cot update error
                if (cotUpdateErr) {
                  return done(cotUpdateErr);
                }

                // Set assertions
                (cotUpdateRes.body._id).should.equal(cotSaveRes.body._id);
                (cotUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Cots if not signed in', function (done) {
    // Create new Cot model instance
    var cotObj = new Cot(cot);

    // Save the cot
    cotObj.save(function () {
      // Request Cots
      request(app).get('/api/cots')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Cot if not signed in', function (done) {
    // Create new Cot model instance
    var cotObj = new Cot(cot);

    // Save the Cot
    cotObj.save(function () {
      request(app).get('/api/cots/' + cotObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', cot.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Cot with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/cots/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Cot is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Cot which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Cot
    request(app).get('/api/cots/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Cot with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Cot if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Cot
        agent.post('/api/cots')
          .send(cot)
          .expect(200)
          .end(function (cotSaveErr, cotSaveRes) {
            // Handle Cot save error
            if (cotSaveErr) {
              return done(cotSaveErr);
            }

            // Delete an existing Cot
            agent.delete('/api/cots/' + cotSaveRes.body._id)
              .send(cot)
              .expect(200)
              .end(function (cotDeleteErr, cotDeleteRes) {
                // Handle cot error error
                if (cotDeleteErr) {
                  return done(cotDeleteErr);
                }

                // Set assertions
                (cotDeleteRes.body._id).should.equal(cotSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  /*it('should not be able to delete an Cot if not signed in', function (done) {
   // Set Cot user
   cot.user = user;

   // Create new Cot model instance
   var cotObj = new Cot(cot);

   // Save the Cot
   cotObj.save(function () {
   // Try deleting Cot
   request(app).delete('/api/cots/' + cotObj._id)
   .expect(403)
   .end(function (cotDeleteErr, cotDeleteRes) {
   // Set message assertion
   (cotDeleteRes.body.message).should.match('User is not authorized');

   // Handle Cot error error
   done(cotDeleteErr);
   });

   });
   });*/

  it('should be able to get a single Cot that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Cot
          agent.post('/api/cots')
            .send(cot)
            .expect(200)
            .end(function (cotSaveErr, cotSaveRes) {
              // Handle Cot save error
              if (cotSaveErr) {
                return done(cotSaveErr);
              }

              // Set assertions on new Cot
              (cotSaveRes.body.name).should.equal(cot.name);
              should.exist(cotSaveRes.body.user);
              should.equal(cotSaveRes.body.user._id, orphanId);

              // force the Cot to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Cot
                    agent.get('/api/cots/' + cotSaveRes.body._id)
                      .expect(200)
                      .end(function (cotInfoErr, cotInfoRes) {
                        // Handle Cot error
                        if (cotInfoErr) {
                          return done(cotInfoErr);
                        }

                        // Set assertions
                        (cotInfoRes.body._id).should.equal(cotSaveRes.body._id);
                        (cotInfoRes.body.name).should.equal(cot.name);
                        should.equal(cotInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Cot.remove().exec(done);
    });
  });
});
