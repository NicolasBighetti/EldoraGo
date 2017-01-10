angular.module('eldoragoApp')
  .controller('EnigmaFormCtrl', function($scope, $location, $timeout, $http) {

    /** Loading **/
    $scope.riddleToCreate = {};
    $scope.createRiddle = function() {
      var newRiddle = $scope.riddleToCreate;
      $http.post("https://eldorago.herokuapp.com/api/riddles", newRiddle).then(function(resp) {
        alert("Enigme crée");
        $scope.riddleToCreate = {};
      }, function(error) {
        alert(error);
        console.dir(error);
      });
    }

  });
