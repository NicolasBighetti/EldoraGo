/**
 * Created by anthony Loroscio on 09/01/17.
 */

angular.module('eldoragoApp')
  .controller('StatCtrl', function ($scope, $location, $timeout, $http, $q, $log, CotFactory) {

    $scope.map = {};
    $scope.showGraph = false;
    $scope.PoiDetails = false;
    $scope.CotDetails = false;
    $scope.listName = [];
    $scope.listCOTName = [];
    $scope.markerList = [];

    //$scope.CotId = null;
    $scope.stepIdList = [];
    $scope.selectedStepID = null;
    $scope.questList = [];
    $scope.questListID = [];

    $scope.pieChart = false;

    $scope.left = 0;

    $scope.show = function () {
      $scope.showGraph = true;
    };

    $scope.models = [];

    $scope.init = function () {

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
        }
      };

      putMarkers();

    };


    function putMarkers() {

      $http.get(DB_PATH + "pois").then(function (resp) {

        $scope.markerList = resp.data;

        // foreach marker on markerList BDD
        for (var i = 0; i < $scope.markerList.length; i++) {
          //rename _id en id
          $scope.markerList[i].id = $scope.markerList[i]._id;
          $scope.markerList[i].latitude = $scope.markerList[i].coords.latitude;
          $scope.markerList[i].longitude = $scope.markerList[i].coords.longitude;

          //TODO Rename icone en icon
          /*if($scope.markerList[i].id == '5873cae3fd5f5f10002bf7ef') {
           $scope.markerList[i].icon = $scope.markerList[i].icone;
           //$scope.markerList[i].label = $scope.markerList[i].icone;
           }*/

          // adding marker on the map
          $scope.map.markers.push($scope.markerList[i]);


          /*if($scope.markerList[i].id == '5873cae3fd5f5f10002bf7ef'){
           $scope.markerList[i].icone = "http://www.googlemapsmarkers.com/v1/ecea24/";
           $scope.markerList[i].labelcolor = "12";

           /*$http.put(DB_PATH+"pois/"+$scope.markerList[i].id, $scope.markerList[i]).then(function(resp) {
           console.log(resp);


           }, function(error) {
           alert(error);
           });*/

          //}


          var o = {
            id: $scope.markerList[i].id,
            value: $scope.markerList[i].name,
            display: $scope.markerList[i].name,
            left: $scope.markerList[i].labelcolor,
            type: 'POI'
          };

          $scope.listCOTName.push(o);

        }

        //Getting the cot
        $http.get(DB_PATH + "cots").then(function (resp) {

          $scope.cots = resp.data;

          // foreach marker on markerList BDD
          for (var i = 0; i < $scope.cots.length; i++) {

            var o = {
              id: $scope.cots[i]._id,
              value: $scope.cots[i].name,
              display: $scope.cots[i].name,
              type: 'COT'
            };

            $scope.listCOTName.push(o);

          }

        })

      });

    };


    /************** Search *********/
    var self = this;
    self.simulateQuery = false;

    self.simulateQuery = false;
    self.isDisabled = false;

    // list of `state` value/display objects
    //self.states        = $scope.listName;
    self.states = loadAll();
    self.querySearch = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange = searchTextChange;

    self.newState = newState;

    //console.log(self.states );


    // ******************************
    // Internal methods
    // ******************************

    /**
     * Search for states... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch(query) {

      var results = query ? self.states.filter(createFilterFor(query)) : self.states,
        deferred;

      if (self.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () {
          deferred.resolve(results);
        }, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        return results;
      }
    }

    function selectedItemChange(item) {
      $log.info('Item changed to ' + JSON.stringify(item));
      //$scope.showGraph = true;

      var arrPos;

      if (item == null) {
        $scope.showGraph = false;
        $scope.PoiDetails = false;
        $scope.CotDetails = false;
        putMarkers();
        return;
      }

      //Clear the markers currently present on the map execpt the one we selected
      for (j = 0; j < $scope.markerList.length - 1; j++) {
        if ($scope.markerList[j].id != item.id) {
          arrPos = j;
          delete $scope.markerList[j];
        }
      }

      $scope.markerList.slice(0, 1);

      if (item.type == 'POI') {
        $scope.PoiDetails = true;
        //console.log($scope.markerList[arrPos + 1].labelcolor);
        $scope.left = $scope.markerList[arrPos + 1].labelcolor;
        $scope.map.center.latitude = $scope.markerList[arrPos + 1].latitude;
        $scope.map.center.longitude = $scope.markerList[arrPos + 1].longitude;
      } else if (item.type == 'COT') {
        $scope.CotDetails = true;
        $scope.selectedCot = item.id;
      }

    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      //var lowercaseQuery = angular.lowercase(query);

      return function filterFn(state) {
        /*console.log("valeur de state.value : " + state.value);
         console.log("valeur de query : " + query);
         console.log("indexOf : " + state.value.indexOf(query) + " pour " + state.value);*/
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

      var data = [];

      var chart1 = Highcharts.chart('container-chart', {
        chart: {
          /*height: 300,*/
          type: 'column'
        },

        events: {
          click: function (event) {

          }
        },

        plotOptions: {
          series: {
            cursor: 'pointer',
            point: {
              events: {
                click: function (e) {
                  startMinGraph($scope.stepIdList[this.category]);
                }
              }
            }
          }
        },

        title: {
          text: 'Temps moyen passé sur chaque étape',
          //y: 280 //  this to move y-coordinate of title to desired location
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
            /*['étape 1', 23.7],
             ['étape 2', 16.1],
             ['étape 3', 14.2],
             ['étape 4', 14.0],
             ['étape 5', 12.5],
             ['étape 6', 12.1],
             ['étape 7', 11.8],
             ['étape 8', 11.7],
             ['étape 9', 11.1],
             ['étape 10', 11.1],
             ['étape 11', 10.5]*/

          ]

        }]
      });


      //Getting the cot
        var promises = [];

        var p2 = new Promise(function (resolve, reject) {
          $http.get(DB_PATH + "cots/" + $scope.selectedCot).then(function (resp) {

            $scope.stepIdList = resp.data.steps;

            resolve(resp);
          })
        });

        //promises.push();
        p2.then(function (resp) {
          //We get the duration of each step
          for (var i = 0; i < resp.data.steps.length; ++i) {

            promises.push(new Promise(function (resolve, reject) {
              $http.get(DB_PATH + "steps/" + resp.data.steps[i]).then(function (resp1) {
                //console.log(resp1);
                data.push(resp1.data.avg_time);
                //data.push(resp1.data.avg_time);
                resolve(resp1);
              });
            }));
          }

          Promise.all(promises).then(function(result){
            chart1.series[0].setData(data, true);
          });

        });
    }




function startMinGraph(stepId) {

    var cot = {
    _id: $scope.selectedCot,
    stepsO: [],
    pois: []
  };

  CotFactory.setCurrentCot(cot);

  var p2 = new Promise(function (resolve, reject) {

    CotFactory.readCot().then(function (test) {
      //console.log(CotFactory.getCurrentCot());

      //We get all the steps
      var questRes = CotFactory.getCurrentCot().stepsO;

      $scope.questListID = questRes;

      //We pick the right step
      for(var i = 0;  i < questRes.length; i++){
        if (questRes[i]._id == stepId){
          questRes = questRes[i].questsO;
        }
      }


      //We create the object corresponding to the quests
      for(var i = 0;  i < questRes.length; i++){

        var o = {
          id: questRes[i]._id,
          real: questRes[i].avg_time,
          expected: questRes[i].est_time,
          number: i

        };

        $scope.questList.push(o);
      }

      resolve(test);

    })});


  p2.then(function () {

    var charts2 = Highcharts.chart('container', {
      data: {
        table: 'datatable'
      },
      chart: {
        type: 'column'
      },
      title: {
        text: 'Temps moyen par quête'
      },
      yAxis: {
        allowDecimals: false,
        title: {
          text: 'Units'
        }
      },
      plotOptions: {
        series: {
          cursor: 'pointer',
          point: {
            events: {
              click: function () {
                $scope.startMinGraph2($scope.questListID[this.category]);
                //console.log($scope.questListID[this.category]);
                $scope.selectedStepID = $scope.questListID[this.category]._id;
              }
            }
          }
        }
      },
      /*tooltip: {
        formatter: function () {
          return '<b>' + this.series.name + '</b><br/>' +
            this.point.y + ' ' + this.point.name.toLowerCase();
        }
      }*/
    });

  });






$scope.startMinGraph2 = function (questId) {


  $scope.pieChart = true;
  $scope.$apply();

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
        y: questId.questsO[0].success
      }, {
        name: 'Passée',
        y: 100 - questId.questsO[0].success,
        sliced: true,
        selected: true
      }]
    }]
  });

}

};


 $scope.editQuest = function(){

   //console.log($scope.selectedStepID);


   var cot = {
     _id: $scope.selectedCot,
     stepsO: [],
     stepSelected: $scope.selectedStepID,
     pois: []
   };



   CotFactory.setCurrentCot(cot);
   CotFactory.readCot().then(function () {
     CotFactory.setStep($scope.selectedStepID);
     $location.path('/cot');
   });

 }


});

