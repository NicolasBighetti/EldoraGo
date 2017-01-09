(function () {
  'use strict';

  angular
    .module('timelines')
    .controller('TimelinesListController', TimelinesListController);

  TimelinesListController.$inject = ['TimelinesService'];

  function TimelinesListController(TimelinesService) {
    var vm = this;

    vm.timelines = TimelinesService.query();
  }
}());
