cd dist
composer update
cd ..
parcel build 'src/+(css|js)/index.+(js|scss)' -d dist/assets