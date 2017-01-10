(function () {
  'use strict';

  // Timelines controller
  angular
    .module('timelines')
    .controller('TimelinesController', TimelinesController);

  TimelinesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'timelineResolve'];

  function TimelinesController ($scope, $state, $window, Authentication, timeline) {
    var vm = this;

    vm.authentication = Authentication;
    vm.timeline = timeline;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Timeline
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.timeline.$remove($state.go('timelines.list'));
      }
    }

    // Save Timeline
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.timelineForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.timeline._id) {
        vm.timeline.$update(successCallback, errorCallback);
      } else {
        vm.timeline.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('timelines.view', {
          timelineId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
