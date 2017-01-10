(function () {
  'use strict';

  angular
    .module('cot-instances')
    .controller('CotInstancesListController', CotInstancesListController);

  CotInstancesListController.$inject = ['CotInstancesService'];

  function CotInstancesListController(CotInstancesService) {
    var vm = this;

    vm.cotInstances = CotInstancesService.query();
  }
}());
