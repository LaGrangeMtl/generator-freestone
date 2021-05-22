#!/usr/bin/env bash
echo "<?php define('ASSETS_VERSION', '`date '+%Y%m%d%H%M%S'`');" > ./dist/assets-version.php
npm install
rm -rf dist/assets/js
rm -rf dist/assets/css
parcel build 'src/(css|js)/index*(*).(scss|js)' --public-url /assets --dist-dir dist/assets --no-source-maps --no-scope-hoist
