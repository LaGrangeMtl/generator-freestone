cd dist
composer update
cd ..
parcel watch 'src/+(css|js)/index.+(js|scss)' -d dist/assets