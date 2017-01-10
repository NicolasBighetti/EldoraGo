angular.module('eldoragoApp')
  .controller('CotListCtrl', function($scope, $http, $location, CotFactory) {

    /** Loading **/
    $scope.init = function() {
      $scope.getCotList();
    }

    $scope.getCotList = function() {
      $http.get("https://eldorago.herokuapp.com/api/cots").then(function(resp) {
        $scope.cotList = resp.data;
      });
    }

    $scope.editCot = function(cot) {
      CotFactory.setCurrentCot(cot);
      $location.path("/cot");
    }

    $scope.removeCot = function(id) {
      $http.delete("https://eldorago.herokuapp.com/api/cots/" + id).then(function(resp) {
        console.log("cot " + id + " delete");
        var removedCot = resp.data;

        $scope.getCotList();

        // delete en cascade -- steps
        for (var i; i < removedCot.steps.length; i++) {
          $http.delete("https://eldorago.herokuapp.com/api/steps/" + removedCot.steps[i]).then(function(resp) {
            console.log("step " + id + " delete");
            var removedStep = resp.data;

            // delete en cascade -- quests
            for (var j; j < removedStep.quests.length; j++) {
              $http.delete("https://eldorago.herokuapp.com/api/quests/" + id).then(function(resp) {
                console.log("quest " + id + " delete");
              }, function(error) {
                alert(error);
              });
            }
          }, function(error) {
            alert(error);
          });
        }

        $scope.getCotList();
      }, function(error) {
        alert(error);
      });
    }

    $scope.removeStep = function(id) {
      $http.delete("https://eldorago.herokuapp.com/api/steps/" + id).then(function(resp) {
        console.log("cot " + id + " delete");
        $scope.getAllStepList();
      }, function(error) {
        alert(error);
      });
    }

    $scope.removeQuest = function(id) {
      $http.delete("https://eldorago.herokuapp.com/api/quests/" + id).then(function(resp) {
        console.log("quest " + id + " delete");

        $scope.getAllQuestList();
      }, function(error) {
        alert(error);
      });
    }


    // $scope.getAllStepList = function() {
    //     $http.get("https://eldorago.herokuapp.com/api/steps/").then(function(resp) {
    //       $scope.stepList = resp.data;
    //     }, function(error) {
    //       alert(error);
    //     });
    // }

    // $scope.getAllQuestList = function() {
    //     $http.get("https://eldorago.herokuapp.com/api/quests/").then(function(resp) {
    //       $scope.questList = resp.data;
    //     }, function(error) {
    //       alert(error);
    //     });
    // }
  });
