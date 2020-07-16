<?php

namespace Website\DataStructure;

use LaGrange\DataStructure\CustomPostType;
use Website\DataStructure\Taxonomies;

class PostTypes {
	const SITE = 'site';

	static public function init() {
		add_action( 'init', [get_called_class(), 'register_post_types'], 0 );
	}

	static function register_post_types() {
		// Example: CustomPostType::register('test', 'Test', 'Tests');
	}
}