'use strict';

angular.module('eldoragoApp')
  .controller('FaqCtrl', function ($scope) {

    $scope.initFaq = function() {
      $scope.typeQuestSelected = {};
      $scope.themeSelected = {};
      $scope.typeQuestSelected.rtype = 'riddle';
    }

    /** Boolean **/
    $scope.isSelected = function(type) {
      return $scope.typeQuestSelected.rtype === type;
    };

    /** Setter **/
    $scope.selectTheme = function(theme) {
      $scope.themeSelected.theme = theme;
    }

    $scope.selectTypeQuest = function(type) {
      $scope.typeQuestSelected.rtype = type;
      $scope.unSelectRiddle();
    }

    /** Remove **/
    $scope.removeTheme = function() {
      $scope.themeSelected.theme = null;
      $scope.unSelectRiddle();
    }

    // $scope.select = function (riddle) {
    //   $scope.riddleSelected = riddle;
    // };


  });
