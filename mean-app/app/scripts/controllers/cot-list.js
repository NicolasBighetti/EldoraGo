angular.module('eldoragoApp')
  .controller('CotListCtrl', function($scope, $http) {

    $scope.init = function() {
      $scope.getCotList();
    }

    $scope.getCotList = function() {
      $http.get("/api/cots").then(function(resp) {
        $scope.listCots = resp.data;
      });
    }

    $scope.removeCot = function(id) {
      $http.delete("/api/cots/" + id).then(function(resp) {
        console.log("cot " + id + "delete");
        $scope.getCotList();
      }, function(error) {
        alert(error);
      });
    }


  });
