cd dist
composer update
cd ..
npm install
rm -rf dist/assets/js
rm -rf dist/assets/css
parcel build 'src/+(css|js)/index.+(js|scss)' -d dist/assets --no-source-maps
