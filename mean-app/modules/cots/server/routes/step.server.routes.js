'use strict';

/**
 * Module dependencies
 */
var stepsPolicy = require('../policies/steps.server.policy'),
  steps = require('../controllers/steps.server.controller');

module.exports = function (app) {
  // Cots Routes
  app.route('/api/steps').all(stepsPolicy.isAllowed)
    .get(steps.list)
    .post(steps.create);

  app.route('/api/steps/:stepId').all(stepsPolicy.isAllowed)
    .get(steps.read)
    .put(steps.update)
    .delete(steps.delete);

  // Finish by binding the step middleware
  app.param('stepId', steps.stepByID);
};
