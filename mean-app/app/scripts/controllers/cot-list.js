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
  });
