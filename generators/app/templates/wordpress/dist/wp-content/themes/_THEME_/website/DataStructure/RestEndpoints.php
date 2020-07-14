<?php

namespace Website\DataStructure;

use WP_Query;
use WP_REST_Request;
use Website\DataStructure\Endpoints\Dummy;

class RestEndpoints {
	static function init() {
		add_action('rest_api_init', function () {
			Dummy::register();
		});
	}
}
