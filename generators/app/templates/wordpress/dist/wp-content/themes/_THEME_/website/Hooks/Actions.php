<?php

namespace Website\Hooks;

/**
 * This is where you add actions to WordPress, be sure to keep it simple.
 * If the action is more complex, consider using a Module instead and group
 * your code in it.
 */
class Actions {
	static function addAll() {
		add_action( 'init', [get_called_class(), 'register_menus'] );
		add_action('admin_enqueue_scripts', [get_called_class(), 'adminThemeStyles']);
	}

	static function register_menus() {
	}

	static function adminThemeStyles() {
		wp_enqueue_style('my-admin-theme', get_template_directory_uri() . '/assets/css/index-admin.css');
	}
}