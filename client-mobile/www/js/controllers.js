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

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller("HomeCtrl", function($scope, $http, $rootScope){
  $scope.view = "templates/tabs.html";
  $scope.showtheview = false;
  $scope.choice = $rootScope.choice;


  $scope.setChoice = function(Data) {
    $scope.choice = $scope.json[Data];
    $rootScope.choice = $scope.choice;
    console.log($scope.choice);
  };

  //Get JSON
  $http.get('../templates/test.json').success(function (data) {
    $scope.json = data;

    console.log(data);

  })
  .error(function (data) {
    defer.reject('could not find json file')
  });


  //Google mapss
  document.addEventListener("deviceready", function() {
    // Define a div tag with id="map_canvas"
    var mapDiv = document.getElementById("map_canvas");

    // Initialize the map plugin
    var map = plugin.google.maps.Map.getMap(mapDiv);

    // You have to wait the MAP_READY event.
    map.on(plugin.google.maps.event.MAP_READY, onMapInit);
  });


});
