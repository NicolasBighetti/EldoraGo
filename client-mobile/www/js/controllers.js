angular.module('starter.controllers', ['starter.cot-datas', 'starter.notifications'])

    .controller('DashCtrl', function($scope) {})

    .controller('ChatsCtrl', function($scope, Chats) {


        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        $scope.chats = Chats.all();
        $scope.remove = function(chat) {
            Chats.remove(chat);
        };
    })

    .controller('TeamviewCtrl', function($scope, $http, CotData) {

        CotData.setStartTime();
        if ($scope.choice === undefined)
            $scope.activeQuest = "Default Quest";
        else
            $scope.activeQuest = $scope.choice.name;

        $scope.$on('$ionicView.enter', function(e) {
            $scope.elapsedTime = CotData.getElapsedTime();
        });        

        $scope.playSolo = function(name) {
            $scope.playerName = name;
            var playerAnswer = CotData.addPlayer($http, $scope.playerName);
            playerAnswer.then(function(result) {
                $scope.playerData = result.data;
                CotData.setIdJoueur($scope.playerData._id);
            })
        }

        $scope.listTeam = function() {
            var teamPromise = CotData.getTeams($http);
            teamPromise.then(function(result) {
                $scope.teamList = result.data;

            })
        }

        $scope.join = function(name, team) {
            if (name == "")
                $scope.playerName = 'Mamadou' + Math.floor((Math.random() * 1000) + 1);
            else
                $scope.playerName = name;

            var playerAnswer = CotData.addPlayer($http, $scope.playerName);
            playerAnswer.then(function(result) {
                $scope.playerData = result.data;
                CotData.setIdJoueur($scope.playerData._id);

                var teamAnswer = CotData.joinTeam($http, team.trim());
                teamAnswer.then(function(result) {
                    $scope.teamData = result.data;
                    CotData.setIdTeam($scope.teamData._id);
                })

            })

        }

    })

    .controller('EnigmeCtrl', function($scope, $http, $q, $ionicActionSheet, $ionicPopup, $timeout, CotData) {
        $scope.stepsid = [];
        $scope.questsid = [];
        $scope.riddlesid = [];
        $scope.riddlesList = [];

        $scope.getSteps = function() {
            var stepPromise = [];
            for (var s in CotData.getState().get("cot").steps) {
                var curstep = CotData.getState().get("cot").steps[s];
                //$scope.stepsid.push(result.data.steps[s]);
                stepPromise.push(CotData.getStepsFromID($http, curstep));
            }
            $q.all(stepPromise).then((values) => {

                CotData.getState().get("cot").stepsO = [];
                for (var q in values) {

                    CotData.getState().get("cot").stepsO.push(values[q].data);
                    $scope.questsid.push(values[q].data);
                    $scope.getQuests(q);
                }
            });
        }

        $scope.getQuests = function(q) {

            var stepObj = CotData.getState().get("cot").stepsO[q];
            var questPromise = [];
            for (var s in stepObj.quests) {
                //$scope.stepsid.push(result.data.steps[s]);
                questPromise.push(CotData.getQuestFromID($http, stepObj.quests[s]));
            }
            $q.all(questPromise).then((values) => {
                CotData.getState().get("cot").stepsO[q].questsO = [];
                for (var v in values) {
                    CotData.getState().get("cot").stepsO[q].questsO.push(values[v].data);
                    $scope.getRiddle(q, v);
                }


            });
        }

        $scope.getRiddle = function(q, v) {
            var questObj = CotData.getState().get("cot").stepsO[q].questsO[v];
            var riddlePromise = CotData.getRiddleFromID($http, questObj.riddle);
            riddlePromise.then(function(result) {
                CotData.getState().get("cot").stepsO[q].questsO[v].riddleO = result.data;
                $scope.cotData = CotData.getState().get("cot");

            })
        }

        $scope.checkAnswer = function(quest) {
          if (quest.riddleO.answer == quest.tryAnswer) {
            console.log("quest.answer = "+quest.riddleO.answer);
            console.log("quest.tryAnswer = "+quest.tryAnswer);
            quest.isFinish = true;
          }

        }

        // Triggered on a button click, or some other target
        $scope.showOptions = function(quest, riddle) {
            // Show the action sheet
            var hideSheet = $ionicActionSheet.show({
                buttons: [{
                        text: 'Accéder à l\'indice'
                    },
                    {
                        text: 'Demander de l\'aide'
                    },
                    {
                        text: 'Se désinscrire'
                    }
                ],

                // destructiveText: 'Delete',
                titleText: 'Options',
                cancelText: 'Cancel',
                cancel: function() {
                    // add cancel code..
                },
                buttonClicked: function(index) {
                    if (index == 0) {
                        $scope.showHint("Indice", riddle.hint);
                    } else if (index == 1) {
                        $scope.showAlertHelp("Demande d'aide", "Votre demande a été envoyée à vos équipiés");
                        quest.isHelp = true;
                    } else if (index == 2) {
                        quest.assigned = false;
                    }

                    return true;
                }
            });
        };

        /** Pop Up alert for Hint **/
        // An alert dialog
        $scope.showHint = function(myTitle, myTemplate) {
            var alertPopup = $ionicPopup.alert({
                title: myTitle,
                template: myTemplate
            });

            alertPopup.then(function(res) {
                //
            });
        };

        $scope.showAlertHelp = function(myTitle, myTemplate) {
            var alertPopup = $ionicPopup.alert({
                title: myTitle,
                template: myTemplate
            });

            alertPopup.then(function(res) {
                // quest.isHelp = true;
            });
        };

    })
    .controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
        $scope.chat = Chats.get($stateParams.chatId);
    })
    .controller('HomeCtrl', function($scope) {
        $scope.showTabBar = false;

        $scope.greaterThan = function(est, filter) {
          console.log(est);
          console.log(filter);
          return est < filter;
        }

    })

    .controller('HistoriqueCtrl', function($http, $scope, Historique, Notifications, $ionicScrollDelegate, CotData) {

        $scope.addEvent = function() {

            Historique.postEvent($http, "poi", new Date().getDate(), "12/12/2017", CotData);
            $ionicScrollDelegate.scrollBottom();

        }

        $scope.getEvents = function() {
            $scope.events = [{}];
            var eventsPromise = Historique.getEvents($http);
            eventsPromise.then(function(result) {
                var eventsRaw = result.data;
                //get liste joueur

                //
                var index = 0;
                for (var event in eventsRaw) {
                    var joueurPromise = CotData.getPlayerNameByID($http, eventsRaw[event].player);
                    joueurPromise.then(function(name) {
                        $scope.events.push({
                            joueur: name.data.name,
                            type: eventsRaw[index].action,
                            timestamp: eventsRaw[index].date
                        })
                        $ionicScrollDelegate.scrollBottom();
                        index++;
                    })

                }

            })


        }

        $scope.events = Historique.all();
        $scope.descriptions = Historique.desc;
        $scope.icons = Historique.icon;
        $scope.colors = Historique.color;
        $ionicScrollDelegate.scrollBottom();
    })

    .controller('MapCtrl', function($scope, $state, $q, $http, CotData, $cordovaGeolocation, $ionicLoading, Notifications) {
        var markers = [];
        var map;

        $scope.checkIn = function(){
            CotData.checkIn($http, CotData.getState().get("idJoueur"), getRandomInRange(-180, 180, 3), getRandomInRange(-180, 180, 3));
        }

        function retrieveMarkers() {


            var playerPromise = [];
            var teamPromise = CotData.getTeamByID($http, CotData.getState().get("idTeam"));
            teamPromise.then(function(result) {

                for (var id in result.data.players) {
                    playerPromise.push(CotData.getPlayerNameByID($http, result.data.players[id]));
                }

                $q.all(playerPromise).then((values) => {
                    for (var v in values) {
                        addMarker(new google.maps.LatLng(values[v].data.coords.latitude, values[v].data.coords.longitude));
                    }

                })

            })

            showMarkers();
        }

        function addMarker(latLng) {
            var marker = new google.maps.Marker({
                position: latLng,
                map: map,
                icon: pinSymbol("#FFF")
            });

            markers.push(marker);
        }

        $scope.refreshMarker = function() {
            deleteMarkers();
            retrieveMarkers();
            clearMarkers();
            showMarkers();
            setInterval(this.refreshMarker, 1000);
        }

        function randomizePosition() {
            var latLng;
            for (var m in markers) {
                markers[m].position = new google.maps.LatLng(getRandomInRange(-180, 180, 3), getRandomInRange(-180, 180, 3));

            }
        }

        // Sets the map on all markers in the array.
        function setMapOnAll(map) {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(map);
            }
        }

        // Removes the markers from the map, but keeps them in the array.
        function clearMarkers() {
            setMapOnAll(null);
        }

        // Shows any markers currently in the array.
        function showMarkers() {
            setMapOnAll(map);
        }

        // Deletes all markers in the array by removing references to them.
        function deleteMarkers() {
            clearMarkers();
            markers = [];
        }

        $scope.init = function() {
            $scope.show($ionicLoading);
            $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
                mapOptions.center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                map = new google.maps.Map(document.getElementById("map"), mapOptions);

                var marker = new google.maps.Marker({
                    position: mapOptions.center,
                    map: map,
                    title: 'Position'
                });

                $scope.refreshMarker();
                $scope.hide($ionicLoading);
            })


        }


        $scope.show = function($ionicLoading) {
            $ionicLoading.show({
                content: 'Getting current location...',
                showBackdrop: false
            });
        }


        $scope.hide = function($ionicLoading) {
            $ionicLoading.hide().then(function() {

            })
        }

        function pinSymbol(color) {
            return {
                path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
                fillColor: color,
                fillOpacity: 1,
                strokeColor: '#000',
                strokeWeight: 2,
                scale: 1,
            };


        }

        function getRandomInRange(from, to, fixed) {
            return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
        };

    })

    .controller('AccountCtrl', function($scope) {
        $scope.settings = {
            enableFriends: true
        };
    })

    .controller("HomeCtrl", function($scope, $http, $rootScope, $cordovaGeolocation, $ionicLoading, CotData, Notifications) {
        $scope.view = "templates/tabs.html";
        $scope.showtheview = false;
        $scope.choice = $rootScope.choice;
        CotData.setCot($scope.choice);

        $scope.init = function() {
            $scope.show($ionicLoading);

            $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
                mapOptions.center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                var map = new google.maps.Map(document.getElementById("map-preview"), mapOptions);
                var marker = new google.maps.Marker({
                    position: mapOptions.center,
                    map: map,
                    title: "Ma Position"
                });
                $scope.hide($ionicLoading);
            })


        }

       $scope.show = function($ionicLoading) {
            $ionicLoading.show({
                content: 'Getting current location...',
                showBackdrop: false
            });
        }


        $scope.hide = function($ionicLoading) {
            $ionicLoading.hide().then(function() {

            })
        }

        $scope.setChoice = function(Data) {
            for (var cot in $scope.cot) {
                if ($scope.cot[cot]._id == Data) {

                    $scope.choice = $scope.cot[cot];
                    $rootScope.choice = $scope.choice;
                    CotData.setIdCot($scope.choice._id);
                    break;
                }
            }

        };

        var cotPromise = CotData.cots($http);
        cotPromise.then(function(result) {
            $scope.cot = result;
        });


    });

var mapOptions = {
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoomControl: false,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false

};

var options = {
    timeout: 10000,
    enableHighAccuracy: true
};
