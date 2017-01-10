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
    'ui.bootstrap',
    'smart-table',
    'ngMaterial',
    'ngMessages',
    'material.svgAssetsCache',
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
      .when('/cot', {
        templateUrl: 'views/cot.html',
         controller: 'CotStepCtrl',
      })
      .when('/cot-list', {
        templateUrl: 'views/cot-list.html',
         controller: 'CotListCtrl',
      })
      .when('/enigma-form', {
        templateUrl: 'views/enigma-form.html',
        controller: 'EnigmaFormCtrl'
      })
      .when('/poi-list', {
        templateUrl: 'views/poi-list.html',
        controller: 'PoiListCtrl',
      })
      .when('/stat', {
        templateUrl: 'views/stat.html',
        controller: 'StatCtrl'
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
