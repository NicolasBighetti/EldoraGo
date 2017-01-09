angular.module('eldoragoApp')
  .controller('CotListCtrl', function($scope) {

    $scope.listCots = [{
      name: "Chasse aux trésors du port"
      },
      {
        name: "Le vieux Chateau"
      }
    ];
  });
