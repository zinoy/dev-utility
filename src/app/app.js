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
        .state('utils', {
            abstract: true,
            url: "/utils",
            templateUrl: "components/common/content.html",
        })
        .state('utils.qrcode', {
            url: "/qrcode",
            templateUrl: "components/qrcode.html",
            data: { pageTitle: 'QR Code Generator' }
        })
        .state('test', {
            abstract: true,
            url: "/test",
            templateUrl: "components/common/content.html",
        })
        .state('test.buffer', {
            url: "/buffer",
            templateUrl: "components/buffer.html",
            data: { pageTitle: 'Device Buffer Test' }
        })
;
    $urlRouterProvider.otherwise('/index/main');
  })
;
