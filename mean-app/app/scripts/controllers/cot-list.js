angular.module('eldoragoApp')
  .controller('CotListCtrl', function($scope, $http, $location, CotFactory) {

    /** Loading **/
    $scope.init = function() {
      $scope.getCotList();
    };

    $scope.getCotList = function() {
      $http.get(DB_PATH+"cots").then(function(resp) {
        $scope.cotList = resp.data;
      });
    };
    (function () {
      $scope.$watch(function () {
        return CotFactory.getCurrentCot();
      }, function (newVal, oldValue) {
        console.log('CHANGED');
        console.log(newVal);
        $scope.cotSelected=CotFactory.getCurrentCot();
      });
    }());
    $scope.editCot = function(cot) {


      CotFactory.setCurrentCot(cot);

      console.log('Edit cot');
      $scope.cotSelected = CotFactory.getCurrentCot();
/*      console.log(CotFactory.getCurrentCot());

      console.log('Edit cot scope');
      console.log($scope.cotSelected);

      console.log('changed Edit cot scope');
      console.log($scope.cotSelected);
      console.log('changed Edit cot get');
      console.log(CotFactory.getCurrentCot());*/

      $location.path("/cot");
    };

    $scope.removeCot = function(id) {
      $http.delete(DB_PATH+"cots/" + id).then(function(resp) {
        console.log("cot " + id + " delete");
        var removedCot = resp.data;

        $scope.getCotList();

        // delete en cascade -- steps
        for (var i; i < removedCot.steps.length; i++) {
          $scope.removeStep(removedCot.steps[i]);
          // $http.delete(DB_PATH+"steps/" + removedCot.steps[i]).then(function(resp) {
          //   console.log("step " + id + " delete");
          //   var removedStep = resp.data;
          //
          //   // delete en cascade -- quests
          //   for (var j; j < removedStep.quests.length; j++) {
          //     $http.delete(DB_PATH+"quests/" + id).then(function(resp) {
          //       console.log("quest " + id + " delete");
          //     }, function(error) {
          //       alert(error);
          //     });
          //   }
          // }, function(error) {
          //   alert(error);
          // });
        }

        $scope.getCotList();
      }, function(error) {
        alert(error);
      });
    }

    $scope.removeStep = function(id) {
      $http.delete(DB_PATH+"steps/" + id).then(function(resp) {
        console.log("cot " + id + " delete");
        var removedStep = resp.data;
        // delete en cascade -- quests
          for (var j; j < removedStep.quests.length; j++) {
            $scope.removeQuest(removedStep.quests[i]);
          }

      }, function(error) {
        alert(error);
      });
    }

    $scope.removeQuest = function(id) {
      $http.delete(DB_PATH+"quests/" + id).then(function(resp) {
        console.log("quest " + id + " delete");

        // $scope.getAllQuestList();
      }, function(error) {
        alert(error);
      });
    }


    // $scope.getAllStepList = function() {
    //     $http.get(DB_PATH+"steps/").then(function(resp) {
    //       $scope.stepList = resp.data;
    //     }, function(error) {
    //       alert(error);
    //     });
    // }

    // $scope.getAllQuestList = function() {
    //     $http.get(DB_PATH+"quests/").then(function(resp) {
    //       $scope.questList = resp.data;
    //     }, function(error) {
    //       alert(error);
    //     });
    // }
  });
