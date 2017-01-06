(function () {
  'use strict';

  angular
    .module('pois')
    .controller('PoisListController', PoisListController);

  PoisListController.$inject = ['PoisService'];

  function PoisListController(PoisService) {
    var vm = this;

    vm.pois = PoisService.query();
  }
}());
