cd dist
composer install
cd ..
parcel watch 'src/(css|js)/index*(*).(scss|js)' --public-url /assets -d dist/assets --no-hmr &
livereload dist