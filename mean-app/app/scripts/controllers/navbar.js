'use strict';

angular.module('eldoragoApp')
  .controller('NavBarCtrl', function($scope, $location,CotFactory) {
      $scope.isActive = function(viewLocation) {
        return viewLocation === $location.path();
      };
      $scope.reset = function () {
        CotFactory.setCurrentCot(null);
      }
    });
