cd dist
composer update
cd ..
parcel 'src/+(css|js)/index.+(js|scss)' -d dist/assets --public-url /assets/