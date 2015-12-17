'use strict';

angular.module('inspinia').controller('SpriteSheetCtrl', function($scope, $filter) {

    $scope.editorOptions = {
        mode: "application/json",
        lineNumbers: true,
        matchBrackets: true,
        readOnly: true,
        styleActiveLine: true
    };
    $scope.inputCode = "";
    $scope.inputClass = "";
    $scope.inputPrefix = "";
    $scope.inputCompress = true;
    $scope.outputCode = "//output here";

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

            var prefix = false, ps = 0;
            var tl = [], multi = false, fn = [];
            var start_index = 0;

            for (var k in data.animations) {
                var ani = data.animations[k];
                if (ani.length > 1) {
                    multi = true;
                    for (var i = 0; i < ani.length; i++) {
                        tl.push(data.frames[ani[i]]);
                    }
                    delete data.animations[k];
                } else if (/\d+$/.test(k)) {
                    var match = k.match(/\d+$/);
                    if (!prefix) {
                        ps = match[0].length;
                        prefix = k.replace(/\d+$/, '');
                    }
                    fn.push(Number(match[0]));
                }
            }
            if (!multi) {
                start_index = $filter('orderBy')(fn, '+')[0];
            }

            if (prefix) {
                var idx = start_index;
                var it;
                while ( it = data.animations[prefix + pad(idx++, ps)]) {
                    tl.push(data.frames[it[0]]);
                }
                data.frames = tl;
                for (var key in data.animations) {
                    if (data.animations.hasOwnProperty(key)) {
                        var reg = new RegExp(prefix + "\\d+$");
                        if (reg.test(key)) {
                            delete data.animations[key];
                        }
                    }
                }

                if (data.stop) {
                    var ef = idx - 2;
                    data.animations.stop = ef;
                    data.animations.timeline = [0, ef - 1, "stop"];
                }
            } else {
                for (var k in data.animations) {
                    var ani = data.animations[k];
                    for (var i = 0; i < ani.length; i++) {
                        tl.push(data.frames[ani[i]]);
                    }
                    delete data.animations[k];
                }
                data.frames = tl;
            }
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
    };

    function pad(num, size) {
        var s = "000000000" + num;
        return s.substr(s.length - size);
    }

});
