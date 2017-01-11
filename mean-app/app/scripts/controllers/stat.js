angular.module('eldoragoApp')
  .controller('StatCtrl',  function ($scope, $location, $timeout, $http, $q, $log) {

    $scope.map = {};
    $scope.listName = [];

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
          //Adding name to listName

          var o = {
            value: $scope.markerList[i].name,
            display: $scope.markerList[i].name
        };

          $scope.listName.push(o);

        }



        console.log($scope.listName);

    });

      $scope.displayedCollection = $scope.map.markers;
      $scope.rowCollection = $scope.map.markers;

    };


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

    function searchTextChange(text) {
      $log.info('Text changed to ' + text);
    }

    function selectedItemChange(item) {
      $log.info('Item changed to ' + JSON.stringify(item));
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };

    }


    function newState(state) {
      alert("Sorry! You'll need to create a Constitution for " + state + " first!");
    }

    function loadAll() {
      /*var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
              Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
              Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
              Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
              North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
              South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
              Wisconsin, Wyoming';*/

      return allStates = $scope.listName;

      /*return allStates.split(/, +/g).map( function (state) {
        return {
          value: state.toLowerCase(),
          display: state
        };
      });*/
    }

  });
