'use strict';

angular.module('eldoragoApp')
  .controller('FaqCtrl', function ($scope) {

    $scope.initFaq = function() {
      $scope.typeQuestSelected = 'riddle';
    }

    /** Boolean **/
    $scope.isSelected = function(type) {
      return $scope.typeQuestSelected === type;
    };

    /** Setter **/
    $scope.selectTheme = function(theme) {
      $scope.themeSelected = theme;
    }

    $scope.selectTypeQuest = function(type) {
      $scope.typeQuestSelected = type;
    }

    /** Remove **/
    $scope.removeTheme = function() {
      $scope.themeSelected = null;
    }

  });
