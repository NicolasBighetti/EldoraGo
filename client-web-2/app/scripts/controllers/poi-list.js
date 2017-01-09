angular.module('eldoragoApp')
  .controller('PoiListCtrl', function($scope) {

    $scope.isEdited = false;
    $scope.btnMsg = "edit";

    $scope.edit = function () {
      $scope.isEdited = true;
    }

    $scope.save = function () {
      $scope.isEdited = false;
      // Save en BDD
    }

    $scope.map = {
        center: {
            latitude: 50.6278,
            longitude: 3.0583
        },
        zoom: 12,
        markers: [], // array of models to display
        markersEvents: {
            click: function(marker, eventName, model, arguments) {
                $scope.map.window.model = model;
                $scope.map.window.show = true;
            }
        },
        window: {
            marker: {},
            show: false,
            closeClick: function() {
                this.show = false;
            },
            options: {} // define when map is ready
        }
    };

    $scope.listPois = [{
      name: "Monument : La sculpture de Louis XIV",
      image: "../images/louis_xiv.jpg",
      desc: "Cette statue équestre de Louis XIV est une statue équestre en bronze de Louis XIV située sur la place d'Armes devant le château de Versailles. Jusqu'en 2008-2009, elle se trouvait dans la cour d'Honneur."
    }];

    });
