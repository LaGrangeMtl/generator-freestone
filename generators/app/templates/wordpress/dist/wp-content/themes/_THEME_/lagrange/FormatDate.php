<? function formatDate($date) {
	$datePattern = ICL_LANGUAGE_CODE === 'fr' ? 'd-m-Y' : 'm-d-Y';
	
	if($date) {
		return date($datePattern, strtotime($date));
	}
} ?>