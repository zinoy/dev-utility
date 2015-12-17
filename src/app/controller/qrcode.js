angular.module('inspinia').controller('QrCodeCtrl', function($scope) {

    $scope.params = {
        chl: "",
        chs: 4,
        chld: "M",
        cht: "qr"
    };
    $scope.qrSrc = "";

    $scope.genCode = function(e) {
        e.preventDefault();

        $scope.qrSrc = "php/qrcode.php?" + genQuery($scope.params);
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
