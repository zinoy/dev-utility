'use strict';

angular.module('inspinia').controller('SpriteSheetCtrl', ['$scope', '$filter', 'dragDrop',
function($scope, $filter, dragDrop) {

    $scope.editorOptions = {
        mode : "application/json",
        lineNumbers : true,
        matchBrackets : true,
        readOnly : true,
        styleActiveLine : true
    };
    $scope.inputCode = "";
    $scope.inputClass = "";
    $scope.inputPrefix = "";
    $scope.inputDefault = false;
    $scope.inputAnimation = "loop";
    $scope.inputCompress = true;
    $scope.outputCode = "//output here";

    $scope.iboxTools = {
    };

    $scope.dragDrop = dragDrop;

    $scope.rebuild = function(e) {
        e.preventDefault();
        var data;
        try {
            data = JSON.parse($scope.inputCode);
        } catch (ex) {
            $scope.outputCode = "Error: " + ex.message;
            return;
        }
        //console.log(data);
        if (data.animations) {

            var prefix = false,
                ps = 0;
            var tl = [],
                frame_num = [];

            angular.forEach(data.animations, function(value, key) {
                if (!$.isArray(value)) {
                    value = value.frames;
                }
                if (value.length > 1) {
                    for (var i = 0; i < value.length; i++) {
                        tl.push(data.frames[value[i]]);
                    }
                    delete data.animations[key];
                } else {
                    var match = key.match(/\d+$/);
                    if (prefix !== "" && !prefix) {
                        ps = match[0].length;
                        prefix = key.replace(/\d+$/, '');
                    }
                    var tps = ps;
                    ps = match[0].length;
                    if (tps != ps) {
                        ps = 0;
                    }
                    frame_num.push(Number(match[0]));
                }
            });
            frame_num.sort(function compareNumbers(a, b) {
                return a - b;
            });

            if (frame_num.length > 0) {
                var idx = 0;
                var it,
                    ani = [];
                while ( it = data.animations[prefix + pad(frame_num[idx++], ps)]) {
                    var id = (it.frames && it.frames[0]) || it[0];
                    tl.push(data.frames[id]);
                    delete data.animations[prefix + pad(frame_num[idx - 1], ps)];
                    ani.push(idx - 1);
                }
                data.frames = tl;
                data.animations[prefix] = {
                    frames : ani
                };
            }
        }

        if ($scope.inputDefault && $scope.inputAnimation == "loop") {
            data.animations.default = [0, idx - 2];
        } else if (($scope.inputDefault && $scope.inputAnimation == "once") || data.stop) {
            var ef = idx - 2;
            data.animations.default = [0, ef - 1, "stop"];
            data.animations.stop = [ef];
        }
        if ($scope.inputClass) {
            data.name = $scope.inputClass;
        }
        if ($scope.inputPrefix) {
            if (!/\/$/.test($scope.inputPrefix)) {
                $scope.inputPrefix += "/";
            }
            for (var k in data.images) {
                data.images[k] = $scope.inputPrefix + data.images[k];
            }
        }
        delete data.texturepacker;
        if ($scope.inputCompress) {
            $scope.outputCode = JSON.stringify(data);
        } else {
            $scope.outputCode = JSON.stringify(data, null, 4);
        }

        $scope.iboxTools.showhide();
    };

    function isAdvancedUpload() {
        var div = document.createElement('div');
        return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
    }

    function pad(num, size) {
        var s = "000000000" + num;
        return s.substr(s.length - size);
    }

}]);
