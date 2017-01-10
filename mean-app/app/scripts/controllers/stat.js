/**
 * Created by anthony Loroscio on 09/01/17.
 */

angular.module('eldoragoApp')
  .controller('StatCtrl',  function ($scope, $location, $timeout, $http, $q, $log) {

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

    $scope.poiList;


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


      $http.get(DB_PATH+"pois").then(function(resp) {


        $scope.markerList = resp.data;

        // foreach marker on markerList BDD
        for (var i = 0; i < $scope.markerList.length; i++) {
          //rename _id en id
          $scope.markerList[i].id = $scope.markerList[i]._id;
          // adding marker on the map
          $scope.map.markers.push($scope.markerList[i]);
        }

        console.log($scope.map.markers);

    });



      //var self = this;
      $scope.data = [{name: "Musé jean Paul", pers: 50, time: 20}, {name: "Statue jean louis", pers: 10, time: 24}, {name: "Frank Provot", pers: 30, time: 5} /*,*/];
      //self.tableParams = new NgTableParams({}, { dataset: data});
      $scope.displayedCollection = $scope.map.markers;
      $scope.rowCollection = $scope.map.markers;

    };


  });
