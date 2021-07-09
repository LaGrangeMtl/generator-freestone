#!/bin/bash

project=${PWD##*/}
project=${project,,}
project="$(echo ${project} | sed 's/wordpress-//')"

if [ "$1" = "db"  ] || [ "$1" = "" ]; then
	echo Sync Database
	mkdir -p ./db
	ssh ubuntu@dev.enclos.ca "sudo mysqldump ${project}_master_dev" > ./db/dump.sql
	# Peach Wordpress Database
	cd scripts
	node peach_manager.js https ${project} master local enclos.ca ../db/dump.sql
	cd ..
	sudo mysql -uroot --execute="DROP DATABASE IF EXISTS \`${project}_master_local\` ; CREATE DATABASE \`${project}_master_local\` ;"
	sudo mysql -uroot -D "${project}_master_local" < ./db/dump.sql
fi

if [ "$1" = "media"  ] || [ "$1" = "" ]; then
	echo Sync Media
	rsync --recursive --compress dev.enclos.ca:/var/medias/${project}/* ./dist/
fi
