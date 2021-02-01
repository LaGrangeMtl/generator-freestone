<? 

function slugify($string, $allowSlash = false){
	$string = transformAccents($string);
	$reg = '/[^a-zA-Z0-9]+/';
	if (!empty($allowSlash)) {
		$reg = '/[^a-zA-Z0-9\/]+/';
	}
	$string = preg_replace($reg, '-', $string);
	$string = preg_replace('/\-+$/', '', $string);
	return strtolower($string);
}

function transformAccents($string){
	return str_replace(
		['Š','Œ','Ž','š','œ','ž','Ÿ','¥','µ','À','Á','Â','Ã','Ä','Å','Æ','Ç','È',
			  'É','Ê','Ë','Ì','Í','Î','Ï','Ð','Ñ','Ò','Ó','Ô','Õ','Ö','Ø','Ù','Ú','Û',
			  'Ü','Ý','ß','à','á','â','ã','ä','å','æ','ç','è','é','ê','ë','ì','í','î',
		'ï','ð','ñ','ò','ó','ô','õ','ö','ø','ù','ú','û','ü','ý','ÿ'],
		['S','Oe','Z','s','oe','z','Y','Y','u','A','A','A','A','A','A','Ae','C','E',
			  'E','E','E','I','I','I','I','D','N','O','O','O','O','O','O','U','U','U',
			  'U','Y','s','a','a','a','a','a','a','ae','c','e','e','e','e','i','i','i',
		'i','o','n','o','o','o','o','o','o','u','u','u','u','y','y'],
		$string
	);
}

?>