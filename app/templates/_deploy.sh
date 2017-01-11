#!/bin/bash

setPermissions() {
	ssh ubuntu@enclos.ca "
		sudo chown -R ubuntu:webmasters /var/www/<%= props.projectNamespace %>.enclos.ca/public_html &&
		sudo chmod -R 755 /var/www/<%= props.projectNamespace %>.enclos.ca/public_html &&
		sudo chmod -R 775 /var/www/<%= props.projectNamespace %>.enclos.ca/public_html/c/<%= props.projectNamespace %>/admin/thumbnails &&
		sudo chmod -R 775 /var/www/<%= props.projectNamespace %>.enclos.ca/public_html/c/<%= props.projectNamespace %>/lang
		sudo chmod -R 775 /var/www/<%= props.projectNamespace %>.enclos.ca/public_html/c/<%= props.projectNamespace %>/uploads";
}

cd ../..

setPermissions

# deploy uploads - should be runned only once.
# rsync -avzLR --progress --no-p --groupmap=*:webmasters ./c/<%= props.projectNamespace %/uploads ubuntu@enclos.ca:/var/www/<%= props.projectNamespace %>.enclos.ca/public_html/
# create the _cache folder, only once too
# ssh ubuntu@enclos.ca "sudo mkdir /var/www/<%= props.projectNamespace %>.enclos.ca/public_html/c/<%= props.projectNamespace %/_cache && sudo chmod -R 755 /var/www/<%= props.projectNamespace %>.enclos.ca/public_html/c/<%= props.projectNamespace %/_cache"

rsync -avzL --progress --no-p --groupmap=*:webmasters --exclude-from=.rsync.exclude . ubuntu@enclos.ca:/var/www/<%= props.projectNamespace %>.enclos.ca/public_html/

rsync -avzL --progress --no-p --groupmap=*:webmasters ./c/<%= props.projectNamespace %>/config/. ubuntu@enclos.ca:/var/www/<%= props.projectNamespace %>.enclos.ca/public_html

rsync -avzLR --progress --no-p --groupmap=*:webmasters --exclude-from=.rsync.exclude ./c/<%= props.projectNamespace %> ubuntu@enclos.ca:/var/www/<%= props.projectNamespace %>.enclos.ca/public_html/

setPermissions

cd c/<%= props.projectNamespace %>
