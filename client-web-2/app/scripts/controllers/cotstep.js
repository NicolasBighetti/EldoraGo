angular.module('eldoragoApp')
  .controller('CotStepCtrl', function ($scope) {
    $scope.isQuest = true;
    $scope.textSwitch = "Voir la fiche descriptive"
    $scope.switchQuest = function() {
      $scope.isQuest = !$scope.isQuest;
      $scope.textSwitch = $scope.isQuest ? "Voir la fiche descriptive" : "Voir la liste des Quêtes";
    };


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


      $scope.select = function(quest) {
          $scope.questSelected = quest;
        };

      $scope.listEnigma = [{
          name: "Quete 1",
          desc: "4 plus 4 ?"
        }, {
          name: "Quete 2",
          desc: "J'ai 2 pieds, 6 jambes, 8 bras, 2 têtes et un oeil, qui suis-je ?"
        }, {
          name: "Quete avec un nom",
          desc: "Oh! Oh! Oh!"
        }, {
          name: "Quete 4",
          desc: "Ah! Ah! Ah!"
        }];
  });
