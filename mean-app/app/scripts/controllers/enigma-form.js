angular.module('eldoragoApp')
  .controller('EnigmaFormCtrl', function ($scope, $location, $timeout, $http) {

      
      
    /** Loading **/
    $scope.riddleToCreate = {};
    $scope.createRiddle = function() {
      var newRiddle = $scope.riddleToCreate;
      $http.post(DB_PATH+"riddles", newRiddle).then(function(resp) {
        alert("Enigme crée");
        $scope.riddleToCreate = {};
      }, function(error) {
        alert(error);
        console.dir(error);
      });
    }//createRiddle()

    $scope.photoToCreate = {};
    $scope.createPhoto = function()
    {
        //Demander à flavian !!!!!
        var newPhoto;
        console.log("Défi photo créé  avec name =  " + $scope.photoToCreate.name +" , " + $scope.photoToCreate.target);
    }//createPhoto()

  });
