'use strict';

angular.module('eldoragoApp')
  .controller('FaqCtrl', function ($scope) {

    $scope.selectTheme = function(theme) {
      $scope.themeSelected = theme;
    }

    $scope.removeTheme = function() {
      $scope.themeSelected = null;
    }

  });
