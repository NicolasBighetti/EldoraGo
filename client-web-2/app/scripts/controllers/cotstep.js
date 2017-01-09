
angular.module('eldoragoApp')
  .controller('CotStepCtrl', function($scope) {

    /** Show **/
    $scope.isStart = true;

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
          //$scope.lat = location.lat();
          //$scope.lon = location.lng();

          $scope.updateLocation(location.lat(), location.lng());
          $scope.isStart = false;
          // $scope.addMarker(location.lat(), location.lng())
          $scope.$apply();
          // $location.path("/#!/cot-step");

          /** ajout du marker au centre **/
        }
      })

    };


    // $scope.addMarker = function (lat, lng) {
    //   var marker = new google.maps.Marker({
    //     map: $scope.map,
    //     position:  new google.maps.LatLng(lat, lng)
    //   });
    //   $scope.map.markers.push(marker);
    //   console.log("addMarker");
    // };

    $scope.updateLocation = function(newlat, newlon) {
      $scope.map.center.latitude = newlat;
      $scope.map.center.longitude = newlon;
      // console.log("Updated location with : " + newlat + " / "+ newlon);
      console.log("Updated location with : " + $scope.map.center.latitude + " / " + $scope.map.center.longitude);
    };


    $scope.lat = 0;
    $scope.lon = 0;

    $scope.map = {
      center: {
        latitude: $scope.lat,
        longitude: $scope.lon
      },
      zoom: 7,
      markers: [],
      events: {
        click: function(map, eventName, originalEventArgs) {
          var e = originalEventArgs[0];
          console.log(e);
          var lat = e.latLng.lat(),
            lon = e.latLng.lng();
          var marker = {
            id: Date.now(),
            coords: {
              latitude: lat,
              longitude: lon
            }
          };
          $scope.map.markers.push(marker);
          console.log(marker);
          console.log($scope.map.markers);
          $scope.$apply();
        }
      }
    };

    $scope.marker = {
      events: {
        click: function(marker, eventName, args) {
          $('#interestMarker').modal('show');
          $scope.open();
        }
      }
    };

    /** step **/
    $scope.isQuest = true;
    $scope.textSwitch = "Voir la fiche descriptive"
    $scope.switchQuest = function() {
      $scope.isQuest = !$scope.isQuest;
      $scope.textSwitch = $scope.isQuest ? "Voir la fiche descriptive" : "Voir la liste des Quêtes";
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

    //function updateLat() {


    //}


    //$scope.$watch($scope.center.lat, updateLat);
    console.log("LOCATION in cotstep controller : " + $scope.lat + " / " + $scope.lon);
  });
