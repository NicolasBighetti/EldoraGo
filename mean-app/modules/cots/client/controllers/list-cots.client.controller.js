(function () {
  'use strict';

  angular
    .module('cots')
    .controller('CotsListController', CotsListController);

  CotsListController.$inject = ['CotsService'];

  function CotsListController(CotsService) {
    var vm = this;

    vm.cots = CotsService.query();
  }
}());
