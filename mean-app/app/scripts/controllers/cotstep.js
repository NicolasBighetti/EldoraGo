
angular.module('eldoragoApp')
  .controller('CotStepCtrl', function($scope, $location, $timeout, $http, CotFactory) {

    /**  Loading **/
    $scope.init = function() {
      $scope.getRiddleList();
      $scope.getMarkerList();
      $scope.cotSelected = CotFactory.getCurrentCot();
      CotFactory.setCurrentCot(null);

      // si on vient de la page cot-list
      if ($scope.cotSelected != null) {
        $scope.getStepList();
      }
    }

    /** Show **/
    $scope.isStart = true;

    /** Form **/
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

          $scope.initiateCot();
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
      var cot = $scope.cotSelected;
      var newStep = {
        name: "Nom step",
        desc: "test"
      };

      $http.post(DB_PATH+"steps", newStep).then(function(resp) {
        newStep = resp.data;
        cot.steps.push(newStep._id);

        $http.put(DB_PATH+"cots/"+cot._id, {steps: cot.steps}).then(function(resp) {
          $scope.getStepList();
        }, function(error) {
          alert(error);
          console.dir(error);
        });
      }, function(error) {
        alert(error);
        console.dir(error);
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

      $http.get(DB_PATH+"pois").then(function(resp) {
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

    $scope.getCot = function() {
      $scope.stepList = [];
      var cot = $scope.cotSelected;
      $http.get(DB_PATH+"cots/"+cot._id).then(function(resp) {
        $scope.cotSelected = resp.data;
        console.log(resp.data);
      }, function(error) {
        alert(error);
      });
    }

    $scope.getStepList = function() {
      $scope.stepList = [];
      var cot = $scope.cotSelected;
      for (var i = 0; i < cot.steps.length; i++) {
        $http.get(DB_PATH+"steps/"+cot.steps[i]).then(function(resp) {
          $scope.stepList.push(resp.data);
        }, function(error) {
          alert(error);
        });
      }
    }

    $scope.getRiddleList = function() {
      $http.get(DB_PATH+"riddles").then(function(resp) {
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
          $http.get(DB_PATH+"riddles/" + quest.riddle).then(function(resp) {
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
          $http.get(DB_PATH+"pois/" + quest.poi).then(function(resp) {
            quest.poi_name = resp.data.name;
            $scope.questList.push(quest);

          }, function(error) {
            alert(error);
            console.dir(error);
          });
        } else {
          $scope.questList.push(quest);
        }
      };

      $scope.updateQuest = function(quest){
        //var quest = $scope.questSelected;
        console.log('updating quest');
        console.dir(quest);
        $http.put(DB_PATH+"quests/" + quest._id, quest).then(function (resp,err) {
          if(err){
            console.dir(err);
          }else {
            console.log('Quest updated');
            console.dir(resp.data);
          }
        });
      };

      // recupere les quêtes
      for (var i = 0; i < step.quests.length; i++) {
        $http.get(DB_PATH+"quests/" + step.quests[i]).then(function(resp) {
          var quest = resp.data;

          addRiddleName(quest);

        }, function(error) {
          alert(error);
          console.dir(error);
        });
      }
    }

    $scope.convertRiddle = function(quest) {
      $http.get(DB_PATH+"riddles/" + quest.riddle).then(function(resp) {
        quest.riddle_name = resp.data;
        // $scope.questList.push(quest);
      }, function(error) {
        alert(error);
        console.dir(error);
      });
    }


    //Removes a step
    $scope.RemoveStep = function(id) {
      $http.delete(DB_PATH+"steps/" + id).then(function(resp) {
        console.log("deleted");

        //remove
        var index = $scope.cotSelected.steps.indexOf(id);
        $scope.cotSelected.steps.splice(index, 1);

        // refresh step
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
      };
      console.log("newQuest");

      $http.post(DB_PATH+"quests", newQuest).then(function(resp) {
        console.log("Quête créée");
        newQuest = resp.data;
        // On ajoute l'id de la nouvelle quete à la step concernée
        step.quests.push(newQuest._id);

        $http.put(DB_PATH+"steps/" + step._id, {
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

    $scope.initiateCot = function() {
      var newCot = {
        name: "Ajoutez un nom",
        desc: "Ajoutez une description"
      }

      $http.post(DB_PATH+"cots", newCot).then(function(resp) {
        console.log("Cot initiated");
        $scope.cotSelected = resp.data;
        CotFactory.setCurrentCot(resp.data);

        $scope.getStepList();
      }, function(error) {
        alert(error);
      });
    }

    $scope.associateQuestPoi = function(quest) {
      var poi = $scope.poiSelected;
      $http.put(DB_PATH+"quests/" + quest._id, {
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
      $http.put(DB_PATH+"quests/" + quest._id, {
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
      console.log('Updating step');
      console.log($scope.cotSelected);
      // $http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
      $http({
        url: DB_PATH+"cots/"+$scope.cotSelected._id,
        dataType: 'json',
        method: 'PUT',
        data: $scope.cotSelected
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
