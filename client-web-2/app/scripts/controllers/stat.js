/**
 * Created by anthony Loroscio on 09/01/17.
 */

angular.module('eldoragoApp')
  .controller('StatCtrl',  function ($scope, $location, $timeout, $http, $q, $log) {

    $scope.map = {};
    $scope.showGraph = false;
    $scope.listName = [];
    $scope.listCOTName = [];

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


      $http.get("https://eldorago.herokuapp.com/api/pois").then(function(resp) {

        $scope.markerList = resp.data;

        // foreach marker on markerList BDD
        for (var i = 0; i < $scope.markerList.length; i++) {
          //rename _id en id
          $scope.markerList[i].id = $scope.markerList[i]._id;
          // adding marker on the map
          $scope.map.markers.push($scope.markerList[i]);
          //Adding name to listName

          var o = {
            value: $scope.markerList[i].name,
            display: $scope.markerList[i].name
        };

          $scope.listName.push(o);

        }

        //Getting the cot

        $http.get("https://eldorago.herokuapp.com/api/cots").then(function(resp) {

          $scope.cots = resp.data;

          // foreach marker on markerList BDD
          for (var i = 0; i < $scope.cots.length; i++) {

            var o = {
              value: $scope.cots[i].name,
              display: $scope.cots[i].name
            };

            $scope.listCOTName.push(o);

          }


          //console.log($scope.listCOTName);
        })

    });

      $scope.displayedCollection = $scope.map.markers;
      $scope.rowCollection = $scope.map.markers;

    };


    /************** Search *********/
    var self = this;
    self.simulateQuery = false;

    self.simulateQuery = false;
    self.isDisabled    = false;

    // list of `state` value/display objects
    //self.states        = $scope.listName;
    self.states        = loadAll();
    self.querySearch   = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange   = searchTextChange;

    self.newState = newState;

    console.log(self.states );



    // ******************************
    // Internal methods
    // ******************************

    /**
     * Search for states... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch (query) {

      var results = query ? self.states.filter( createFilterFor(query) ) : self.states,
        deferred;

      if (self.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        return results;
      }
    }

    function selectedItemChange(item) {
      $log.info('Item changed to ' + JSON.stringify(item));
      $scope.showGraph = true;
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      //var lowercaseQuery = angular.lowercase(query);

      return function filterFn(state) {
        console.log("valeur de state.value : " + state.value);
        console.log("valeur de query : " + query);
        console.log("indexOf : " + state.value.indexOf(query) + " pour " + state.value);
        return (state.value.indexOf(query) === 0);
      };

    }

    function searchTextChange(text) {
      $log.info('Text changed to ' + text);
    }


    function newState(state) {
      alert("Désolé, aucune COT trouvée");
    }

    function loadAll() {

      allStates = $scope.listCOTName;
      return allStates;

      /*return allStates.split(/, +/g).map( function (state) {
        return {
          value: state.toLowerCase(),
          display: state
        };
      });*/
    }




    /************** CHARTS *********/
    $scope.startGraph = function () {

      Highcharts.chart('container-chart', {
        chart: {
          height: 300,
          type: 'column'
        },
        title: {
          text: 'Temps moyen passé sur chaque étape',
          y: 280 //  this to move y-coordinate of title to desired location
        },
        xAxis: {
          type: 'étapes',
          labels: {
            rotation: -45,
            style: {
              fontSize: '13px',
              fontFamily: 'Verdana, sans-serif'
            }
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Temps moyen en minutes'
          }
        },
        legend: {
          enabled: false
        },
        tooltip: {
          pointFormat: 'temps: <b>{point.y:.1f} minutes</b>'
        },
        series: [{
          name: 'Population',
          data: [
            ['étape 1', 23.7],
            ['étape 2', 16.1],
            ['étape 3', 14.2],
            ['étape 4', 14.0],
            ['étape 5', 12.5],
            ['étape 6', 12.1],
            ['étape 7', 11.8],
            ['étape 8', 11.7],
            ['étape 9', 11.1],
            ['étape 10', 11.1],
            ['étape 11', 10.5]

          ],
          dataLabels: {
            enabled: true,
            rotation: -90,
            color: '#FFFFFF',
            align: 'right',
            format: '{point.y:.1f}', // one decimal
            y: 10, // 10 pixels down from the top
            style: {
              fontSize: '13px',
              fontFamily: 'Verdana, sans-serif'
            }
          }
        }]
      });
    }

  });
