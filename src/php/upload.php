<meta name="viewport" content="width=device-width, initial-scale=1">
<?php
header('Content-Type: text/html; charset=utf-8');

if (!isset($_FILES["file"])) {
    echo "<p>No such file!</p>";
    return;
}
$temp = explode(".", $_FILES["file"]["name"]);
$extension = end($temp);

$type = preg_split('/\//', $_FILES["file"]["type"]);
$filename = "upload/" . date("Ymd") . rand(10000, 99999) . "." . $extension;

require __DIR__ . '/vendor/autoload.php';

use PHPQRCode\QRcode;

try {
    if ($_FILES["file"]["error"] > 0) {
        echo "Return Code: " . $_FILES["file"]["error"] . "<br>";
    } else {
        echo "Upload: " . $_FILES["file"]["name"] . "<br />";
        echo "Type: " . $_FILES["file"]["type"] . "<br />";
        echo "Size: " . ($_FILES["file"]["size"] / 1024) . " kB<br />";
        echo "Temp file: " . $_FILES["file"]["tmp_name"] . "<br />";

        if (file_exists($filename)) {
            echo $_FILES["file"]["name"] . " already exists. ";
        } else {
            move_uploaded_file($_FILES["file"]["tmp_name"], $filename);
            echo "Stored in: $filename";
        }

        if ($extension == "3ga") {
            echo "<div><audio src=\"$filename\" controls></audio></div>";
        } else {
            switch ($type[0]) {
                case 'video' :
                    if ($type[1] == "3gpp") {
                        echo "<div><audio src=\"$filename\" controls></audio></div>";
                    } else if (preg_match('/mp4|quicktime/', $type[1])) {
                        echo "<div><video src=\"$filename\" style=\"width:100%\" controls></video></div>";
                    }
                    break;
                case 'audio' :
                    echo "<div><audio src=\"$filename\" controls></audio></div>";
                    break;
                case 'image' :
                    echo "<div><img src=\"$filename\" /></div>";
                    break;
                default :
                    break;
            }
        }

        try {
            $dbh = new PDO('mysql:host=localhost;dbname=test', 'root', 'Abcd1234', array(PDO::ATTR_PERSISTENT => false));

            $stmt = $dbh -> prepare("INSERT INTO upload (path,ip) VALUES (:name,:ip);");

            // call the stored procedure
            $stmt -> execute(array(':name' => $filename, ':ip' => $_SERVER['REMOTE_ADDR']));

            echo "<hr /><b>Share</b><br />";
            $id = $dbh -> lastInsertId();
            QRcode::png("http://192.168.15.254/labs/links/$id", 'tmp_qr.png', 'L', 4, 2);
            echo '<img src="tmp_qr.png" />';
        } catch (PDOException $e) {
            print "Error!: " . $e -> getMessage() . "<br/>";
            die();
        }
    }
} catch (RuntimeException $e) {

    echo $e -> getMessage();

}
?>