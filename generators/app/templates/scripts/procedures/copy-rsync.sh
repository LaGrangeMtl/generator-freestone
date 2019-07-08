BASE_PATH="/var/www/${NAMESPACE}.enclos.ca/public_html"
BASE=$rsync_username@$rsync_hostname

setPermissions() {
	ssh $BASE "
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
	rsync -avzL --progress --no-p --groupmap=*:webmasters dist/uploads/ $BASE:${BASE_PATH}/uploads/
	
	# create the _cache folder, only once too
	ssh $BASE "sudo mkdir -p ${BASE_PATH}/_cache && sudo chmod -R 775 ${BASE_PATH}/_cache"
fi

if [ ${pull_images} == 'true' ]; then
	echo "${LOG}Pulling images...${NC}";
	# pull les images du serveur
	rsync -avzL --progress $BASE:${BASE_PATH}/admin/thumbnails ./admin/
	rsync -avzL --progress --exclude 'prc*' $BASE:${BASE_PATH}/uploads/ ./dist/uploads/
fi

echo "${LOG}Synching dist files...${NC}";
rsync -avzL --progress --delete --no-p --groupmap=*:webmasters --exclude-from=.rsync.exclude dist/ $BASE:${BASE_PATH}/

if [ "${push_config}" == 'true' ]; then
	echo "${LOG}Synching config files...${NC}";
	rsync -avzL --progress --no-p --groupmap=*:webmasters config/EnvConfig-${env}.php $BASE:${BASE_PATH}/config/EnvConfig.php
fi

setPermissions > /dev/null 2>&1

cd scripts