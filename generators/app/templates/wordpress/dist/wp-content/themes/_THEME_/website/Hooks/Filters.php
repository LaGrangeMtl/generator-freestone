<?php

namespace Website\Hooks;

/**
 * This is where you add filters to WordPress, be sure to keep it simple.
 * If the filter is more complex, consider using a Module instead and group
 * your code in it.
 */
class Filters {
	static function addAll() {
		add_filter('body_class', [get_called_class(), 'add_slug_body_class']);
	}

	static function add_slug_body_class($class) {
		global $post;

		if (isset($post)) {
			$classes[] = $post->post_type . '-' . $post->post_name;
		}
		
		return $class;
	}
}