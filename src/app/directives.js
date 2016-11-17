'use strict';

//Directive used to set metisMenu and minimalize button
angular.module('inspinia')
    .directive('pageTitle', function ($rootScope, $timeout) {
        return {
            restrict: 'A',
            link: function(scope, element) {
                var listener = function(event, toState, toParams, fromState, fromParams) {
                    // Default title - load on Dashboard 1
                    var title = 'DEV UTILITY';
                    // Create your own title pattern
                    if (toState.data && toState.data.pageTitle) title = toState.data.pageTitle;
                    $timeout(function() {
                        element.text(title);
                    });
                };
                $rootScope.$on('$stateChangeStart', listener);
            }
        };
    })
    .directive('sideNavigation', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                // Call metsi to build when user signup
                scope.$watch('authentication.user', function() {
                    $timeout(function() {
                        element.metisMenu();
                    });
                });

            }
        };
    })
    .directive('minimalizaSidebar', function ($timeout) {
        return {
            restrict: 'A',
            template: '<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="" ng-click="minimalize()"><i class="fa fa-bars"></i></a>',
            controller: function ($scope) {
                $scope.minimalize = function () {
                    angular.element('body').toggleClass('mini-navbar');
                    if (!angular.element('body').hasClass('mini-navbar') || angular.element('body').hasClass('body-small')) {
                        // Hide menu in order to smoothly turn on when maximize menu
                        angular.element('#side-menu').hide();
                        // For smoothly turn on menu
                        $timeout(function () {
                            angular.element('#side-menu').fadeIn(400);
                        }, 200);
                    } else {
                        // Remove all inline style from jquery fadeIn function to reset menu state
                        angular.element('#side-menu').removeAttr('style');
                    }
                };
            }
        };
    })
    /**
     * iboxTools - Directive for iBox tools elements in right corner of ibox
     */
    .directive('iboxTools', function iboxTools($timeout) {
        return {
            restrict: 'A',
            scope: {
                control: '='
            },
            templateUrl: 'app/components/common/ibox_tools.html',
            controller: function ($scope, $element) {
                // Function for collapse ibox
                $scope.showhide = function () {
                    var ibox = $element.closest('div.ibox');
                    var icon = $element.find('i:first');
                    var content = ibox.find('div.ibox-content');
                    content.slideToggle(200);
                    // Toggle icon from up to down
                    icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                    ibox.toggleClass('').toggleClass('border-bottom');
                    $timeout(function () {
                        ibox.resize();
                        ibox.find('[id^=map-]').resize();
                    }, 50);
                };
                // Function for close ibox
                $scope.closebox = function () {
                    var ibox = $element.closest('div.ibox');
                    ibox.remove();
                };
            },
            link: function (scope, element, attrs) {
                var vm = scope.control || {};
                vm.showhide = scope.showhide;
            }
        };
    })
    .directive('dragNDrop', ['dragDrop', function dragNDrop(dragDrop) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                if (dragDrop) {
                    element.addClass('drop_enabled');
                    element.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                    }).on('dragover dragenter', function() {
                        $(this).addClass('is-dragover');
                    }).on('dragleave dragend drop', function() {
                        $(this).removeClass('is-dragover');
                    }).on('drop', function(e) {
                        var files = e.originalEvent.dataTransfer.files;
                        if (files.length > 0) {
                            var f = files[0];
                            if (/text/.test(f.type) || /\.json$/.test(f.name)) {
                                var reader = new FileReader();
                                reader.onload = function(e) {
                                    if(attrs.ngModel){
                                        scope.$eval(attrs.ngModel + "='" + this.result + "'");
                                        scope.$apply();
                                    }
                                };
                                reader.readAsText(f);
                            }
                        }
                    });
                }
            }
        };
    }])
    .factory('dragDrop', function() {
        var div = document.createElement('div');
        return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
    });


