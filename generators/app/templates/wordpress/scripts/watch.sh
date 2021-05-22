echo "<?php define('ASSETS_VERSION', '`date '+%Y%m%d%H%M%S'`');" > ./dist/assets-version.php
parcel watch 'src/(css|js)/(index|index-admin).(scss|js)' --public-url /wp-content/themes/<%= props.projectNamespace %>/assets --dist-dir ./dist/wp-content/themes/<%= props.projectNamespace %>/assets --no-cache --no-hmr &
livereload ./dist/wp-content/themes/<%= props.projectNamespace %>/assets
