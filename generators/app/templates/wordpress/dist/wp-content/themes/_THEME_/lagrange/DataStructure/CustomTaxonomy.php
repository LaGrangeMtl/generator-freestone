<?php

namespace LaGrange\DataStructure;

use LaGrange\DataStructure\ContentBlocks;

/**
 * CustomPostType
 */
class CustomTaxonomy {
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
			'name'              => sprintf(_x( '%s', 'taxonomy general name', 'theme-admin'), $singular),
			'singular_name'     => sprintf(_x( '%s', 'taxonomy singular name', 'theme-admin'), $singular),
			'search_items'      => sprintf(_x( 'Search %s', 'theme-admin'), $singular),
			'all_items'         => sprintf(_x( 'All %s', 'theme-admin'), $plural),
			'parent_item'       => sprintf(_x( 'Parent %s', 'theme-admin'), $singular),
			'parent_item_colon' => sprintf(_x( 'Parent %s:', 'theme-admin'), $singular),
			'edit_item'         => sprintf(_x( 'Edit %s', 'theme-admin'), $singular),
			'update_item'       => sprintf(_x( 'Update %s', 'theme-admin'), $singular),
			'add_new_item'      => sprintf(_x( 'Add new %s', 'theme-admin'), $singular),
			'new_item_name'     => sprintf(_x( 'New %s name', 'theme-admin'), $singular),
			'menu_name'         => sprintf(_x( '%s', 'theme-admin'), $singular),
		);

		$args = array_merge(array(
			'labels' => $labels,
			'description' => __( '', 'theme-admin' ),
			'hierarchical' => true,
			'public' => true,
			'publicly_queryable' => true,
			'show_ui' => true,
			'show_in_menu' => true,
			'show_in_nav_menus' => true,
			'show_tagcloud' => true,
			'show_in_quick_edit' => true,
			'show_admin_column' => true,
			'show_in_rest' => true
		), $overrides);

		return $args;
	}
	
	/**
	 * register
	 *
	 * @param  string $slug
	 * @param  string $postType
	 * @param  string $singular
	 * @param  string $plural
	 * @param  array $overrides
	 * @return void
	 */
	public static function register($slug, $postType, $singular, $plural, $overrides = []) {
		register_taxonomy($slug, array($postType), self::args($singular, $plural, $overrides));
	}

	/**
	 * @param string[] $taxonomies
	 */
	public static function registerFlexibleContent($taxonomies) {
		$layouts = [];

		$blocksClasses = ContentBlocks::getBlocksClasses();
		foreach ($blocksClasses as $blockClass) {
			$block = $blockClass->newInstanceArgs();

			$slug = $blockClass->getConstant('slug');
			$title = $blockClass->getConstant('title');

			$layouts['layout_' . $slug] = [
				'key' => 'layout_' . $slug . '_field',
				'name' => $slug,
				'label' => $title,
				'display' => 'block',
				'sub_fields' => $block::getFields(),
				'min' => '',
				'max' => '',
			];
		}
		
		$fields = [
			[
				'key' => 'taxo_category_flexible',
				'label' => 'Content',
				'name' => 'content',
				'type' => 'flexible_content',
				'instructions' => '',
				'required' => 0,
				'conditional_logic' => 0,
				'wrapper' => array(
					'width' => '',
					'class' => '',
					'id' => '',
				),
				'wpml_cf_preferences' => WPML_TRANSLATE_CUSTOM_FIELD,
				'layouts' => $layouts
			]
		];

		acf_add_local_field_group(array(
			'key' => 'taxo_category',
			'title' => 'Content',
			'fields' => $fields,
			'location' => array_map(function($taxonomy) {
				// First array is a rule group (OR), each sub array is a rule (AND)
				return [
					[
						'param' => 'taxonomy',
						'operator' => '==',
						'value' => $taxonomy,
					]
				];
			}, $taxonomies)
		));
	}
}

?>