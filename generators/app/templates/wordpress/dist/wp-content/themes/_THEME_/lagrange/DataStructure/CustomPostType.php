<?php

namespace LaGrange\DataStructure;

/**
 * CustomPostType
 */
class CustomPostType {
	/**
	 * args
	 *
	 * @param  string $singular
	 * @param  string $plural
	 * @param  array $overrides
	 * @return array
	 */
	public static function args($singular, $plural, $overrides = []) {
		$labels = array(
			'name' => sprintf(_x( '%s', 'Post Type General Name', 'theme-admin'), $singular),
			'singular_name' => sprintf(_x( '%s', 'Post Type Singular Name', 'theme-admin'), $singular),
			'menu_name' => sprintf(_x( '%s', 'Admin Menu text', 'theme-admin'), $plural),
			'name_admin_bar' => sprintf(_x( '%s', 'Add New on Toolbar', 'theme-admin'), $singular),
			'archives' => sprintf(__('%s Archives', 'theme-admin'), $singular),
			'attributes' => sprintf(__('%s Attributes', 'theme-admin'), $singular),
			'parent_item_colon' => sprintf(__('Parent %s:', 'theme-admin'), $singular),
			'all_items' => sprintf(__('All %s', 'theme-admin'), $plural),
			'add_new_item' => sprintf(__('Add New %s', 'theme-admin'), $singular),
			'new_item' => sprintf(__('New %s', 'theme-admin'), $singular),
			'edit_item' => sprintf(__('Edit %s', 'theme-admin'), $singular),
			'update_item' => sprintf(__('Update %s', 'theme-admin'), $singular),
			'view_item' => sprintf(_x('View %s', 'singular', 'theme-admin'), $singular),
			'view_items' => sprintf(_x('View %s', 'plural', 'theme-admin'), $plural),
			'search_items' => sprintf(__('Search %s', 'theme-admin'), $singular),
			'insert_into_item' => sprintf(__('Insert into %s', 'theme-admin'), $singular),
			'uploaded_to_this_item' => sprintf(__('Uploaded to this %s', 'theme-admin'), $singular),
			'items_list' => sprintf(__('%s list', 'theme-admin'), $plural),
			'items_list_navigation' => sprintf(__('%s list navigation', 'theme-admin'), $plural),
			'filter_items_list' => sprintf(__('Filter %s list', 'theme-admin'), $plural),
		);

		$args = array_merge(array(
			'label' => __($singular, 'theme-admin'),
			'description' => __('', 'theme-admin'),
			'labels' => $labels,
			'menu_icon' => '',
			'supports' => ['title', 'editor', 'thumbnail'],
			'taxonomies' => [],
			'public' => true,
			'show_ui' => true,
			'show_in_menu' => true,
			'menu_position' => 5,
			'show_in_admin_bar' => true,
			'show_in_nav_menus' => true,
			'can_export' => true,
			'has_archive' => true,
			'hierarchical' => false,
			'exclude_from_search' => false,
			'show_in_rest' => false,
			'publicly_queryable' => true,
			'capability_type' => 'post',
		), $overrides);

		return $args;
	}
	
	/**
	 * register
	 *
	 * @param  string $singular
	 * @param  string $plural
	 * @param  string 'theme-admin'
	 * @param  array $overrides
	 * @return void
	 */
	public static function register($slug, $singular, $plural, $overrides = []) {
		register_post_type( $slug, CustomPostType::args($singular, $plural, $overrides) );
	}
}

?>