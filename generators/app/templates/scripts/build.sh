cd dist
composer update
cd ..
rm -rf dist/assets/js
rm -rf dist/assets/css
parcel build 'src/+(css|js)/index.+(js|scss)' -d dist/assets --no-source-maps