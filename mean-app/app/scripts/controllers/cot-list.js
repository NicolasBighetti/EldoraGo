angular.module('eldoragoApp')
  .controller('CotListCtrl', function($scope, $http) {

    // $scope.listCots = [{
    //   name: "Chasse aux trésors du port"
    //   },
    //   {
    //     name: "Le vieux Chateau"
    //   }
    // ];

    $http.get("https://eldorago.herokuapp.com/api/cots").then(function(resp) {
      $scope.listCots = resp.data;
    });

  });
