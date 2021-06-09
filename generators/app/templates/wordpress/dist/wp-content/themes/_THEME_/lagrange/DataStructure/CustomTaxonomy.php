<?php

namespace LaGrange\DataStructure;

use LaGrange\DataStructure\ContentBlocks;

/**
 * CustomPostType
 */
class CustomTaxonomy {
	const CLASS_NAME_FIELD = '__meta_class_name__';

	public static function hide_class_name_field($field) {
		return false;
	}

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

			$className = $blockClass->getShortName();
			$slug = $blockClass->getConstant('slug');
			$title = $blockClass->getConstant('title');

			$fields =  array_merge(
				$block::getFields(), 
				[
					[
						'key' => 'field_' . $slug . '_class_name',
						'label' => self::CLASS_NAME_FIELD,
						'name' => self::CLASS_NAME_FIELD,
						'type' => 'text',
						'default_value' => $className,
						'instruction_placement' => 'DO NOT CHANGE',
						'disabled' => 1,
						'hide_on_screen' => 1
					]
				]
			);

			$layouts['layout_' . $className] = [
				'key' => 'layout_' . $slug . '_field',
				'name' => $slug,
				'label' => $title,
				'display' => 'block',
				'sub_fields' => $fields,
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

		add_filter( 'acf/prepare_field/name=' . self::CLASS_NAME_FIELD, [get_called_class(), 'hide_class_name_field']);
	}

	/**
	 * Prints the blocks set in the $contentField of the taxonomy.
	 * 
	 * @param WPQuery $wp_query The current WPQuery.
	 * @param string $contentField The flexible content field on the current taxonomy. Defaults to `'content'`.
	 */
	public static function getBlocksFromFlexibleContent($wp_query, $contentField = 'content') {
		$taxonomy = $wp_query->get_queried_object();
		$content = get_field($contentField, $taxonomy);

		if ($content) {
			$index = 0;

			while(have_rows('content', $taxonomy)) {
				the_row();
				$fields = $content[$index];
				$className = get($fields, CustomTaxonomy::CLASS_NAME_FIELD);
			
				$resolvedBlock = str_replace(".php", "", "\Website\Blocks\\$className");
				$method = new \ReflectionMethod($resolvedBlock, 'template');
						
				$method->invoke(null, $fields, $index === 0 ? 1 : 2);
				$index++;
			}
		}
	}
}

?>