echo "<?php define('ASSETS_VERSION', '`date '+%Y%m%d%H%M%S'`');" > ./dist/assets-version.php
parcel watch 'src/(css|js)/index*(*).(scss|js)' --public-url /assets --dist-dir dist/assets --no-hmr &
livereload dist
