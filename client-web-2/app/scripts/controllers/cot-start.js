 

angular.module('eldoragoApp')
  .controller('CotStartCtrl', function ($scope) {
      $scope.TreatAdress = function (lien) {
          console.log("Le LIEN : " + lien);
      };
      
  });