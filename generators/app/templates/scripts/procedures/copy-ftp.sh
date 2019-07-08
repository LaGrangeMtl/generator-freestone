ftp_exec() {
	lftp -e "$1" -u $ftp_username,$ftp_password $ftp_hostname/$ftp_remotedir
}

if [ ${install} == 'true' ]; then
	echo "${LOG}Installing...${NC}";
	# deploy uploads - should be runned only once.
	ftp_exec "mirror -R --exclude-glob-from=../.rsync.exclude $ftp_localdir/uploads/ ./uploads/; bye"
	ftp_exec "mirror -R --exclude-glob-from=../.rsync.exclude $ftp_localdir/admin/thumbnails/ ./admin/thumbnails/; bye"
	
	# create the _cache folder, only once too
	ftp_exec "mkdir -f _cache"
fi

if [ ${pull_images} == 'true' ]; then
	echo "${LOG}Pulling images...${NC}";
	# pull les images du serveur
	ftp_exec "mirror --exclude-glob-from=../.rsync.exclude ./admin/thumbnails/ $ftp_localdir/admin/thumbnails/; bye"
	ftp_exec "mirror --exclude-glob-from=../.rsync.exclude ./uploads/ $ftp_localdir/uploads/; bye"
fi

echo "${LOG}Synching dist files...${NC}";
ftp_exec "mirror -R --delete --exclude-glob-from=../.rsync.exclude $ftp_localdir/ ./; bye"

if [ "${push_config}" == 'true' ]; then
	echo "${LOG}Synching config files...${NC}";
	ftp_exec "put $ftp_localdir/../config/EnvConfig-${env}.php -o ./config/EnvConfig.php; bye"
fi