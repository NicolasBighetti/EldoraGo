
angular.module('eldoragoApp')
  .controller('CotStepCtrl', function($scope, $location, $timeout, $http) {

    /**  Loading **/
    $scope.init = function() {
      $scope.getStepList();
      $scope.getRiddleList();
      $scope.getMarkerList();
    }

    /** Show **/
    $scope.isStart = true;

    /** Form **/
    $scope.cotToCreate = {};
    $scope.questList = [];

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

          $scope.updateLocation(location.lat() + 0.25, location.lng() - 0.5);
          $scope.isStart = false;
          $scope.$apply();

          // $scope.stepList = [];
        }
      })

      setTimeout(function() {

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
        }

      } //marker
    };

    $scope.addStep = function(lat, lng) {

      var newStep = {
        name: "Nom step",
        desc: "test"
      };

      $http.post("/api/steps", newStep).then(function(resp) {
        console.log("addStep");
        $scope.getStepList();
      }, function(error) {
        alert(error);
      });
    }

    //Resets the steps _id to keep valid _ids
    // function ResetStepsId()
    // {
    //   for (var i = 0; i < $scope.stepList.length; i++)
    //   {
    //       $scope.stepList[i]._id = i + 1;
    //   }
    // }//ResetStepsId()

    $scope.marker = {
      events: {
        click: function(marker, eventName, args) {
          //$('#interestMarker').modal('show');
          //$scope.open();
          //console.log(marker.position.lat() +" -- "+ marker.position.lng());
          console.log("Marker clicked ! ");

          // $scope.associateStepPoi(step, poi);

          console.log("$scope.markerList.length" + $scope.markerList.length);
          for (var i = 0; i < $scope.markerList.length; i++) {
            if ($scope.markerList[i].id === marker.key) {
              $scope.poiSelected = $scope.markerList[i];
            }
          }
          console.log($scope.poiSelected);
        }
      }
    };


    /** Get Marker de la BDD **/
    $scope.getMarkerList = function() {

      $http.get("/api/pois").then(function(resp) {
        $scope.markerList = resp.data;

        // foreach marker on markerList BDD
        for (var i = 0; i < $scope.markerList.length; i++) {
          //rename _id en id
          $scope.markerList[i].id = $scope.markerList[i]._id;
          // adding marker on the map
          $scope.map.markers.push($scope.markerList[i]);
        }
        // $scope.$apply();

      });
    }

    $scope.getStepList = function() {
      $http.get("/api/steps").then(function(resp) {
        $scope.stepList = resp.data;
      }, function(error) {
        alert(error);
      });
    }

    $scope.getRiddleList = function() {
      $http.get("/api/riddles").then(function(resp) {
        $scope.riddleList = resp.data;
      }, function(error) {
        alert(error);
      });
    }

    $scope.getQuestList = function(step) {
      $scope.questList = [];

      // Convertit les riddles id en nom
      var addRiddleName = function(quest){
        if (quest.riddle != null) {
          $http.get("/api/riddles/" + quest.riddle).then(function(resp) {
            quest.riddle_name = resp.data.name;
            addPoiName(quest);
          }, function(error) {
            alert(error);
            console.dir(error);
          });
        } else {
          addPoiName(quest);
        }
      }

      // Convertit les pois id en nom
      var addPoiName = function(quest) {
        if (quest.poi != null) {
          $http.get("/api/pois/" + quest.poi).then(function(resp) {
            quest.poi_name = resp.data.name;
            $scope.questList.push(quest);

          }, function(error) {
            alert(error);
            console.dir(error);
          });
        } else {
          $scope.questList.push(quest);
        }
      }

      // recupere les quêtes
      for (var i = 0; i < step.quests.length; i++) {
        $http.get("/api/quests/" + step.quests[i]).then(function(resp) {
          var quest = resp.data;

          addRiddleName(quest);

        }, function(error) {
          alert(error);
          console.dir(error);
        });
      }
    }

    $scope.convertRiddle = function(quest) {
      $http.get("/api/riddles/" + quest.riddle).then(function(resp) {
        quest.riddle_name = resp.data;
        // $scope.questList.push(quest);
      }, function(error) {
        alert(error);
        console.dir(error);
      });
    }


    //Removes a step
    $scope.RemoveStep = function(id) {
      $http.delete("/api/steps/" + id).then(function(resp) {
        console.log("step " + id + "delete");
        $scope.getStepList();
      }, function(error) {
        alert(error);
      });
      // $scope.stepList.splice(id - 1, 1);
      // ResetStepsId();
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

    $scope.addQuest = function() {
      var step = $scope.stepSelected;
      var newQuest = {
        name: "Nom quete",
        desc: $scope.stepSelected.desc
      }
      console.log("newQuest");

      $http.post("/api/quests", newQuest).then(function(resp) {
        console.log("Quête créée");
        newQuest = resp.data;
        // On ajoute l'id de la nouvelle quete à la step concernée
        step.quests.push(newQuest._id);

        $http.put("/api/steps/" + step._id, {
          quests: step.quests
        }).then(function(resp) {
          console.log("ajout de l'id de la nouvelle quete dans ");
          console.log(step);
          $scope.getQuestList(step);
        }, function(error) {
          alert(error);
          console.dir(error);
        });

      }, function(error) {
        alert(error);
        console.dir(error);
      });


    }

    $scope.associateQuestPoi = function(quest) {
      var poi = $scope.poiSelected;
      $http.put("/api/quests/" + quest._id, {
        poi: poi._id
      }).then(function(resp) {
        console.log(quest + " associée à " + poi);
        $scope.getQuestList($scope.stepSelected);
      }, function(error) {
        alert(error);
        console.dir(error);
      });
    }

    $scope.associateQuestRiddle = function() {
      var quest = $scope.questSelected;
      var riddle = $scope.riddleSelected;
      $http.put("/api/quests/" + quest._id, {
        riddle: riddle._id
      }).then(function(resp) {
        console.log("riddle associée à quest");
        $('#faq').modal('hide');
        $scope.getQuestList($scope.stepSelected);
      }, function(error) {
        alert(error);
        console.dir(error);
      });
    }

    /** LEFT SIDE **/
    $scope.setActive = function(step) {
      $scope.stepSelected = step;
      $scope.getQuestList(step);
    }

    $scope.EnterPressed = function(keyEvent, lieu) {

      if (keyEvent.which === 13) {
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
        url: '/api/cots',
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

    //   $scope.listQuests = [{
    //     id: "quete1",
    //     name: "Quete 1",
    //     id_riddle: "riddle1",
    //     desc: "4 plus 4 ?",
    //     qtype: "Enigme"
    //   }, {
    //     id: "quete2",
    //     id_riddle: "riddle2",
    //     name: "Quete 2",
    //     desc: "J'ai 2 pieds, 6 jambes, 8 bras, 2 têtes et un oeil, qui suis-je ?",
    //     qtype: "Enigme"
    //   }, {
    //     id: "quete3",
    //     id_riddle: "riddle3",
    //     name: "Quete avec un nom",
    //     desc: "Oh! Oh! Oh!",
    //     qtype: "Enigme"
    //   }
    //   //, {
    //   //   id: "quete4",
    //   //   id_riddle: "riddle4",
    //   //   name: "Quete 4",
    //   //   desc: "Ah! Ah! Ah!",
    //   //   qtype: "Enigme"
    //   // }, {
    //   //   name: "Quete 5",
    //   //   desc: "Ih! Ih! Ih!",
    //   //   qtype: "Enigme"
    //   // }, {
    //   //   name: "Quete 6",
    //   //   desc: "Uh! Uh! Uh!",
    //   //   qtype: "Enigme"
    //   // }
    // ];

  });
