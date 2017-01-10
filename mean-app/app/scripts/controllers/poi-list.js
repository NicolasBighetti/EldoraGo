angular.module('eldoragoApp')
  .controller('PoiListCtrl', function($scope, $http) {

    $scope.btnMsg = "edit";

    $scope.edit = function() {
      $scope.isEdited = true;
    }

    $scope.save = function() {
      // Save en BDD
      $http.put("/api/pois/"+$scope.poiSelected._id, $scope.poiSelected).then(function(resp) {
        console.log(resp);
        $scope.isEdited = false;

      }, function(error) {
        alert(error);
      });
    }

    $scope.map = {
      center: {
        latitude: 44,
        longitude: 6
      },
      zoom: 7,
      markers: [],
      events: {
        click: function(map, eventName, originalEventArgs) {
          var e = originalEventArgs[0];
          console.log(e);
          var lat = e.latLng.lat(),
            lon = e.latLng.lng();
        }
      }
    };


    /** Get de la BDD **/
    $http.get("/api/pois").then(function(resp) {
      $scope.markerList = resp.data;
      console.log($scope.markerList);

      // foreach marker on markerList BDD
      for (var i = 0; i < $scope.markerList.length; i++) {
        //rename _id en id
        $scope.markerList[i].id = $scope.markerList[i]._id;
        // adding marker on the map
        $scope.map.markers.push($scope.markerList[i]);
        // console.log($scope.markerList[i]);
      }
      // console.log($scope.map.markers);
      // $scope.$apply();

    });

    /** Action Cliquer **/
    $scope.marker = {
      events: {
        click: function(marker, eventName, args) {
          //$('#interestMarker').modal('show');
          //$scope.open();
          //console.log(marker.position.lat() +" -- "+ marker.position.lng());
          console.log("Marker clicked ! ");

          console.log("$scope.markerList.length"+ $scope.markerList.length);
          for (var i = 0; i < $scope.markerList.length ; i++) {
            if ($scope.markerList[i].id === marker.key) {
              $scope.poiSelected = $scope.markerList[i];
            }
          }
          console.log($scope.poiSelected);
        }
      }
    };


    /*** BDD Mocked ***/
    $scope.listPois = [{
      name: "Monument : La sculpture de Louis XIV",
      image: "../images/louis_xiv.jpg",
      desc: "Cette statue équestre de Louis XIV est une statue équestre en bronze de Louis XIV située sur la place d'Armes devant le château de Versailles. Jusqu'en 2008-2009, elle se trouvait dans la cour d'Honneur."
    }];

  });
