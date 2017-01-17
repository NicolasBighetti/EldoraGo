angular.module('eldoragoApp')
  .controller('CotStepCtrl', function ($scope, $location, $timeout, $http, CotFactory) {


    (function () {
      $scope.$watch(function () {
        return CotFactory.getCurrentCot();
      }, function (newVal, oldValue) {
        console.log('CHANGED 2');

        console.log(newVal);
        if(newVal)
          $scope.cotSelected = CotFactory.getCurrentCot();
      });
    }());

    $scope.removeQuest = CotFactory.deleteQuest;


    /**  Loading **/
    $scope.init = function () {
      console.log('init');

      $scope.getRiddleList();
      $scope.getMarkerList();
      console.log('init: object from fact :');
      console.log(CotFactory.getCurrentCot());


      // si on vient de la page cot-list
      if (CotFactory.getCurrentCot()) {


        //charger la cot
        CotFactory.readCot().then(function (res) {
          console.log('Cot with objects and ids');
          console.dir($scope.cotSelected);
          //$scope.selected = CotFactory.getCurrentCot();
        },function (error) {
          console.error(error);
        });

        //$scope.getStepList();
      }
    };


    //test functions
    $scope.showFullCot = function () {
      
      $scope.cotSelected = CotFactory.getCurrentCot();
    };
    $scope.postCot = function () {
      CotFactory.updateCot().then(function () {
        console.log('after U COT')
      });
    };


    /** Show **/
    $scope.isStart = true;


    /** Form **/
    //$scope.questList = CotFactory.getCurrentCot().questsO;

    /** Start **/
    $scope.TreatAdress = function (lien) {

      $scope.init();

      console.log("Le LIEN : " + lien);
      var geocoder = new google.maps.Geocoder();
      console.log('geoCode');
      geocoder.geocode({
        "address": lien
      }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
          var location = results[0].geometry.location;
          console.log("LOCATION in the Treat-Address (cotstep controller): " + location);

          $scope.updateLocation(location.lat() + 0.25, location.lng() - 0.5);
          $scope.isStart = false;

          window.setTimeout(function(){
            console.log('print 0');
            google.maps.event.trigger($scope.map, 'resize');
          },100);

          console.log('print');
        }
      });

      CotFactory.createCot().then(function () {

        $scope.cotSelected = CotFactory.getCurrentCot();


      },function (code) {
          console.error(code);
      });



    };


    $scope.updateLocation = function (newlat, newlon) {
      $scope.map.center.latitude = newlat;
      $scope.map.center.longitude = newlon;
      console.log("Updated location with : " + $scope.map.center.latitude + " / " + $scope.map.center.longitude);
      //Center the map !!!!
      // $scope.map.center = new google.maps.LatLng(newlat, newlon);
    };

    //valeurs en dur ?
    $scope.lat = 44;
    $scope.lon = 6;


    $scope.map = {
      showTraffic: true,
      showBicycling: true,
      showWeather: true,
      center: {
        latitude: $scope.lat,
        longitude: $scope.lon
      },
      zoom: 10,
      markers: [],
      events: {
        click: function (map, eventName, originalEventArgs) {
          var e = originalEventArgs[0];
          console.log(e);
          var lat = e.latLng.lat(),
            lon = e.latLng.lng();
        }

      } //marker
    };


    $scope.windowOpt = {
      show: false
    };

    function displayWindowPoi(poi) {
      console.log('display win '+$scope.poiSelected.name);
      console.log(poi);
      console.log('display win 2');
      console.log($scope.poiSelected);

      //  windowOpt.position.lat = $scope.poiSelected.latitude;
    //  windowOpt.position.lon = $scope.poiSelected.longitude;
      $scope.windowOpt.show = true;
    }


    $scope.showWindow = function() {
      $scope.windowOpt.show = true;
    };

    $scope.addStep = function () {
      var num = CotFactory.getCurrentCot().stepsO.length + 1;

      var newStep = {
        name: randomName() + '',
        //TODO random desc
        desc: randomName() + num,
        questsO: [],
        quests: []

      };
      CotFactory.getCurrentCot().stepsO.push(newStep);

    };

    $scope.marker = {
      events: {
        click: function (marker, eventName, args) {

          //$('#interestMarker').modal('show');
          //$scope.open();
          //console.log(marker.position.lat() +" -- "+ marker.position.lng());
          console.log("Marker clicked ! ");

          //$scope.associateStepPoi(step, poi);
          console.log("$scope.markerList.length" + $scope.markerList.length);

          for (var i = 0; i < $scope.markerList.length; i++) {
            if ($scope.markerList[i].id === marker.key) {
              $scope.poiSelected = $scope.markerList[i];
              if($scope.windowOpt.show){
                $scope.windowOpt.show = false;
              } else {
                displayWindowPoi();
              }
            }
          }
          console.log($scope.poiSelected);
          
          //windo
        }
      }
    };


    /** Get Marker de la BDD **/
    $scope.poiListId = [];

    $scope.getMarkerList = function () {

      $http.get(DB_PATH + "pois").then(function (resp) {


        $scope.markerList = resp.data;

        // foreach marker on markerList BDD
        for (var i = 0; i < $scope.markerList.length; i++) {
          //rename _id en id
          $scope.markerList[i].id = $scope.markerList[i]._id;
          // rename latitude / longitude
          $scope.markerList[i].latitude = $scope.markerList[i].coords.latitude;
          $scope.markerList[i].longitude = $scope.markerList[i].coords.longitude;

          if ($scope.poiListId.indexOf($scope.markerList[i]._id) >= 0) {
            $scope.markerList[i].icon = 'http://www.googlemapsmarkers.com/v1/009900/';
          }
          // adding marker on the map
          $scope.map.markers.push($scope.markerList[i]);
        }
        // $scope.$apply();


      });
    };


    $scope.getPoiList = function (step) {
      $scope.poiList = [];
      $scope.poiListId = [];
      for (var i = 0; i < step.quests.length; i++) {
        $http.get(DB_PATH + "quests/" + step.quests[i]).then(function (resp) {
          var poi_id = resp.data.poi;
          if (poi_id != undefined) {
            $http.get(DB_PATH + "pois/" + poi_id).then(function (resp) {
              $scope.poiList.push(resp.data);
              $scope.poiListId.push(resp.data._id);

            }, function (error) {
              alert(error);
            });
          }
        }, function (error) {
          alert(error);
        }).then(function (resp) {
          // si on a des quetes, apres avoir recup les pois on appelle getMarkerList
          $scope.getMarkerList();
        });
      }

      // si pas de quete on appelle getMarkerList
      if (step.quests.length == 0) {
        $scope.getMarkerList();
        console.log('end getPoiList sans quetes');

      }
    };

    $scope.getRiddleList = function () {
      $http.get(DB_PATH + "riddles").then(function (resp) {
        $scope.riddleList = resp.data;
      }, function (error) {
        alert(error);
      });

    };

    //TODO Fact Removes a step
    $scope.RemoveStep = CotFactory.deleteStep;


    /** STEP **/
    $scope.isQuest = true;
    $scope.textSwitch = "Voir la fiche descriptive";
    $scope.switchQuest = function () {
      $scope.isQuest = !$scope.isQuest;
      $scope.textSwitch = $scope.isQuest ? "Voir la fiche descriptive" : "Voir la liste des Quêtes";
    };

    $scope.select = function (riddle) {
      $scope.riddleSelected = riddle;
    };

    /** Remove **/
    $scope.unSelectRiddle = function() {
      $scope.riddleSelected = null;
    };

    /** Call in FaqCtrl when changing theme **/
    $scope.selectQuest = function (quest) {
      $scope.questSelected = quest;
    };


// Ajoute dans la liste temporaire le POI à mettre en valeur
    $scope.addPoiList = function () {

      var poi = $scope.poiSelected;

      // Si pas déjà dans la liste
      if ($scope.cotSelected.pois.indexOf(poi) < 0) {

        if(!poi){
          console.error('No poi Sel to add');
          return;
        }
        poi.id = poi._id;
        // rename latitude / longitude
        poi.latitude = poi.coords.latitude;
        poi.longitude = poi.coords.longitude;

        poi.icon = 'http://www.googlemapsmarkers.com/v1/009900/';

        $scope.cotSelected.pois.push(poi);

        // adding marker on the map
        $scope.map.markers.push(poi);
      } else {
        console.log("POI déjà dans la liste");
        poi.icon = 'http://www.googlemapsmarkers.com/v1/009900/';
        poi.latitude = poi.coords.latitude;
        poi.longitude = poi.coords.longitude;
      }

    };


    $scope.addQuest = function () {
      var step = $scope.cotSelected.step_sel;
      var newQuest = {
        name: "Quête " + randomName(),
        desc: "Entrez la description de la quete"
      };
      console.log("newQuest");

      CotFactory.createQuest($scope.cotSelected.step_sel);
      $scope.cotSelected = CotFactory.getCurrentCot();

    };


    $scope.clicMarker = function (data) {
      console.log('clic marker');
      console.dir(data);
    };

    //on set l'objet local
    $scope.associateQuestPoi = function (quest) {
      //var poi = $scope.poiSelected;
      if(!$scope.poiSelected){
        console.error('No poi selected');
        return;
      }
      $scope.cotSelected.stepsO[$scope.cotSelected.step_sel].questsO[quest].poi = $scope.poiSelected._id;
      $scope.cotSelected.stepsO[$scope.cotSelected.step_sel].questsO[quest].poiO = $scope.poiSelected;
      console.log('Le poi ' + $scope.poiSelected.name +' associé à'+$scope.cotSelected.stepsO[$scope.cotSelected.step_sel].questsO[quest].name );

    };


    $scope.associateQuestRiddle = function () {
      var quest = $scope.questSelected;
      var step = $scope.cotSelected.step_sel;
      console.log('Associate' +quest + ' '+step);
      CotFactory.getCurrentCot().stepsO[step].questsO[quest].riddle = $scope.riddleSelected._id;
      CotFactory.getCurrentCot().stepsO[step].questsO[quest].riddleO = $scope.riddleSelected;
      console.dir(CotFactory.getCurrentCot().stepsO[step].questsO[quest]);
      $('#faq').modal('hide');

    };

    /** LEFT SIDE **/

    $scope.setActive = function (step) {
      $scope.cotSelected.step_sel = step;
    };

    $scope.setActivePoi = function (poi) {
      $scope.poiSelected = $scope.cotSelected.pois[poi];

      console.log('Poi with name ' +  $scope.poiSelected.name+' selected');
    };


    $scope.EnterPressed = function (keyEvent, lieu) {

      if (keyEvent.which === 13) {
        $scope.TreatAdress(lieu);
      }
      //alert('I am     an alert');
    };

    /** SUBMIT **/
    $scope.submitCot = function () {
      CotFactory.setCurrentCot($scope.cotSelected);
      CotFactory.updateCot();
      $('#editStep').modal('hide');
    };


    /** Random name steps and quests **/
    var randomName = function () {
      var nouns = ["ninja", "chair", "pancake", "statue", "unicorn", "rainbows", "laser", "senor", "bunny", "captain", "nibblets", "cupcake", "carrot", "gnomes", "glitter", "potato", "salad", "toejam", "curtains", "beets", "toilet", "exorcism", "stick figures", "mermaid eggs", "sea barnacles", "dragons", "jellybeans", "snakes", "dolls", "bushes", "cookies", "apples", "ice cream", "ukulele", "kazoo", "banjo", "opera singer", "circus", "trampoline", "carousel", "carnival", "locomotive", "hot air balloon", "praying mantis", "animator", "artisan", "artist", "colorist", "inker", "coppersmith", "director", "designer", "flatter", "stylist", "leadman", "limner", "make-up artist", "model", "musician", "penciller", "producer", "scenographer", "set decorator", "silversmith", "teacher", "auto mechanic", "beader", "bobbing"];
      var i = Math.floor(Math.random() * nouns.length);
      return nouns[i];
    };


  })
;
