/**
 * Created by anthony Loroscio on 09/01/17.
 */

angular.module('eldoragoApp')
  .controller('StatCtrl',  function ($scope, $location, $timeout, $http, $q, $log) {

    $scope.map = {};
    $scope.showGraph = false;
    $scope.listName = [];
    $scope.listCOTName = [];

    $scope.models = [];

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
          }
          /*options: {
            //icon:'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
           }*/ // define when map is ready
        }
      };

      $scope.map.options = {
        cluster: {
          minimumClusterSize : 10,
          zoomOnClick: true,
          styles: [{
            url: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
            width:60,
            height:60,
            textColor: 'white',
            textSize: 14,
            fontFamily: 'Open Sans'
          }],
          averageCenter: true,
          clusterClass: 'cluster-icon'
        }
      };


      $http.get(DB_PATH+"pois").then(function(resp) {

        $scope.markerList = resp.data;

        // foreach marker on markerList BDD
        for (var i = 0; i < $scope.markerList.length; i++) {
          //rename _id en id
          $scope.markerList[i].id = $scope.markerList[i]._id;
          $scope.markerList[i].latitude = $scope.markerList[i].coords.latitude;
          $scope.markerList[i].longitude = $scope.markerList[i].coords.longitude;
          $scope.markerList[i].icon = 'http://www.googlemapsmarkers.com/v1/009900/';
          // adding marker on the map
          $scope.map.markers.push($scope.markerList[i]);
          //Adding name to listName

          console.log($scope.map.markers);

          var o = {
            value: $scope.markerList[i].name,
            display: $scope.markerList[i].name
        };

          $scope.listName.push(o);

        }

        //Getting the cot

        $http.get(DB_PATH+"cots").then(function(resp) {

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

      if(item == null){
        $scope.showGraph = false;
      }

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

        events: {
          click: function(event) {

          }
        },

        plotOptions: {
          series: {
            cursor: 'pointer',
            point: {
              events: {
                click: function () {
                  startMinGraph();
                }
              }
            }
          }
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

          ]

        }]
      });

    };


    function startMinGraph() {

      Highcharts.chart('min-container-chart', {
        chart: {
          /*height: 200,
          width: 330,*/
          type: 'column'
        },

        events: {
          click: function(event) {
            alert (
              'x: '+ Highcharts.dateFormat('%Y-%m-%d', event.xAxis[0].value) +', ' +
              'y: '+ event.yAxis[0].value
            );
          }
        },

        plotOptions: {
          series: {
            cursor: 'pointer',
            point: {
              events: {
                click: function () {
                  startMinGraph2();
                }
              }
            }
          }
        },

        title: {
          text: 'Temps par énigme'
          //y: 185 //  this to move y-coordinate of title to desired location
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
            ['énigme 1', 8],
            ['énigme 2', 7],
            ['énigme 3', 6],
            ['énigme 4', 14],
            ['énigme 5', 7]

          ]

        }]
      });
    };


    function startMinGraph2() {

      Highcharts.chart('min-container-chart2', {
        chart: {
          /*height: 200,
          width: 330,*/
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        title: {
          text: 'Taux de réussite'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',
              style: {
                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
              }
            }
          }
        },
        series: [{
          name: 'Validé',
          colorByPoint: true,
          data: [{
            name: 'Validé',
            y: 60
          }, {
            name: 'Passée',
            y: 40,
            sliced: true,
            selected: true
          }]
        }]
      });

    }





  });
