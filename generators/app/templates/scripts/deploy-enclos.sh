#!/bin/bash

NAMESPACE=test #<%= props.projectNamespace %>
install='false'
pull_images='false'
env='dev'

LOG='\033[0;36m'
NC='\033[0m'

echo "./configs/config-${env}.sh"
. ./configs/config-${env}.sh

echo ${is_ftp}

while getopts 'ipc:' flag; do
  case "${flag}" in
    i) install='true' ;;
    p) pull_images='true' ;;
    c) env=$OPTARG ;;
  esac
done

BASE_PATH="/var/www/${NAMESPACE}.enclos.ca/public_html"

if [ "${is_ftp}" == 'true' ]; then
	curlftpfs ${ftp_hostname}/${ftp_remotedir} ${ftp_localdir} -o user=${ftp_user}:${ftp_password}
	exit;
fi
exit;

setPermissions() {
	ssh ubuntu@enclos.ca "
		sudo chown -R ubuntu:webmasters ${BASE_PATH} &&
		sudo chmod -R 755 ${BASE_PATH} &&
		sudo chmod -R 775 ${BASE_PATH}/_cache &&
		sudo chmod -R 775 ${BASE_PATH}/admin/thumbnails &&
		sudo chmod -R 775 ${BASE_PATH}/uploads";
}

cd ..

setPermissions > /dev/null 2>&1

if [ ${install} == 'true' ]; then
	echo "${LOG}Installing...${NC}";
	# deploy uploads - should be runned only once.
	rsync -avzL --progress --no-p --groupmap=*:webmasters dist/uploads/ ubuntu@enclos.ca:${BASE_PATH}/uploads/
	
	# create the _cache folder, only once too
	ssh ubuntu@enclos.ca "sudo mkdir -p ${BASE_PATH}/_cache && sudo chmod -R 775 ${BASE_PATH}/_cache"
fi

if [ ${pull_images} == 'true' ]; then
	echo "${LOG}Pulling images...${NC}";
	# pull les images du serveur
	rsync -avzL --progress ubuntu@enclos.ca:${BASE_PATH}/admin/thumbnails ./admin/
	rsync -avzL --progress --exclude 'prc*' ubuntu@enclos.ca:${BASE_PATH}/uploads/ ./dist/uploads/
fi

echo "${LOG}Synching dist files...${NC}";
rsync -avzL --progress --delete --no-p --groupmap=*:webmasters --exclude-from=.rsync.exclude dist/ ubuntu@enclos.ca:${BASE_PATH}/

if [ "${env}" != '' ]; then
	echo "${LOG}Synching config files...${NC}";
	rsync -avzL --progress --no-p --groupmap=*:webmasters config/EnvConfig-${env}.php ubuntu@enclos.ca:${BASE_PATH}/config/EnvConfig.php
fi

setPermissions > /dev/null 2>&1

cd scripts