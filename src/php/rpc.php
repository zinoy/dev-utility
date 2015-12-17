<?php
require __DIR__ . '/vendor/autoload.php';

$act = isset($_GET['act']) ? $_GET['act'] : 'add';
$id = isset($_GET['id']) ? $_GET['id'] : '300345';

if($act == 'add' && $id != '') {
  $config = array(
      'host'     => 'http://remote.zino.co:9091',
      'endpoint' => '/transmission/rpc',
      'username' => 'zino', // Optional
      'password' => 'fdjk313?' // Optional
  );
  $transmission = new Vohof\Transmission($config);
  
  try {
    $torrent = $transmission->add('https://totheglory.im/dl/' . $id . '/fa90af820d18aaae20b6da35e0c808d3');
    echo json_encode(array('code' => 0, 'torrent' => $torrent['torrent-added']));
  } catch (Exception $e) {
    echo '{"code":1,"error":"'.$e->getMessage().'"}';
  }
}
?>
