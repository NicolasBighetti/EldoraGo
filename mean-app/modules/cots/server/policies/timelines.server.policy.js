'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Timelines Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/timelines',
      permissions: '*'
    }, {
      resources: '/api/timelines/:timelineId',
      permissions: '*'
    }, {
      resources: '/api/timelinesByPlayer/:playerId',
      permissions: ['*']
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/timelines',
      permissions: ['get', 'post']
    }, {
      resources: '/api/timelines/:timelineId',
      permissions: ['get']
    }, {
      resources: '/api/timelinesByPlayer/:playerId',
      permissions: ['*']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/timelines',
      permissions: ['*']
    }, {
      resources: '/api/timelines/:timelineId',
      permissions: ['*']
    }, {
      resources: '/api/timelinesByPlayer/:playerId',
      permissions: ['*']
    }]
  }]);
};

/**
 * Check If Timelines Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Timeline is being processed and the current user created it then allow any manipulation
  if (req.timeline && req.user && req.timeline.user && req.timeline.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
