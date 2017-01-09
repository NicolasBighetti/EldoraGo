// Cots service used to communicate Cots REST endpoints
(function () {
  'use strict';

  angular
    .module('cots')
    .factory('CotsService', CotsService);

  CotsService.$inject = ['$resource'];

  function CotsService($resource) {
    return $resource('api/cots/:cotId', {
      cotId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
