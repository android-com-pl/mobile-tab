<?php

require dirname(__DIR__).'/vendor/autoload.php';

// Keep the integration database isolated from the developer's forum.
$directory = __DIR__.'/integration/tmp';
if (! is_dir($directory)) {
    mkdir($directory, 0777, true);
}
if (! file_exists($directory.'/database.sqlite')) {
    touch($directory.'/database.sqlite');
}
putenv('FLARUM_TEST_TMP_DIR_LOCAL='.$directory);
putenv('DB_DRIVER=sqlite');
putenv('DB_DATABASE='.$directory.'/database.sqlite');
putenv('DB_PASSWORD=');
