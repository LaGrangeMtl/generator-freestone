echo "<?php define('ASSETS_VERSION', '`date '+%Y%m%d%H%M%S'`');" > ./dist/assets-version.php
rm -rf /dist/wp-content/themes/<%= props.projectNamespace %>/assets/js
rm -rf /dist/wp-content/themes/<%= props.projectNamespace %>/assets/css
npm install
parcel build 'src/+(css|js)/(index|index-admin).+(js|scss)' --public-url /wp-content/themes/<%= props.projectNamespace %>/assets --dist-dir ./dist/wp-content/themes/<%= props.projectNamespace %>/assets --no-source-maps --no-scope-hoist
