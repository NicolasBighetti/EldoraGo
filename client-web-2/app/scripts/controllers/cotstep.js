
angular.module('eldoragoApp')
  .controller('CotStepCtrl', function($scope) {

    /** Show **/
    $scope.isStart = true;

    /** Start **/
    $scope.TreatAdress = function(lien) {

        //Turning address to coordinates
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({
        "address": lien
      }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
          var location = results[0].geometry.location;
          console.log("LOCATION in the Treat-Address (cotstep controller): " + location);
         //updating scope variables
          $scope.updateLocation(location.lat(), location.lng());
          $scope.isStart = false;
          $scope.$apply();

            //Contains the steps
          $scope.stepList = [];

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

            //Displaying the markers on the map
          for (var i = 0; i < 3; i++) {
              $scope.map.markers.push($scope.markerList[i]);
              console.log($scope.markerList[i]);
              console.log($scope.map.markers);
              $scope.$apply();

          }


            /** ajout du marker au centre **/
          //var marker = {
          //    id: Date.now(),
          //    coords: {
          //        latitude: location.lat(),
          //        longitude: location.lng()
          //    }
          //};
          //$scope.map.markers.push(marker);
          //console.log(marker);
          //console.log($scope.map.markers);
          //$scope.$apply();


        }
      })

    };

      //Updates scope location variables
    $scope.updateLocation = function(newlat, newlon) {
      $scope.map.center.latitude = newlat;
      $scope.map.center.longitude = newlon;
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

    //Adds a step 
    function AddStep(lat, lng)
    {
        $scope.stepList.push({ _id: $scope.stepList.length + 1 , _lat:lat, _lng : lng });

    }//AddStep()

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
          
            console.log("Marker clicked ! ");
            AddStep(marker.position.lat(), marker.position.lng());
        }
      }
    };

      //Removes a step 
    $scope.RemoveStep = function(id)
    {
        $scope.stepList.splice(id - 1, 1);
        ResetStepsId();
    }



    /** step **/
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
    };

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
    }, {
      id: "quete4",
      id_riddle: "riddle4",
      name: "Quete 4",
      desc: "Ah! Ah! Ah!",
      qtype: "Enigme"
    }, {
      name: "Quete 5",
      desc: "Ih! Ih! Ih!",
      qtype: "Enigme"
    }, {
      name: "Quete 6",
      desc: "Uh! Uh! Uh!",
      qtype: "Enigme"
    }];

  });
