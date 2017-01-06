'use strict';

angular.module('eldoragoApp')
  .controller('NavBarCtrl', function($scope, $location) {
      $scope.isActive = function(viewLocation) {
        return viewLocation === $location.path();
      };
      console.log($location.path());
      console.log("coucou");
    });
