<?php
header('Content-Type: image/png');

require __DIR__ . '/vendor/autoload.php';

use PHPQRCode\QRcode;

try {
    if (isset($_REQUEST['chl'])) {
        $data = $_REQUEST['chl'];
    } else {
        return;
    }
    $d = 'L';
    if (isset($_REQUEST['chld'])) {
        $d = $_REQUEST['chld'];
    }
    $size = 4;
    if (isset($_REQUEST['chs'])) {
        $size = $_REQUEST['chs'];
    }
    if (isset($data)) {
        QRcode::png($data, null, $d, (int)$size, 2);
    }
} catch (RuntimeException $e) {
    echo $e -> getMessage();
}
