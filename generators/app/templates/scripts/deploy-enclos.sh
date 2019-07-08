#!/bin/bash

NAMESPACE=<%= props.projectNamespace %>

setPermissions() {
	ssh ubuntu@enclos.ca "
		sudo chown -R ubuntu:webmasters /var/www/${NAMESPACE}.enclos.ca/public_html &&
		sudo chmod -R 755 /var/www/${NAMESPACE}.enclos.ca/public_html &&
		sudo chmod -R 775 /var/www/${NAMESPACE}.enclos.ca/public_html/c/${NAMESPACE}/admin/thumbnails &&
		sudo chmod -R 775 /var/www/${NAMESPACE}.enclos.ca/public_html/c/${NAMESPACE}/uploads";
}

# deploy uploads - should be runned only once.
# rsync -avzLR --progress --no-p --groupmap=*:webmasters ./c/${NAMESPACE}/uploads ubuntu@enclos.ca:/var/www/${NAMESPACE}.enclos.ca/public_html/
# create the _cache folder, only once too
# ssh ubuntu@enclos.ca "sudo mkdir /var/www/${NAMESPACE}.enclos.ca/public_html/c/${NAMESPACE}/_cache && sudo chmod -R 775 /var/www/${NAMESPACE}.enclos.ca/public_html/c/${NAMESPACE}/_cache"

	#prend les fichiers de lang et les imgdb, etc. (doit être actif si le client peut changer les langs)
	# rsync -avzL --progress ubuntu@enclos.ca:/var/www/${NAMESPACE}.enclos.ca/public_html/c/${NAMESPACE}/admin/thumbnails ./admin/
	# rsync -avzL --progress ubuntu@enclos.ca:/var/www/${NAMESPACE}.enclos.ca/public_html/c/${NAMESPACE}/lang .
	# rsync -avzL --progress --exclude 'prc*' ubuntu@enclos.ca:/var/www/${NAMESPACE}.enclos.ca/public_html/c/${NAMESPACE}/uploads .

cd ../..

setPermissions

rsync -avzL --progress --no-p --groupmap=*:webmasters --exclude-from=.rsync.exclude . ubuntu@enclos.ca:/var/www/${NAMESPACE}.enclos.ca/public_html/

rsync -avzL --progress --no-p --groupmap=*:webmasters ./c/${NAMESPACE}/config/. ubuntu@enclos.ca:/var/www/${NAMESPACE}.enclos.ca/public_html

rsync -avzLR --progress --no-p --groupmap=*:webmasters --exclude-from=.rsync.exclude ./c/${NAMESPACE} ubuntu@enclos.ca:/var/www/${NAMESPACE}.enclos.ca/public_html/

ssh ubuntu@enclos.ca mkdir -p /var/www/${NAMESPACE}.enclos.ca/public_html/admin
rsync -avzL --progress --no-p --groupmap=*:webmasters admin/dist/. ubuntu@enclos.ca:/var/www/${NAMESPACE}.enclos.ca/public_html/admin

setPermissions

cd c/${NAMESPACE}
