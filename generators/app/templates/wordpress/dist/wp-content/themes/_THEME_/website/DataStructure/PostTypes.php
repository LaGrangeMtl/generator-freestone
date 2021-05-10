<?php

namespace Website\DataStructure;

use LaGrange\DataStructure\CustomPostType;
use Website\DataStructure\Taxonomies;

class PostTypes {
	const EXAMPLE_POST_TYPE = 'example_post_type';

	static public function init() {
		add_action( 'init', [get_called_class(), 'register_post_types'], 0 );
	}

	static function register_post_types() {
		// CustomPostType::register(self::EXAMPLE_POST_TYPE, 'Example Post Type', 'Example Post Types', [
		// 	'menu_icon' => 'dashicons-products',
		// 	'taxonomies' => [Taxonomies::EXAMPLE_TAXONOMY],
		// 	'show_in_rest' => true,
		// ]);
	}
}