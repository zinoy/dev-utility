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
    
    vm.isCollapsed = true;

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
                if (!angular.isArray(value)) {
                    value = value.frames;
                }
                var match = key.match(/\d+$/);
                var _p = key.replace(/\d+$/, '');
                var idx = prefix.indexOf(_p);
                if (idx < 0) {
                    ps.push( match ? match[0].length : 0);
                    prefix.push(_p);
                    frame_num.push([]);
                    idx = prefix.length - 1;
                } else if (match) {
                    var tps = ps[idx];
                    ps[idx] = match[0].length;
                    if (tps != ps[idx]) {
                        ps[idx] = 0;
                    }
                }
                if (value.length > 1) {
                    var startIdx = tl.length;
                    for (var i = 0; i < value.length; i++) {
                        tl.push(data.frames[value[i]]);
                    }
                    data.animations[key] = [startIdx, startIdx + value.length - 1];
                } else {
                    frame_num[idx].push(Number(match[0]));
                }
            });
            var anIdx = tl.length;
            angular.forEach(frame_num, function(value, animateIdx) {
                if ($.isArray(value) && value.length > 0) {
                    value.sort(function compareNumbers(a, b) {
                        return a - b;
                    });

                    var frameIdx = 0;
                    var it,
                        ani = [];
                    while ( it = data.animations[prefix[animateIdx] + pad(value[frameIdx++], ps[animateIdx])]) {
                        var id = it[0];
                        if (id == null) {
                            id = it.frames[0];
                        }

                        tl.push(data.frames[id]);
                        delete data.animations[prefix[animateIdx] + pad(value[frameIdx - 1], ps[animateIdx])];
                        ani.push(anIdx++);
                    }
                    data.animations[formatString(prefix[animateIdx])] = {
                        frames: ani
                    };
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
        var startFrame = 0,
            endFrame,
            loopKey,
            onceKey,
            stopKey;
        if (angular.isString(key)) {
            startFrame = list[key].frames ? list[key].frames[0] : list[key][0];
            endFrame = list[key].frames ? startFrame + list[key].frames.length - 1 : list[key][list[key].length - 1];
            key = formatString(key);
            loopKey = key + 'Loop';
            onceKey = key + 'Once';
            stopKey = key + 'Stop';
        } else if (angular.isNumber(key)) {
            endFrame = key - 1;
            loopKey = 'loop';
            onceKey = 'once';
            stopKey = 'stop';
        }
        if (vm.inputAniLoop) {
            list[loopKey] = [startFrame, endFrame];
        }
        if (vm.inputAniOnce) {
            list[onceKey] = [startFrame, endFrame - 1, stopKey];
            list[stopKey] = [endFrame];
        }
    }

    function formatString(str) {
        return str.replace(/[\s\_\-]+\w/g, function(l) {
            return l.replace(/[\s\_\-]+/g, "").toUpperCase();
        });
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
