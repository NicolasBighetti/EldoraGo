'use strict';

/**
 * Module dependencies
 */
var timelinesPolicy = require('../policies/timelines.server.policy'),
  timelines = require('../controllers/timelines.server.controller');

module.exports = function(app) {
  // Timelines Routes
  app.route('/api/timelines').all(timelinesPolicy.isAllowed)
    .get(timelines.list)
    .post(timelines.create);

  app.route('/api/timelinesByPlayer/:playerId').all(timelinesPolicy.isAllowed)
    .get(timelines.listByPlayer);

  app.route('/api/timelines/:timelineId').all(timelinesPolicy.isAllowed)
    .get(timelines.read)
    .put(timelines.update)
    .delete(timelines.delete);



  // Finish by binding the Timeline middleware
  app.param('timelineId', timelines.timelineByID);
};
