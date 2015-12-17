<meta name="viewport" content="width=device-width, initial-scale=1">
<?php
$id = $_SERVER['QUERY_STRING'];

if (!is_numeric($id)) {
    echo 'Parament error!';
    return;
}

try {
    $dbh = new PDO('mysql:host=localhost;dbname=test', 'root', 'Abcd1234', array(PDO::ATTR_PERSISTENT => false));

    $stmt = $dbh -> prepare("SELECT path FROM upload WHERE id=?;");

    // call the stored procedure
    $stmt -> execute(array($id));

    $finfo = finfo_open(FILEINFO_MIME_TYPE);

    while ($rlt = $stmt -> fetch()) {
        $filename = $rlt[0];
        $type = preg_split('/\//', finfo_file($finfo, $filename));
        $filename = '../' . $filename;
        echo '<a href="' . $filename . '">Download File</a>.<br />';
        switch ($type[0]) {
            case 'video' :
                if ($type[1] == "3gpp") {
                    echo "<div><audio src=\"$filename\" controls></audio></div>";
                } else if (preg_match('/mp4|quicktime/', $type[1])) {
                    echo "<div><video src=\"$filename\" style=\"width:100%;display:inline;\" controls>not support</video></div>";
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
} catch (PDOException $e) {
    print "Error!: " . $e -> getMessage() . "<br/>";
    die();
}
?>