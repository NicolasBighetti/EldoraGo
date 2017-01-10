(function () {
  'use strict';

  // Cot instances controller
  angular
    .module('cot-instances')
    .controller('CotInstancesController', CotInstancesController);

  CotInstancesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'cotInstanceResolve'];

  function CotInstancesController ($scope, $state, $window, Authentication, cotInstance) {
    var vm = this;

    vm.authentication = Authentication;
    vm.cotInstance = cotInstance;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Cot instance
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.cotInstance.$remove($state.go('cot-instances.list'));
      }
    }

    // Save Cot instance
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.cotInstanceForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.cotInstance._id) {
        vm.cotInstance.$update(successCallback, errorCallback);
      } else {
        vm.cotInstance.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('cot-instances.view', {
          cotInstanceId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
