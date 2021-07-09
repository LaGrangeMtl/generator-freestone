#!/bin/bash

project=${PWD##*/}
project=${project,,}

if [ "$1" = "media"  ] || [ "$1" = "" ]; then
	echo Sync Media
	rsync --recursive --compress dev.enclos.ca:/var/medias/${project}/* ./dist/
fi
