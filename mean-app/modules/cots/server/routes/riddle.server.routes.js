'use strict';

/**
 * Module dependencies
 */
var riddlesPolicy = require('../policies/riddles.server.policy'),
  riddles = require('../controllers/riddles.server.controller');

module.exports = function (app) {
  // Cots Routes
  app.route('/api/riddles').all(riddlesPolicy.isAllowed)
    .get(riddles.list)
    .post(riddles.create);

  app.route('/api/riddles/:riddleId').all(riddlesPolicy.isAllowed)
    .get(riddles.read)
    .put(riddles.update)
    .delete(riddles.delete);

  // Finish by binding the Cot middleware
  app.param('riddleId', riddles.riddleByID);
};
