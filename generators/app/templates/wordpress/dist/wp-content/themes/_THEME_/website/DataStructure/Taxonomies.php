<?php

namespace Website\DataStructure;

class Taxonomies {
	const SITE_CATEGORY = 'site_category';
	const ISSUE = 'issue';
	const STATUS = 'status';
	const THREAT = 'threat';
	const SITE_TYPE = 'site_type';
	
	static public function init() {
		add_action( 'init', [get_called_class(), 'register_taxonomies'], 0 );
	}

	static function register_taxonomies() {
		// Example
		// register_taxonomy( self::SITE_CATEGORY, array(), [
		// 	'labels' => [
		// 		'name'              => _x( 'TAXNAME_PLURAL', 'taxonomy general name', 'theme-admin' ),
		// 		'singular_name'     => _x( 'TAXNAME_SINGULAR', 'taxonomy singular name', 'theme-admin' ),
		// 		'search_items'      => __( 'Rechercher TAXNAME_PLURAL', 'theme-admin' ),
		// 		'all_items'         => __( 'Tous les TAXNAME_PLURAL', 'theme-admin' ),
		// 		'parent_item'       => __( 'TAXNAME_SINGULAR parente', 'theme-admin' ),
		// 		'parent_item_colon' => __( 'TAXNAME_SINGULAR parente:', 'theme-admin' ),
		// 		'edit_item'         => __( 'Modifier TAXNAME_SINGULAR', 'theme-admin' ),
		// 		'update_item'       => __( 'Mettre à jour TAXNAME_SINGULAR', 'theme-admin' ),
		// 		'add_new_item'      => __( 'Ajouter nouvel TAXNAME_SINGULAR', 'theme-admin' ),
		// 		'new_item_name'     => __( 'Nouveau nom TAXNAME_SINGULAR', 'theme-admin' ),
		// 		'menu_name'         => __( 'TAXNAME_SINGULAR', 'theme-admin' ),
		// 	],
		// 	'description' => __( '', 'theme-admin' ),
		// 	'hierarchical' => true,
		// 	'public' => true,
		// 	'publicly_queryable' => true,
		// 	'show_ui' => true,
		// 	'show_in_menu' => true,
		// 	'show_in_nav_menus' => true,
		// 	'show_tagcloud' => true,
		// 	'show_in_quick_edit' => true,
		// 	'show_admin_column' => true,
		// 	'show_in_rest' => true,
		// 	'rest_base' => 'tax_' . self::SITE_CATEGORY,
		// ]);
	}
}