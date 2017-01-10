// Cot instances service used to communicate Cot instances REST endpoints
(function () {
  'use strict';

  angular
    .module('cot-instances')
    .factory('CotInstancesService', CotInstancesService);

  CotInstancesService.$inject = ['$resource'];

  function CotInstancesService($resource) {
    return $resource('api/cot-instances/:cotInstanceId', {
      cotInstanceId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
