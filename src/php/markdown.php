<?php
require __DIR__ . '/vendor/autoload.php';

use Ciconia\Ciconia;
use Ciconia\Extension\Gfm;

$exist = FALSE;

if (isset($_GET["path"])) {
    $filepath = 'd:/work/' . $_GET["path"];
    $exist = file_exists($filepath);
    if (!$exist) {
        $filepath = 'd:/work/sites/' . $_GET["path"];
    }
} else {
    echo '<p>Invaild arguments.</p>';
    return;
}
if ($exist || file_exists($filepath)) {
    $content = file_get_contents($filepath);
    if ($content) {
        $ciconia = new Ciconia();
        $ciconia -> addExtension(new Gfm\FencedCodeBlockExtension());
        $ciconia -> addExtension(new Gfm\TaskListExtension());
        $ciconia -> addExtension(new Gfm\InlineStyleExtension());
        $ciconia -> addExtension(new Gfm\WhiteSpaceExtension());
        $ciconia -> addExtension(new Gfm\TableExtension());
        $ciconia -> addExtension(new Gfm\UrlAutoLinkExtension());
        $md = $ciconia -> render($content);
        //echo "$html";
        
        $doc = new DOMDocument();
        $doc->loadHTMLFile(__DIR__ . "/../markdown.html");
        $html = $doc->saveHTML();
        
        $string = 'April 15, 2003';
        $pattern = '/((?:styles|scripts)\/[\w\-\.]+)/i';
        $replacement = '/dev-utility/dist/${1}';
        $html = preg_replace($pattern, $replacement, $html);
        
        $html = str_replace('[@filename]', basename($filepath), $html);
        echo str_replace('[@article]', $md, $html);
    }
} else {
    echo '<p>No such file.</p>';
}
?>
