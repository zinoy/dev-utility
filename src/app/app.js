'use strict';

angular.module('inspinia', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ui.router', 'ui.bootstrap', 'ui.codemirror'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('index', {
            abstract: true,
            url: "/index",
            templateUrl: "components/common/content.html",
        })
        .state('index.main', {
            url: "/main",
            templateUrl: "app/main/main.html",
            data: { pageTitle: 'Example view' }
        })
        .state('index.minor', {
            url: "/minor",
            templateUrl: "app/minor/minor.html",
            data: { pageTitle: 'Example view' }
        })
        .state('spritesheet', {
            abstract: true,
            url: "/spritesheet",
            templateUrl: "components/common/content.html",
        })
        .state('spritesheet.createjs', {
            url: "/createjs",
            templateUrl: "components/spritesheet.html",
            data: { pageTitle: 'Spritesheet Serializer' }
        })

    $urlRouterProvider.otherwise('/index/main');
  })
;
