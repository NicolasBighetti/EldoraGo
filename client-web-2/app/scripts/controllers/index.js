//IndexCtrl

angular.module('eldoragoApp')
  .controller('IndexCtrl', function ($scope) {
      $scope.lat = 0;
      $scope.lon = 0;

      $scope.updateLocation = function (newlat, newlon) {
          console.log("Updated location with : " + newlat + " / "+ newlon);
          $scope.lat = newlat;
          $scope.lon = newlon;
      };
  });