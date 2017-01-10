/**
 * Created by anthony Loroscio on 09/01/17.
 */

angular.module('eldoragoApp')
  .controller('StatCtrl', function ($scope, $location, $timeout) {
    $scope.map = {};
    $scope.init = function(){

      $scope.active = true;

      $scope.map = {
        center: {
          latitude: 43.623847,
          longitude: 7.087582
        },
        zoom: 12,
        disableDefaultUI: true,
        markers: [], // array of models to display
        markersEvents: {
          click: function (marker, eventName, model, arguments) {
            $scope.map.window.model = model;
            $scope.map.window.show = true;
          }
        },
        window: {
          marker: {},
          show: false,
          closeClick: function () {
            this.show = false;
          },
          options: {} // define when map is ready
        }
      };

      $scope.markerList = [
        {
          name:"Musé jean charles",
          id: 0,
            latitude: 43.55651037504757,
            longitude: 6.062621846795082

        },
        {
          name: "Statue de louis 16",
          id: "1",
            latitude: 43.897892391257976,
            longitude: 4.678344503045082
        },

        {
          name: "Resto U",
          id: "2",
            latitude: 43.45859799999999,
            longitude: 5.249702999999954

        }
      ];

      $timeout(function() {

        for (var i = 0; i < 3; i++) {
          //$scope.markerList[i].id = $scope.markerList[i].id;
          $scope.map.markers.push($scope.markerList[i]);
          console.log($scope.markerList[i]);
          console.log($scope.map.markers);
          $scope.$apply();
        }
      //console.log("Done");
      }, 0);
    };

  });
