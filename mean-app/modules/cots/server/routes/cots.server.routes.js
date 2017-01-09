'use strict';

/**
 * Module dependencies
 */
var cotsPolicy = require('../policies/cots.server.policy'),
  cots = require('../controllers/cots.server.controller');

module.exports = function (app) {
  // Cots Routes
  app.route('/api/cots').all(cotsPolicy.isAllowed)
    .get(cots.list)
    .post(cots.create);

  app.route('/api/cots/:cotId').all(cotsPolicy.isAllowed)
    .get(cots.read)
    .put(cots.update)
    .delete(cots.delete);

  // Finish by binding the Cot middleware
  app.param('cotId', cots.cotByID);
};
