(function () {
  'use strict';

  // Cots controller
  angular
    .module('cots')
    .controller('CotsController', CotsController);

  CotsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'cotResolve'];

  function CotsController($scope, $state, $window, Authentication, cot) {
    var vm = this;

    vm.authentication = Authentication;
    vm.cot = cot;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Cot
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.cot.$remove($state.go('cots.list'));
      }
    }

    // Save Cot
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.cotForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.cot._id) {
        vm.cot.$update(successCallback, errorCallback);
      } else {
        vm.cot.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('cots.view', {
          cotId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
