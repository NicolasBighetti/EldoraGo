﻿
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



//Contains the markers we will add 
          $scope.markerList = [
              {
                  id: Date.now(), coords:
                  {
                      latitude: 43.55651037504757,
                      longitude: 6.062621846795082
                  }
              },
              {
                  id: Date.now(), coords:
                  {
                      latitude: 43.897892391257976,
                      longitude: 4.678344503045082

                  }
              },

              {
                  id: Date.now(), coords:
                  {
                      latitude: 43.45859799999999,
                      longitude: 5.249702999999954
                  }
              }
          ];

          for (var i = 0; i < 3; i++) {
              $scope.map.markers.push($scope.markerList[i]);
              console.log($scope.markerList[i]);
              console.log($scope.map.markers);
              $scope.$apply();

          }


            /** ajout du marker au centre **/
          var marker = {
              id: Date.now(),
              coords: {
                  latitude: location.lat(),
                  longitude: location.lng()
              }
          };
          //$scope.map.markers.push(marker);
          //console.log(marker);
          //console.log($scope.map.markers);
          //$scope.$apply();


        }
      })

    };


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

           //Add a marker when clicking
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
      
    }//marker
    };

    $scope.marker = {
      events: {
        click: function(marker, eventName, args) {
          //$('#interestMarker').modal('show');
            //$scope.open();
            //console.log(marker.position.lat() +" -- "+ marker.position.lng());
            console.log("Marker clicked ! ");
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
