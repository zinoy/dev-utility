<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!-->
<html class="no-js">
<!--<![endif]-->
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <title></title>
  <meta name="description" content="">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="apple-mobile-web-app-capable" content="yes" />

  <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->

  <link rel="stylesheet" href="/labs/css/normalize.css">
  <link rel="stylesheet" href="/shared/styles/default.css">
  <link rel="stylesheet" href="css/main.css">
  <script src="/labs/js/vendor/modernizr-2.6.2.min.js"></script>
</head>
<body>
  <?php
  require __DIR__ . '/vendor/autoload.php';

  session_start();

  $new = isset($_REQUEST["new"]);
  $verify = isset($_REQUEST["verify"]);
  $code = isset($_REQUEST["code"]) ? $_REQUEST["code"] : "";
  $qr = isset($_REQUEST["qr"]);

  use OTPHP\TOTP;

  $secret = openssl_random_pseudo_bytes(10);
  
  use Base32\Base32;
  
  if($new){
      $encoded_secret = Base32::encode($secret);
      setcookie("encoded_secret", $encoded_secret);
  }else{
      if (isset($_COOKIE["encoded_secret"])) {
          $encoded_secret = htmlspecialchars($_COOKIE["encoded_secret"]);
      } else {
          $encoded_secret = Base32::encode($secret);
          $new = TRUE;
      }
  }

  $totp = new TOTP();
  $totp->setLabel("zino")
       ->setSecret($encoded_secret)
       ->setIssuer("Catch Zino")
       //->setIssuerIncludedAsParameter(TRUE)
       ->setDigits(6)
       ->setDigest('sha1')
       ->setInterval(30);
  $uri = "otpauth://totp/Microsoft:zinoy?secret=$encoded_secret&digits=6&issuer=Microsoft";
  
  if (is_string($code)) {
      $result = $totp->verify($code, null, 1);
  }

  ?>
  <h1> </h1>
  <div class="container">
    <div<?php if(!$new && !$qr)echo ' style="display:none"' ?>>
      <img src="qrcode.php?chl=<?php echo $uri;?>&chs=4&chld=M&cht=qr" />
    </div>
    <form>
      <label>Code</label>
      <input type="text" name="code" />
      <button>Check</button>
    </form>
  </div>
  <script>
    console.log("<?php echo $uri;?>");
    <?php
    if ($result) {
        echo 'console.info("Code is valid");';
    } else {
        echo 'console.warn("Code is INVALID!!");';
    }
    ?>
  </script>
</body>
</html>
