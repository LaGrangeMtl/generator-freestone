<?php

/**
 * Dynamically loads the class attempting to be instantiated elsewhere in the
 * plugin.
 *
 * @package LaGrange\Inc
 */
 
spl_autoload_register( 'lagrange_autoload' );
 
/**
 * Dynamically loads the class attempting to be instantiated elsewhere in the
 * plugin by looking at the $class_name parameter being passed as an argument.
 *
 * The argument should be in the form: TutsPlus_Namespace_Demo\Namespace. The
 * function will then break the fully-qualified class name into its pieces and
 * will then build a file to the path based on the namespace.
 *
 * The namespaces in this plugin map to the paths in the directory structure.
 *
 * @param string $class_name The fully-qualified name of the class to load.
 */
function lagrange_autoload( $class_name ) {
	if (strpos( $class_name, 'LaGrange' ) !== false) {
		$subdirectory = 'lagrange';
	} else if (strpos( $class_name, 'Website' ) !== false) {
		$subdirectory = 'website';
	} else {
		return;
	}

	// Split the class name into an array to read the namespace and class.
	$file_parts = explode( '\\', $class_name );
 
	// Do a reverse loop through $file_parts to build the path to the file.
	$namespace = '';
	for ( $i = count( $file_parts ) - 1; $i > 0; $i-- ) {
		$current = $file_parts[ $i ];
		$current = str_ireplace( '_', '-', $current );

		if ( count( $file_parts ) - 1 === $i ) {
			$file_name = "$current.php";
		} else {
			$namespace = '/' . $current . $namespace;
		}
	}

	$filepath  = trailingslashit( dirname( dirname( __FILE__ ) ) . '/' . $subdirectory . '/' . $namespace );
	$filepath .= $file_name;

	if ( file_exists( $filepath ) ) {
		include_once( $filepath );
	} else {
		wp_die(
			esc_html( "The file attempting to be loaded at $filepath does not exist." )
		);
	}
}