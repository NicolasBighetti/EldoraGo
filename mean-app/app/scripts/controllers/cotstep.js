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

    $scope.markerList = [];
    
    /**  Loading **/
    $scope.init = function () {
      console.log('init');
      $scope.markerList = [];

      $scope.btnSelected = 'tous';
      if(CotFactory.getCurrentCot()) {
        $scope.getRiddleList();


        console.log('init: object from fact :');
        console.log(CotFactory.getCurrentCot());


        // si on vient de la page cot-list

        //charger la cot
        CotFactory.readCot().then(function (res) {

          console.log('Cot with objects and ids');
          console.dir(CotFactory.getCurrentCot().pois);

          //a verifier
          $scope.cotSelected = CotFactory.getCurrentCot();

          $scope.getMarkerList();

          console.dir($scope.cotSelected);
          //$scope.selected = CotFactory.getCurrentCot();
        }, function (error) {
          console.error(error);
        });
      }

        //$scope.getStepList();

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

     /* CotFactory.createCot().then(function () {
        $scope.cotSelected = CotFactory.getCurrentCot();
      },function (code) {
          console.error(code);
      });*/



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
      zoom: 8,
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

          console.log("Marker clicked ! ");

          //$scope.associateStepPoi(step, poi);

          console.log("$scope.markerList.length" + $scope.markerList.length);
          console.dir(marker);

          for (var i = 0; i < $scope.markerList.length; i++) {
            if ($scope.markerList[i].id === marker.key) {
              $scope.poiSelected = $scope.markerList[i];
                displayWindowPoi();
            }
          }

          //windo
        }
      }
    };


    /** Get Marker de la BDD **/
    $scope.poiListId = [];
    $scope.poiList = [];



    $scope.getMarkerList = function () {
      $http.get(DB_PATH + "pois").then(function (resp) {


        $scope.markerList = resp.data;

        var poisID = $scope.cotSelected.pois.map(function (a) {return a._id;});
        // foreach marker on markerList BDD
        for (var i = 0; i < $scope.markerList.length; i++) {
          var color = '#F00';
          if (poisID.indexOf($scope.markerList[i]._id) >= 0) {
            color = '#0F0';
          }

          //set id and lat/long
          $scope.markerList[i] = CotFactory.transformPoi($scope.markerList[i],color);

          $scope.map.markers.push($scope.markerList[i]);
        }
        // $scope.$apply();
      });
    };

    $scope.getRiddleList = function () {
      $http.get(DB_PATH + "riddles").then(function (resp) {
        $scope.riddleList = resp.data;
      }, function (error) {
        alert(error);
      });

    };

    $scope.RemoveStep = CotFactory.deleteStep;


    /** STEP **/
    $scope.isQuest = true;
    $scope.textSwitch = "Voir la fiche descriptive";
    $scope.switchQuest = function () {
      $scope.isQuest = !$scope.isQuest;
      $scope.textSwitch = $scope.isQuest ? "Voir la fiche descriptive" : "Voir la liste des quêtes";
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

      if(!poi){
        console.error('No poi Sel to add');
        return;
      }

      // Si pas déjà dans la liste
      if ($scope.cotSelected.pois.indexOf(poi) < 0) {

        poi = CotFactory.transformPoi(poi,'#0F0');

        $scope.cotSelected.pois.push(poi);

        // adding marker on the map
        var mIndex = $scope.map.markers.indexOf(poi);
        if(mIndex == -1){
          $scope.map.markers.push(poi);
        }
        else {
          $scope.map.markers[mIndex] = poi;
        }
      } else {
        console.log("POI déjà dans la liste");
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

      var questO =  $scope.cotSelected.stepsO[$scope.cotSelected.step_sel].questsO[quest];
      if(questO.poi == $scope.poiSelected._id ){
        console.log('same poi');
        return;
      }

      questO.poi = $scope.poiSelected._id;
      questO.poiO = $scope.poiSelected;

      $scope.addPoiList();
      console.log('Le poi ' + $scope.poiSelected.name +' associé à '+$scope.cotSelected.stepsO[$scope.cotSelected.step_sel].questsO[quest].name );

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

      console.log('POI with name ' +  $scope.poiSelected.name+' selected');
    };

    $scope.setBtnActive = function (btn) {
      $scope.btnSelected = btn;
    };

    $scope.isActiveBtn = function(btn) {
      return btn === $scope.btnSelected;
    };

    $scope.isActivePoi = function(poi) {
      if(!$scope.poiSelected)
        return false;
      return $scope.cotSelected.pois[poi]._id === $scope.poiSelected._id;
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


      $timeout(function() {
        $location.path("/cot-list");
      }, 750);
    };


    /** Random name steps and quests **/
    var randomName = function () {
      var nouns = ["ninja", "chair", "pancake", "statue", "unicorn", "rainbows", "laser", "senor", "bunny", "captain", "nibblets", "cupcake", "carrot", "gnomes", "glitter", "potato", "salad", "toejam", "curtains", "beets", "toilet", "exorcism", "stick figures", "mermaid eggs", "sea barnacles", "dragons", "jellybeans", "snakes", "dolls", "bushes", "cookies", "apples", "ice cream", "ukulele", "kazoo", "banjo", "opera singer", "circus", "trampoline", "carousel", "carnival", "locomotive", "hot air balloon", "praying mantis", "animator", "artisan", "artist", "colorist", "inker", "coppersmith", "director", "designer", "flatter", "stylist", "leadman", "limner", "make-up artist", "model", "musician", "penciller", "producer", "scenographer", "set decorator", "silversmith", "teacher", "auto mechanic", "beader", "bobbing"];
      var i = Math.floor(Math.random() * nouns.length);
      return nouns[i];
    };


  })
;
