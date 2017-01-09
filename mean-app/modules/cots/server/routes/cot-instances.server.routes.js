'use strict';

/**
 * Module dependencies
 */
var cotInstancesPolicy = require('../policies/cot-instances.server.policy'),
  cotInstances = require('../controllers/cot-instances.server.controller');

module.exports = function(app) {
  // Cot instances Routes
  app.route('/api/cot-instances').all(cotInstancesPolicy.isAllowed)
    .get(cotInstances.list)
    .post(cotInstances.create);

  app.route('/api/cot-instances/:cotInstanceId').all(cotInstancesPolicy.isAllowed)
    .get(cotInstances.read)
    .put(cotInstances.update)
    .delete(cotInstances.delete);

  // Finish by binding the Cot instance middleware
  app.param('cotInstanceId', cotInstances.cotInstanceByID);
};
