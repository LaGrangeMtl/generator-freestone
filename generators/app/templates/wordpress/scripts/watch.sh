echo "<?php define('ASSETS_VERSION', '`date '+%Y%m%d%H%M%S'`');" > ./dist/assets-version.php
parcel serve 'src/(css|js)/index*(*).(scss|ts|js)' --public-url /assets --dist-dir ./dist/wp-content/themes/<%= props.projectNamespace %>/assets --no-cache --target main --cert ./.ssl/fullchain.pem --key ./.ssl/privkey.pem
