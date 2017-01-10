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

    /*$scope.isDisabled = true;
    $scope.simulateQuery = false;
    $scope.isDisabled    = false;
    $scope.querySearch   = querySearch;*/

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


      $http.get("/api/pois").then(function(resp) {


        $scope.markerList = resp.data;

        // foreach marker on markerList BDD
        for (var i = 0; i < $scope.markerList.length; i++) {
          //rename _id en id
          $scope.markerList[i].id = $scope.markerList[i]._id;
          // adding marker on the map
          $scope.map.markers.push($scope.markerList[i]);
        }

        console.log($scope.map.markers);
        // $scope.$apply();

      /*console.log($scope.map.markers);

      console.log("previous");
      console.log($scope.markerList);*/
      /*$timeout(function() {

        for (var i = 0; i < 3; i++) {
          //$scope.markerList[i].id = $scope.markerList[i].id;
          $scope.map.markers.push($scope.poiList[i]);
          console.log($scope.poiList[i]);
          //console.log($scope.map.markers);
          $scope.$apply();
        }
        //console.log("Done");
      }, 0);*/
    });



      //var self = this;
      $scope.data = [{name: "Musé jean Paul", pers: 50, time: 20}, {name: "Statue jean louis", pers: 10, time: 24}, {name: "Frank Provot", pers: 30, time: 5} /*,*/];
      //self.tableParams = new NgTableParams({}, { dataset: data});
      $scope.displayedCollection = $scope.data;
      $scope.rowCollection = $scope.data;



      /*$timeout(function() {

        for (var i = 0; i < 3; i++) {
          //$scope.markerList[i].id = $scope.markerList[i].id;
          $scope.map.markers.push($scope.markerList[i]);
          console.log($scope.poiList[i]);
          //console.log($scope.map.markers);
          $scope.$apply();
        }
      //console.log("Done");
      }, 0);*/
    };



    //Table of POI
    /*$scope.rowCollection = [
      {firstName: 'Laurent', lastName: 'Renard', birthDate: new Date('1987-05-21'), balance: 102, email: 'whatever@gmail.com'},
      {firstName: 'Blandine', lastName: 'Faivre', birthDate: new Date('1987-04-25'), balance: -2323.22, email: 'oufblandou@gmail.com'},
      {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27'), balance: 42343, email: 'raymondef@gmail.com'}
    ];*/

  });
