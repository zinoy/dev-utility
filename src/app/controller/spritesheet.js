'use strict';

angular.module('inspinia').controller('SpriteSheetCtrl', ['$scope', '$filter', 'dragDrop',
function($scope, $filter, dragDrop) {
    var vm = this;
    vm.editorOptions = {
        mode: "application/json",
        lineNumbers: true,
        matchBrackets: true,
        readOnly: true,
        styleActiveLine: true
    };
    vm.inputCode = "";
    vm.inputClass = "";
    vm.inputPrefix = "";
    vm.inputDefault = false;
    vm.inputAniLoop = true;
    vm.inputAniOnce = false;
    vm.inputCompress = true;
    vm.backBtn = false;
    vm.outputCode = "//output here";

    vm.box = {
    };

    vm.dragDrop = dragDrop;

    vm.formatClassname = function() {
        if (vm.inputClass) {
            var arr = vm.inputClass.split(' ');
            if (arr.length > 1) {
                arr = arr.map(function(str) {
                    return str.charAt(0).toUpperCase() + str.slice(1);
                });
                arr[0] = arr[0].charAt(0).toLowerCase() + arr[0].slice(1);
                vm.inputClass = arr.join('');
            }
        }
    };

    vm.rebuild = function(e) {
        e.preventDefault();
        var data;
        try {
            data = JSON.parse(vm.inputCode);
        } catch (ex) {
            vm.outputCode = "Error: " + ex.message;
            return;
        }
        //console.log(data);
        if (data.animations) {

            var prefix = [],
                ps = [];
            var tl = [],
                frame_num = [];

            angular.forEach(data.animations, function(value, key) {
                tl = [];
                if (!$.isArray(value)) {
                    value = value.frames;
                }
                if (value.length > 1) {
                    for (var i = 0; i < value.length; i++) {
                        tl.push(data.frames[value[i]]);
                    }
                    data.animations[key] = [0, tl.length - 1];
                } else {
                    var match = key.match(/\d+$/);
                    var _p = key.replace(/\d+$/, '');
                    var idx = prefix.indexOf(_p);
                    if (idx < 0) {
                        ps.push(match[0].length);
                        prefix.push(_p);
                        frame_num.push([]);
                        idx = prefix.length - 1;
                    } else {
                        var tps = ps[idx];
                        ps[idx] = match[0].length;
                        if (tps != ps[idx]) {
                            ps[idx] = 0;
                        }
                    }
                    frame_num[idx].push(Number(match[0]));
                }
            });
            var anIdx = 0;
            angular.forEach(frame_num, function(value, index) {
                value.sort(function compareNumbers(a, b) {
                    return a - b;
                });

                var idx = 0;
                if (value.length > 0) {
                    var it,
                        ani = [];
                    while ( it = data.animations[prefix[index] + pad(value[idx++], ps[index])]) {
                        var id = it[0];
                        if (id == null) {
                            id = it.frames[0];
                        }

                        tl.push(data.frames[id]);
                        delete data.animations[prefix[index] + pad(value[idx - 1], ps[index])];
                        ani.push(anIdx++);
                    }
                    data.animations[prefix[index].replace(/[\s\_\-]/g, "")] = {
                        frames: ani
                    };
                } else {
                    anIdx += tl.length;
                    data.frames = tl;
                }
            });
            data.frames = tl;

        }

        if (!vm.inputDefault && Object.keys(data.animations).length == 1) {
            data.animations = {};
        }
        if (vm.inputAniLoop || vm.inputAniOnce) {
            angular.forEach(data.animations, function(value, key) {
                genAni(data.animations, key);
            });
            if (Object.keys(data.animations).length === 0) {
                genAni(data.animations, data.frames.length);
            }
        }
        if (vm.inputClass) {
            data.name = vm.inputClass;
        }
        if (vm.inputPrefix) {
            if (!/\/$/.test(vm.inputPrefix)) {
                vm.inputPrefix += "/";
            }
            for (var k in data.images) {
                data.images[k] = vm.inputPrefix + data.images[k];
            }
        }
        delete data.texturepacker;
        if (vm.inputCompress) {
            vm.outputCode = JSON.stringify(data);
        } else {
            vm.outputCode = JSON.stringify(data, null, 4);
        }

        vm.box.showhide();
        vm.backBtn = true;
    };

    vm.reset = function() {
        vm.box.showhide();
        vm.backBtn = false;
    };

    function genAni(list, key) {
        var ef,
            loopKey,
            onceKey,
            stopKey;
        if (angular.isString(key)) {
            ef = list[key].frames.length - 1;
            key = key.toLowerCase().replace(/[\_\-\ ]$/, "");
            loopKey = key + 'Loop';
            onceKey = key + 'Once';
            stopKey = key + 'Stop';
        } else if (angular.isNumber(key)) {
            ef = key - 1;
            loopKey = 'loop';
            onceKey = 'once';
            stopKey = 'stop';
        }
        if (vm.inputAniLoop) {
            list[loopKey] = [0, ef];
        }
        if (vm.inputAniOnce) {
            list[onceKey] = [0, ef - 1, stopKey];
            list[stopKey] = [ef];
        }
    }

    function isAdvancedUpload() {
        var div = document.createElement('div');
        return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
    }

    function pad(num, size) {
        var s = "000000000" + num;
        return s.substr(s.length - size);
    }

}]);
