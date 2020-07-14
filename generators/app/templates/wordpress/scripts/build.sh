rm -rf /dist/wp-content/themes/<%= props.projectNamespace %>/assets/js
rm -rf /dist/wp-content/themes/<%= props.projectNamespace %>/assets/css
npm install
parcel build 'src/+(css|js)/(index|index-admin).+(js|scss)' --public-url /wp-content/themes/<%= props.projectNamespace %>/assets -d ./dist/wp-content/themes/<%= props.projectNamespace %>/assets --no-source-maps