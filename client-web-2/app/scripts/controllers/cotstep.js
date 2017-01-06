angular.module('eldoragoApp')
  .controller('CotStepCtrl', function ($scope) {

      $scope.map = {
          center: {
              latitude: $scope.lat,
              longitude: $scope.lon
          },
          zoom: 12,
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
  });
