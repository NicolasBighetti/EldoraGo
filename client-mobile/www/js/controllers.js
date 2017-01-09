angular.module('starter.controllers', [])

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

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('HomeCtrl', function($scope){
  console.log('banane');
  $scope.showTabBar = false;
})

.controller('HistoriqueCtrl', function($scope, Historique, $ionicScrollDelegate){
  $scope.events = Historique.all();
  $scope.descriptions = Historique.desc;
  $scope.icons = Historique.icon;
  $scope.colors = Historique.color;

  $scope.addEvent = function() {
    $scope.events.push({
      joueur: 'Jean-Michel Retard',
      type: 'poi',
      timestamp: '10/11/12'
      })
    $ionicScrollDelegate.scrollBottom();

  }
})

.controller('MapCtrl', function($scope, $state, $cordovaGeolocation, $ionicLoading) {
  var options = {timeout: 10000, enableHighAccuracy: true}; 

  $scope.init = function(){
      $cordovaGeolocation.getCurrentPosition(options).then(function(position){
        console.log("init");
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        var mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };


        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        //Essayons de fix des trucs avec des lignes au hasard de l'internet
        google.maps.event.trigger(map, 'resize');

        console.log(map);
      })
    }



console.log($scope.map);
    $scope.map = map;
    console.log($scope.map);

      /*$scope.loading = $ionicLoading.show({
          content: 'Getting current location...',
          showBackdrop: false
        });*/
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller("HomeCtrl", function($scope, $http, $rootScope/*, $state, $cordovaGeolocation*/){
  $scope.view = "templates/tabs.html";
  $scope.showtheview = false;
  $scope.choice = $rootScope.choice;


  $scope.setChoice = function(Data) {
    $scope.choice = $scope.json[Data];
    $rootScope.choice = $scope.choice;
    console.log($scope.choice);
  };

  //Get JSON
  $http.get('templates/test.json').success(function (data) {
    $scope.json = data;

    console.log(data);

  })
  .error(function (data) {
    defer.reject('could not find json file')
  });


});
