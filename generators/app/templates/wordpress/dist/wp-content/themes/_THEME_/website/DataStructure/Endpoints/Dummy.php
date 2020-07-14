<?php

namespace Website\DataStructure\Endpoints;

use Website\DataStructure\PostTypes;
use Website\DataStructure\Taxonomies;
use WP_Query;
use WP_REST_Request;

class Dummy {
	public static function register() {
		// register_rest_route('hmtl_api/v1', '/dummy', array(
		// 	'methods' => 'GET',
		// 	'callback' => [get_called_class(), 'getDummies'],
		// ));
	}

	/**
	 * @param WP_REST_Request $request Options for the function.
	 * @return string|null|WP_Error Post title for the latest, * or null if none.
	 */
	static function getDummies(WP_REST_Request $request) {
		$query = [
			'post_type' => PostTypes::SITE,
			'posts_per_page' => 999,
		];

		$query = new WP_Query($query);

		$posts = $query->get_posts();

		if (empty($posts)) {
			return [];
		}

		return [
			"list" => $posts,
		];
	}
}