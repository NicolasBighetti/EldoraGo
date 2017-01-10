
angular.module('eldoragoApp')
  .controller('CotStepCtrl', function($scope, $location, $timeout, $http) {

    /** Show **/
    $scope.isStart = true;

    /** Form **/
    $scope.cotToCreate = {};

    /** Start **/
    $scope.TreatAdress = function(lien) {

      console.log("Le LIEN : " + lien);
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({
        "address": lien
      }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
          var location = results[0].geometry.location;
          console.log("LOCATION in the Treat-Address (cotstep controller): " + location);

          $scope.updateLocation(location.lat()+0.25, location.lng()-0.5);
          $scope.isStart = false;
          $scope.$apply();

          $scope.stepList = [];
        }
      })

      setTimeout(function () {
          
          //angular - google - map - container
          //angular - google - map

          var elements = document.getElementsByClassName('angular-google-map');
          //var requiredElement = elements[0];
          var requiredElement = document.getElementById('cot-step-map-div');
          requiredElement.setAttribute("style", "width:500px");
          requiredElement.setAttribute("style", "height:300px");

console.log("I WAITED U ASS");

      }, 2000);

    };

    /** Get Marker de la BDD **/
    $http.get("https://eldorago.herokuapp.com/api/pois").then(function(resp) {
      $scope.markerList = resp.data;
      // console.log($scope.markerList);

      // foreach marker on markerList BDD
      for (var i = 0; i < $scope.markerList.length; i++) {
        //rename _id en id
        $scope.markerList[i].id = $scope.markerList[i]._id;
        // adding marker on the map
        $scope.map.markers.push($scope.markerList[i]);
      }
      // $scope.$apply();

    });

    $scope.updateLocation = function(newlat, newlon) {
      $scope.map.center.latitude = newlat;
      $scope.map.center.longitude = newlon;
        console.log("Updated location with : " + $scope.map.center.latitude + " / " + $scope.map.center.longitude);
        //Center the map !!!!
      // $scope.map.center = new google.maps.LatLng(newlat, newlon);
    };

    $scope.lat = 44;
    $scope.lon = 6;

    $scope.map = {
      center: {
        latitude: $scope.lat,
        longitude: $scope.lon
      },
      zoom: 10,
      markers: [],
      events: {
        click: function(map, eventName, originalEventArgs) {
          var e = originalEventArgs[0];
          console.log(e);
          var lat = e.latLng.lat(),
            lon = e.latLng.lng();
          // STEP //Add a marker when clicking
          //  var marker = {
          //    id: Date.now(),
          //    coords: {
          //      latitude: lat,
          //      longitude: lon
          //    }
          //  };
          //  $scope.map.markers.push(marker);
          //  console.log(marker);
          //  console.log($scope.map.markers);
          //  $scope.$apply();
          //  console.log(marker.coords.latitude + marker.coords.lon);
        }

      } //marker
    };

    $scope.addStep = function(lat, lng) {
      $scope.stepList.push({
        _id: $scope.stepList.length + 1,
        _lat: lat,
        _lng: lng
      });

    }

    //Resets the steps _id to keep valid _ids
    function ResetStepsId()
    {
      for (var i = 0; i < $scope.stepList.length; i++)
      {
          $scope.stepList[i]._id = i + 1;
      }
    }//ResetStepsId()

    $scope.marker = {
      events: {
        click: function(marker, eventName, args) {
          //$('#interestMarker').modal('show');
          //$scope.open();
          //console.log(marker.position.lat() +" -- "+ marker.position.lng());
          console.log("Marker clicked ! ");

          // $scope.associateStepPoi(step, poi);

          console.log("$scope.markerList.length"+ $scope.markerList.length);
          for (var i = 0; i < $scope.markerList.length ; i++) {
            if ($scope.markerList[i].id === marker.key) {
              $scope.poiSelected = $scope.markerList[i];
            }
          }
          console.log($scope.poiSelected);
        }
      }
    };


    //Removes a step
    $scope.RemoveStep = function(id)
    {
        $scope.stepList.splice(id - 1, 1);
        ResetStepsId();
    }


    /** STEP **/
    $scope.isQuest = true;
    $scope.textSwitch = "Voir la fiche descriptive"
    $scope.switchQuest = function() {
      $scope.isQuest = !$scope.isQuest;
      $scope.textSwitch = $scope.isQuest ? "Voir la fiche descriptive" : "Voir la liste des Quêtes";
    };

    $scope.select = function(riddle) {
      $scope.riddleSelected = riddle;
    };

    $scope.selectQuest = function(quest) {
      $scope.questSelected = quest;
    };

    $scope.associateQuest = function(quest, riddle) {
      // modif BDD
      // adresse à revoir
      // $http.put("https://eldorago.herokuapp.com/api/cot/"+$scope.quest._id, $scope.riddle._id ).then(function(resp) {
      //   console.log(riddle + " associée à "+ quest);
      //   $('#editStep').modal('hide');
      // }, function(error) {
      //   alert(error);
      // });

    };

    $scope.addQuest = function () {

    }

    /** LEFT SIDE **/
    $scope.setActive = function(menuItem) {
      $scope.stepSelected = menuItem;
    }

    $scope.EnterPressed = function (keyEvent, lieu) {

        if (keyEvent.which === 13)
        {
            $scope.TreatAdress(lieu);
        }
            //alert('I am     an alert');
    }

    /** SUBMIT **/
    $scope.submitCot = function() {
      // sendBDD
      console.log($scope.cotToCreate);
      // $http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
      $http({
        url: 'https://eldorago.herokuapp.com/api/cots',
        dataType: 'json',
        method: 'POST',
        data: $scope.cotToCreate
      }).then(function(resp) {
        console.log(resp);
        $('#editStep').modal('hide');

        $timeout(function() {
          $location.path("/cot-list");
        }, 750);

      }, function(error) {
        alert(error.data.message);
      });

      console.log("COT sauvegardée");
    }

    /** BDD **/
    $scope.listEnigma = [{
      id: "riddle1",
      name: "Enigme 1",
      desc: "4 plus 4 ?",
      keywords: [],
      hint: "C'est une addition",
      answer: "8",
      qtype: "Enigme"
    }, {
      id: "riddle2",
      name: "Enigme 2",
      desc: "J'ai 2 pieds, 6 jambes, 8 bras, 2 têtes et un oeil, qui suis-je ?",
      keywords: [],
      hint: "",
      answer: "Coca-cola",
      qtype: "Enigme"
    }, {
      id: "riddle3",
      name: "Enigme avec un nom",
      desc: "Oh! Oh! Oh!",
      keywords: [],
      hint: "Tu vas trouver!",
      answer: "héhéhé",
      qtype: "Enigme"
    }, {
      id: "riddle4",
      name: "Enigme 4",
      desc: "Ah! Ah! Ah!",
      qtype: "Enigme"
    }, {
      name: "Enigme 5",
      desc: "Ih! Ih! Ih!",
      qtype: "Enigme"
    }, {
      name: "Enigme 6",
      desc: "Uh! Uh! Uh!",
      qtype: "Enigme"
    }];

    $scope.listQuest = [{
      id: "quete1",
      name: "Quete 1",
      id_riddle: "riddle1",
      desc: "4 plus 4 ?",
      qtype: "Enigme"
    }, {
      id: "quete2",
      id_riddle: "riddle2",
      name: "Quete 2",
      desc: "J'ai 2 pieds, 6 jambes, 8 bras, 2 têtes et un oeil, qui suis-je ?",
      qtype: "Enigme"
    }, {
      id: "quete3",
      id_riddle: "riddle3",
      name: "Quete avec un nom",
      desc: "Oh! Oh! Oh!",
      qtype: "Enigme"
    }
    //, {
    //   id: "quete4",
    //   id_riddle: "riddle4",
    //   name: "Quete 4",
    //   desc: "Ah! Ah! Ah!",
    //   qtype: "Enigme"
    // }, {
    //   name: "Quete 5",
    //   desc: "Ih! Ih! Ih!",
    //   qtype: "Enigme"
    // }, {
    //   name: "Quete 6",
    //   desc: "Uh! Uh! Uh!",
    //   qtype: "Enigme"
    // }
  ];

  });
