#!/usr/bin/env bash
npm install
cd dist
composer install
cd ..
rm -rf dist/assets/js
rm -rf dist/assets/css
parcel build 'src/(css|js)/index*(*).(scss|js)' --public-url /assets -d dist/assets --no-source-maps
