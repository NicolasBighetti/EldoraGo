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



    $scope.editCot = function(cot) {
      console.log('edit cot');
      CotFactory.setCurrentCot(cot);
      $location.path("/cot");
    };

    $scope.removeCot = function (ind) {
      CotFactory.setCurrentCot($scope.cotList[ind]);
      
      CotFactory.readCot().then(
        function(ok){
          CotFactory.deleteCot().then(
            function (ok) {
              $scope.cotList.splice(ind, 1);
            },function (err) {
              console.error('error in deleting '+err);
            });
        });
    };
     /*function(id) {
      $http.delete(DB_PATH+"cots/" + id).then(function(resp) {
        console.log("cot " + id + " delete");
        var removedCot = resp.data;
        console.log('removed cot');
        console.dir(resp.data);

        // delete en cascade -- steps
        for (var i; i < removedCot.steps.length; i++) {
          $scope.removeStep(removedCot.steps[i]);
        }

      }, function(error) {
        console.error(error);
      });
    };

    /!*$scope.removeStep = function(id) {
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
     };*!/
*/
/*    $scope.removeQuest = function(id) {
      $http.delete(DB_PATH+"quests/" + id).then(function(resp) {
        console.log("quest " + id + " delete");

        // $scope.getAllQuestList();
      }, function(error) {
        alert(error);
      });
    }*/
  });
