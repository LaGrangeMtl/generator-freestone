cd dist
composer update
cd ..
parcel watch 'src/(css|js)/index.(scss|js)' -d dist/assets --no-hmr --public-url /assets/ &
livereload dist