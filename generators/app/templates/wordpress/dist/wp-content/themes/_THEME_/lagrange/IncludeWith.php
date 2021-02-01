<?php function includeWith($filePath, $variables = [], $print = true) {
	$output = NULL;
	$base = __DIR__ . '/../website';
	
	if (file_exists($base . $filePath)) {
		// Extract the variables to a local namespace
		extract($variables);
		ob_start();
		include $base . $filePath;
		$output = ob_get_clean();
	}
	if ($print) {
		print $output;
	}
	
	return $output;
} ?>