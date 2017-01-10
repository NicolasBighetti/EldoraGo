'use strict';

angular.module('eldoragoApp')
  .controller('NavBarCtrl', function($scope, $location) {
      $scope.isActive = function(viewLocation) {
        return viewLocation === $location.path();
      };
    });
