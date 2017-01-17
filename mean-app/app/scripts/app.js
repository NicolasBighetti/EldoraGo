'use strict';


// var DB_PATH = "api/";
var DB_PATH= "https://eldorago.herokuapp.com/api/";

/**
 * @ngdoc overview
 * @name clientYo2App
 * @description
 * # clientYo2App
 * angular.module("xeditable", []);
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
    'uiGmapgoogle-maps',
    'angularFileUpload',
    'xeditable'
    // 'ui.router'
  ])
  .config(
    ['uiGmapGoogleMapApiProvider', function (GoogleMapApiProviders) {
      GoogleMapApiProviders.configure({
        //china: true
      });
    }]
  )
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html'
        // controller: 'HomeCtrl',
      })
      .when('/cot', {
        templateUrl: 'views/cot.html',
        controller: 'CotStepCtrl'
      })
      .when('/cot-list', {
        templateUrl: 'views/cot-list.html',
        controller: 'CotListCtrl'
      })
      .when('/enigma-form', {
        templateUrl: 'views/enigma-form.html',
        controller: 'EnigmaFormCtrl'
      })
      .when('/poi-list', {
        templateUrl: 'views/poi-list.html',
        controller: 'PoiListCtrl'
      })
      .when('/stat', {
        templateUrl: 'views/stat.html',
        controller: 'StatCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

angular
  .module('eldoragoApp').run(function(editableOptions, editableThemes) {
  // editableThemes.bs3.inputClass = 'input-sm';

  editableOptions.theme = 'bs3';
  // editableOptions.theme = 'default';
  // editableThemes['default'].submitTpl = '<button type="submit" class="btn btn-primary" title="Submit" aria-label="Submit"><span class="glyphicon glyphicon-ok"></span></button>';
  // console.log(editableThemes['bs3'].submitTpl);
  editableThemes['bs3'].submitTpl = '<button type="submit" class="label label-default"><i class="fa fa-check"></i></button>';
  // console.log(editableThemes['bs3'].submitTpl);
  editableThemes['bs3'].cancelTpl = '<button type="button" class="label label-danger" ng-click="$form.$cancel()" title="Cancel" aria-label="Cancel"><i class="fa fa-times"></i></button>';
  // editableThemes.default.buttonsClass = 'label label-default';
});
