'use strict';

/**
 * @ngdoc overview
 * @name clientYo2App
 * @description
 * # clientYo2App
 *
 * Main module of the application.
 */
angular
  .module('eldoragoApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'uiGmapgoogle-maps'
    // 'ui.router'
  ])
  .config(
      ['uiGmapGoogleMapApiProvider', function(GoogleMapApiProviders) {
          GoogleMapApiProviders.configure({
              china: true
          });
      }]
  )
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        // controller: 'HomeCtrl',
      })
      .when('/cot-start', {
        templateUrl: 'views/cot-start.html',
         controller: 'CotStartCtrl',
      })
      .when('/cot-step', {
        templateUrl: 'views/cot-step.html',
         controller: 'CotStepCtrl',
      })
      .when('/enigma-form', {
        templateUrl: 'views/enigma-form.html',
      })
      .when('/poi-list', {
        templateUrl: 'views/poi-list.html',
        controller: 'PoiListCtrl',
      })
      .otherwise({
        redirectTo: '/'
      });
  });
  // .config(function($stateProvider, $urlRouterProvider) {
  //
  //   // Ionic uses AngularUI Router which uses the concept of states
  //   // Learn more here: https://github.com/angular-ui/ui-router
  //   // Set up the various states which the app can be in.
  //   // Each state's controller can be found in controllers.js
  //   $stateProvider
  //
  //   // setup an abstract state for the tabs directive
  //     .state('tab', {
  //     url: '/tab',
  //     abstract: true,
  //     templateUrl: 'views/navbar.html'
  //   })
  //
  //   .state('main', {
  //     url: '/',
  //     abstract: true,
  //     templateUrl: 'views/main.html'
  //   })
  //
  //   // Each tab has its own nav history stack:
  //
  //   .state('tab.cot-start', {
  //     url: '/cot-start',
  //     views: {
  //       'cot-start': {
  //         templateUrl: 'views/cot-start.html',
  //       }
  //     }
  //   });


    // if none of the above states are matched, use this as the fallback
  //   $urlRouterProvider.otherwise('/');
  //
  // });
