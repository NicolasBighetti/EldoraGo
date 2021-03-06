// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services', 'angular-timeline', 'starter.historique', 'starter.cot-datas', 'starter.notifications', 'starter.go-socket'])


.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

  /*.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if(window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
      var div = document.getElementById("map_canvas");
      var map = plugin.google.maps.Map.getMap(div);
    });
  })*/

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js


  $stateProvider

  // setup an abstract state for the tabs directive
   .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })

  .state('tab.historique', {
    url:'/historique',
    views: {
      'tab-historique':{
        templateUrl: 'view/timeline/historique-view.html',
        controller: 'HistoriqueCtrl'
      }
    }
  })

  .state('tab.enigme', {
    url:'/enigme',
    views: {
      'tab-enigme':{
        templateUrl: 'templates/tab-enigme.html',
        controller: 'EnigmeCtrl'
      }
    }
  })

  .state('tab.map', {
    url: '/map',
    //cache: false,
    views: {
      'tab-map':{
        templateUrl: 'templates/map.html',
        controller: 'MapCtrl'
      }
    }
  })
  
  .state('tab.team',{
    url: '/team',
    views: {
      'tab-team':{
        templateUrl: 'templates/teamview.html',
        controller: 'TeamviewCtrl'
      }
    }
  })

  .state('select', {
    url: '/select',
    templateUrl: 'templates/select.html'
  })

  .state('home', {
  url: '/home',
  templateUrl: 'templates/home.html'
});

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/home');

});
