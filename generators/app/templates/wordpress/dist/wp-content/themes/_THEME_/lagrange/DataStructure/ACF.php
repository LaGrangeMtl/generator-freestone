<?php

namespace LaGrange\DataStructure;

use Website\Env;

class ACF {
	static $path = '';

	static function init() {
		self::$path = get_stylesheet_directory() . '/website/acf-json';

		add_filter('acf/settings/save_json', [ get_called_class(), 'acf_json_save_point']);
		add_filter('acf/settings/load_json', [ get_called_class(), 'acf_json_load_point']);
		add_filter('acf/fields/google_map/api', [get_called_class(), 'acf_google_map_api']);
	}

	static function acf_json_save_point( $path ) {
		return self::$path;
	}

	static function acf_json_load_point($paths) {
		unset($paths[0]);
		$paths[] = self::$path;
		return $paths;
	}

	static function acf_google_map_api($api) {
		if (Env::$maps_api_key) {
			$api['key'] = Env::$maps_api_key;
		}
		return $api;
	}
}