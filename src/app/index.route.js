(function() {
  'use strict';

  angular
    .module('inspinia')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider

        .state('index', {
            abstract: true,
            url: "/",
            templateUrl: "app/components/common/content.html"
        })
        .state('index.main', {
            url: "",
            templateUrl: "app/main/main.html",
            data: { pageTitle: 'Home | DEV UTILITY' }
        })
        .state('spritesheet', {
            abstract: true,
            url: "/spritesheet",
            templateUrl: "app/components/common/content.html"
        })
        .state('spritesheet.createjs', {
            url: "/createjs",
            templateUrl: "app/components/spritesheet.html",
            data: { pageTitle: 'Spritesheet Serializer' }
        })
        .state('utils', {
            abstract: true,
            url: "/utils",
            templateUrl: "app/components/common/content.html"
        })
        .state('utils.qrcode', {
            url: "/qrcode",
            templateUrl: "app/components/qrcode.html",
            data: { pageTitle: 'QR Code Generator' }
        })
        .state('test', {
            abstract: true,
            url: "/test",
            templateUrl: "app/components/common/content.html"
        })
        .state('test.buffer', {
            url: "/buffer",
            templateUrl: "app/components/buffer.html",
            data: { pageTitle: 'Device Buffer Test' }
        })
;

    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);
  }

})();
