angular.module('eldoragoApp')
  .controller('EnigmaFormCtrl', function ($scope, $location, $timeout, $http) {



    /** Loading **/
    $scope.initForm = function() {
      $scope.riddleToCreate = {};
      $scope.riddleToCreate.theme = 'culture';
    }
    $scope.createRiddle = function() {
        var newRiddle = $scope.riddleToCreate;
        $http.post(DB_PATH+"riddles", newRiddle).then(function(resp) {
        $scope.riddleToCreate = {};
      }, function(error) {
        console.error(error);
      });
    }//createRiddle()

    // $scope.photoToCreate = {};
    // $scope.createPhoto = function()
    // {
    //     //Demander à flavian !!!!!
    //     var newPhoto;
    //     console.log("Défi photo créé  avec name =  " + $scope.photoToCreate.name +" , " + $scope.photoToCreate.target);
    // }//createPhoto()

    $scope.selectRtype = function(rtype) {
      $scope.riddleToCreate.rtype = rtype;
    }

    $scope.unSelectRtype = function() {
      $scope.riddleToCreate.rtype = null;
    }

    /** Boolean **/
    $scope.isSelectedRtype = function(rtype) {
      return $scope.riddleToCreate.rtype === rtype;
    };

  });
