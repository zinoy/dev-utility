'use strict';

angular.module('inspinia').controller('BufferCtrl', function($scope) {

    $scope.count = 100;
    $scope.type = "jpg";

    $scope.run = function(e) {
        e.preventDefault();

        var param = {
            count: $scope.count,
            type: $scope.type
        };

        window.open("http://192.168.1.215/buffer-tester/?" + genQuery(param));
    };

    $scope.checkRange = function() {
        if ($scope.type == 'png' && $scope.count > 700) {
            $scope.count = 700;
        } else if ($scope.count > 1800) {
            $scope.count = 1800;
        }
    };

    function genQuery(obj) {
        if (angular.isObject(obj)) {
            var q = [];
            for (var k in obj) {
                if (obj.hasOwnProperty(k)) {
                    q.push(k + "=" + encodeURIComponent(obj[k]));
                }
            }
            return q.join("&");
        } else {
            return "";
        }
    }

});
