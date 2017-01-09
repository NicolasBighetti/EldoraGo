// Timelines service used to communicate Timelines REST endpoints
(function () {
  'use strict';

  angular
    .module('timelines')
    .factory('TimelinesService', TimelinesService);

  TimelinesService.$inject = ['$resource'];

  function TimelinesService($resource) {
    return $resource('api/timelines/:timelineId', {
      timelineId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
