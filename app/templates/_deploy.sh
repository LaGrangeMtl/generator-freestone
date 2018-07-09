#!/bin/bash

setPermissions() {
	ssh ubuntu@enclos.ca "
		sudo chown -R ubuntu:webmasters /var/www/<%= props.projectNamespace %>.enclos.ca/public_html &&
		sudo chmod -R 755 /var/www/<%= props.projectNamespace %>.enclos.ca/public_html &&
		sudo chmod -R 775 /var/www/<%= props.projectNamespace %>.enclos.ca/public_html/c/<%= props.projectNamespace %>/admin/thumbnails &&
		sudo chmod -R 775 /var/www/<%= props.projectNamespace %>.enclos.ca/public_html/c/<%= props.projectNamespace %>/lang
		sudo chmod -R 775 /var/www/<%= props.projectNamespace %>.enclos.ca/public_html/c/<%= props.projectNamespace %>/uploads";
}

# deploy uploads - should be runned only once.
# rsync -avzLR --progress --no-p --groupmap=*:webmasters ./c/<%= props.projectNamespace %>/uploads ubuntu@enclos.ca:/var/www/<%= props.projectNamespace %>.enclos.ca/public_html/
# create the _cache folder, only once too
# ssh ubuntu@enclos.ca "sudo mkdir /var/www/<%= props.projectNamespace %>.enclos.ca/public_html/c/<%= props.projectNamespace %>/_cache && sudo chmod -R 775 /var/www/<%= props.projectNamespace %>.enclos.ca/public_html/c/<%= props.projectNamespace %>/_cache"

	#prend les fichiers de lang et les imgdb, etc. (doit être actif si le client peut changer les langs)
	# rsync -avzL --progress ubuntu@enclos.ca:/var/www/<%= props.projectNamespace %>.enclos.ca/public_html/c/<%= props.projectNamespace %>/admin/thumbnails ./admin/
	# rsync -avzL --progress ubuntu@enclos.ca:/var/www/<%= props.projectNamespace %>.enclos.ca/public_html/c/<%= props.projectNamespace %>/lang .
	# rsync -avzL --progress --exclude 'prc*' ubuntu@enclos.ca:/var/www/<%= props.projectNamespace %>.enclos.ca/public_html/c/<%= props.projectNamespace %>/uploads .

cd ../..

setPermissions

rsync -avzL --progress --no-p --groupmap=*:webmasters --exclude-from=.rsync.exclude . ubuntu@enclos.ca:/var/www/<%= props.projectNamespace %>.enclos.ca/public_html/

rsync -avzL --progress --no-p --groupmap=*:webmasters ./c/<%= props.projectNamespace %>/config/. ubuntu@enclos.ca:/var/www/<%= props.projectNamespace %>.enclos.ca/public_html

rsync -avzLR --progress --no-p --groupmap=*:webmasters --exclude-from=.rsync.exclude ./c/<%= props.projectNamespace %> ubuntu@enclos.ca:/var/www/<%= props.projectNamespace %>.enclos.ca/public_html/

ssh ubuntu@enclos.ca mkdir -p /var/www/<%= props.projectNamespace %>.enclos.ca/public_html/admin
rsync -avzL --progress --no-p --groupmap=*:webmasters admin/dist/. enclos.ca:/var/www/<%= props.projectNamespace %>.enclos.ca/public_html/admin

setPermissions

cd c/<%= props.projectNamespace %>
