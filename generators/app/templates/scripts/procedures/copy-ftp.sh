if [ ${install} == 'true' ]; then
	echo "${LOG}Installing...${NC}";
	# deploy uploads - should be runned only once.
	# rsync -avzL --progress --no-p --groupmap=*:webmasters dist/uploads/ ubuntu@enclos.ca:${BASE_PATH}/uploads/
	lftp -f "
open $ftp_hostname
user $ftp_username $ftp_password
lcd $ftp_localdir/dist/uploads
mirror --continue --delete --verbose $ftp_localdir/dist/uploads $ftp_remotedir/uploads/
bye
"
	
	# create the _cache folder, only once too
	# ssh ubuntu@enclos.ca "sudo mkdir -p ${BASE_PATH}/_cache && sudo chmod -R 775 ${BASE_PATH}/_cache"
fi