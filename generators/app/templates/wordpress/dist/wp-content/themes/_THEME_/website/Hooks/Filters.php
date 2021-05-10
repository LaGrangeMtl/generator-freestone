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
		add_filter('the_content',[get_called_class(), 'add_lazy_load_attributes']);
		add_filter('upload_mimes', [get_called_class(), 'cc_mime_types']);
	}

	static function add_slug_body_class($class) {
		global $post;

		if (isset($post)) {
			$classes[] = $post->post_type . '-' . $post->post_name;
		}
		
		return $class;
	}

	static function add_lazy_load_attributes($content) {
		/* Add loading="lazy" to all images filtered by the_content */
		$content = str_replace('<img','<img loading="lazy"', $content);
		/* Add loading="lazy" to all iframes filtered by the_content */
		$content = str_replace('<iframe','<iframe loading="lazy"', $content);
		return $content;
	}
	
	static function cc_mime_types($mimes) {
		$mimes['svg'] = 'image/svg+xml';
		return $mimes;
	}
}	