(function () {
  'use strict';

  angular
    .module('cots')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('cots', {
        abstract: true,
        url: '/cots',
        template: '<ui-view/>'
      })
      .state('cots.list', {
        url: '',
        templateUrl: 'modules/cots/client/views/list-cots.client.view.html',
        controller: 'CotsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Cots List'
        }
      })
      .state('cots.create', {
        url: '/create',
        templateUrl: 'modules/cots/client/views/form-cot.client.view.html',
        controller: 'CotsController',
        controllerAs: 'vm',
        resolve: {
          cotResolve: newCot
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Cots Create'
        }
      })
      .state('cots.edit', {
        url: '/:cotId/edit',
        templateUrl: 'modules/cots/client/views/form-cot.client.view.html',
        controller: 'CotsController',
        controllerAs: 'vm',
        resolve: {
          cotResolve: getCot
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Cot {{ cotResolve.name }}'
        }
      })
      .state('cots.view', {
        url: '/:cotId',
        templateUrl: 'modules/cots/client/views/view-cot.client.view.html',
        controller: 'CotsController',
        controllerAs: 'vm',
        resolve: {
          cotResolve: getCot
        },
        data: {
          pageTitle: 'Cot {{ cotResolve.name }}'
        }
      });
  }

  getCot.$inject = ['$stateParams', 'CotsService'];

  function getCot($stateParams, CotsService) {
    return CotsService.get({
      cotId: $stateParams.cotId
    }).$promise;
  }

  newCot.$inject = ['CotsService'];

  function newCot(CotsService) {
    return new CotsService();
  }
}());
