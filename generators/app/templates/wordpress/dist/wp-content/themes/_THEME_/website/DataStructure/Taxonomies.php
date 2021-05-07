<?php

namespace Website\DataStructure;

use LaGrange\DataStructure\CustomTaxonomy;

class Taxonomies {
	const EXAMPLE_TAXONOMY = 'example_taxonomy';
	
	static public function init() {
		add_action( 'init', [get_called_class(), 'register_taxonomies'], 0 );
	}

	static function register_taxonomies() {
		// Example
		// CustomTaxonomy::register(
		// 	self::EXAMPLE_TAXONOMY, 
		// 	PostTypes::EXAMPLE_POST_TYPE, 
		// 	'Example taxonomy', 
		// 	'Example taxonomies', 
		// 	['publicly_queryable' => true]
		// );

		// Do this after registering all taxonomies
		CustomTaxonomy::registerFlexibleContent([]);
	}
}