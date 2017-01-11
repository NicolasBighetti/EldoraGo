angular.module('starter.controllers', ['starter.cot-datas'])

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

.controller('TeamviewCtrl', function($scope, $http, CotData){

  if($scope.choice === undefined)
    $scope.activeQuest = "Default Quest";
  else
    $scope.activeQuest = $scope.choice.name;


  $scope.playSolo = function(name){
    console.log("Soloing")
    $scope.playerName = name;
    var playerAnswer = CotData.addPlayer($http, $scope.playerName);
    playerAnswer.then(function(result){
      $scope.playerData = result.data;
      CotData.setIdJoueur($scope.playerData._id);
    })
  }

  $scope.listTeam = function(){
    var teamPromise = CotData.getTeams($http);
    teamPromise.then(function(result){
      $scope.teamList = result.data;
      console.log("List team");
      console.log($scope.teamList);
    })
  }

  $scope.join = function(name, team){
    console.log("init player " + name);
    console.log("init team " + team);
    if(name == "")
      $scope.playerName = 'Mamadou' + Math.floor((Math.random() * 1000) + 1);
    else
      $scope.playerName = name;

    var playerAnswer = CotData.addPlayer($http, $scope.playerName);
    playerAnswer.then(function(result){
      $scope.playerData = result.data;
      CotData.setIdJoueur($scope.playerData._id);

      var teamAnswer = CotData.joinTeam($http, team.trim());
      teamAnswer.then(function(result){
        $scope.teamData = result.data;
        console.log(result.data);
        CotData.setIdTeam($scope.teamData._id);
      })

    })
    
  }

})

.controller('EnigmeCtrl', function($scope, $http, $q, CotData){
  $scope.stepsid = [];
  $scope.questsid = [];
  $scope.riddlesid = [];
  $scope.riddlesList = [];



  $scope.dispQuest = function(){
    console.log($scope.riddlesList);
  }

  $scope.getSteps = function(){
    var stepPromise = [];
    for(var s in CotData.getState().get("cot").steps){
      var curstep = CotData.getState().get("cot").steps[s];
        //$scope.stepsid.push(result.data.steps[s]);
        console.dir(s+" step id " + curstep);
         stepPromise.push(CotData.getStepsFromID($http,curstep));
    }
    $q.all(stepPromise).then((values) => {
      console.log(values);
            console.log('got steps');

      CotData.getState().get("cot").stepsO = [];
      for(var q in values){
        console.log("YOLO");
        
      CotData.getState().get("cot").stepsO.push(values[q].data);
      $scope.questsid.push(values[q].data);
        $scope.getQuests(q);
      }
    });
  }

  $scope.getQuests = function(q){
            console.log("YOLO22");

  var stepObj = CotData.getState().get("cot").stepsO[q];
  var questPromise = [];
            console.log(stepObj.quests);
    for(var s in stepObj.quests){
        //$scope.stepsid.push(result.data.steps[s]);
        console.dir(stepObj.name+" quest id " + stepObj.quests[s]);
         questPromise.push(CotData.getQuestFromID($http,stepObj.quests[s]));
    }
    $q.all(questPromise).then((values) => {
              CotData.getState().get("cot").stepsO[q].questsO = [];
                console.log('Step '+values); 
      for(var v in values){
        console.log('Values V : '+values[v].data.name);
        CotData.getState().get("cot").stepsO[q].questsO.push(values[v].data);
        $scope.getRiddle(q, v);
      }
      

    });
  }

  $scope.getRiddle = function(q, v){
      var questObj = CotData.getState().get("cot").stepsO[q].questsO[v];
      var riddlePromise = CotData.getRiddleFromID($http, questObj.riddle);
      riddlePromise.then(function(result){
        CotData.getState().get("cot").stepsO[q].questsO[v].riddleO = result.data;
        console.log("Result : ")
        console.dir(CotData.getState().get("cot"));
      $scope.cotData = CotData.getState().get("cot");

      })
  }

})
    .controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
      $scope.chat = Chats.get($stateParams.chatId);
    })

    .controller('HomeCtrl', function($scope){
      console.log('banane');
      $scope.showTabBar = false;
    })

    .controller('HistoriqueCtrl', function($http, $scope, Historique, $ionicScrollDelegate, CotData){


      $scope.addEvent = function() {

        Historique.postEvent($http, "poi", new Date().getDate(), "12/12/2017", CotData);
        $ionicScrollDelegate.scrollBottom();

      }

      $scope.getEvents = function(){
        $scope.events = [{}];
        var eventsPromise = Historique.getEvents($http);
        eventsPromise.then(function(result){
          var eventsRaw = result.data;
      //get liste joueur

      //
      var index = 0;
      for(var event in eventsRaw){  
        var joueurPromise = CotData.getPlayerNameByID($http, eventsRaw[event].player);
        joueurPromise.then(function(name){
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

.controller('MapCtrl', function($scope, $state, $cordovaGeolocation, $ionicLoading) {

  $scope.checkIn = function(){
    $cordovaGeolocation.getCurrentPosition(options).then(function(position){

      console.log(map);

      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);


      var marker = new google.maps.Marker({
        position: latLng,
        map: map,
        title: 'Hello World!'
      });


    })
  }

  $scope.init = function(){
    $scope.show($ionicLoading);
    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
      mapOptions.center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      var map = new google.maps.Map(document.getElementById("map"), mapOptions);

      var marker = new google.maps.Marker({
        position: mapOptions.center,
        map: map,
        title: 'Position'
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


  $scope.hide = function($ionicLoading){
    $ionicLoading.hide().then(function(){
     console.log("The loading indicator is now hidden");

   })
  }
  



})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller("HomeCtrl", function($scope, $http, $rootScope, $cordovaGeolocation, $ionicLoading, CotData){
  $scope.view = "templates/tabs.html";
  $scope.showtheview = false;
  $scope.choice = $rootScope.choice;
  CotData.setCot($scope.choice);


  $scope.init = function(){
    $scope.show($ionicLoading);

    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
      mapOptions.center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      var map = new google.maps.Map(document.getElementById("map-preview"), mapOptions);
      /*
      for(var steps in $scope.choice.steps)
      {
        console.log('step');
        console.log(steps);
        for(var quests in CotData.step($http,$scope.choice.steps[])){
          for(var poi in CotData.quest($http,steps[quests].)){
            for(var data in CotData.poi($http,poi)){
              
            }

          }
        }
      }*/
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


  $scope.hide = function($ionicLoading){
    $ionicLoading.hide().then(function(){
     console.log("The loading indicator is now hidden");

   })
  }

  $scope.setChoice = function(Data) {
    for(var cot in $scope.cot){
      if($scope.cot[cot]._id == Data)
      {

        $scope.choice = $scope.cot[cot];
        $rootScope.choice = $scope.choice;
        CotData.setIdCot($scope.choice._id);
        break;
      }
    }
    
  };

  var cotPromise = CotData.cots($http);
  cotPromise.then(function(result){
    $scope.cot = result;
    console.log($scope.cot);
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

var options = {timeout: 10000, enableHighAccuracy: true}; 

