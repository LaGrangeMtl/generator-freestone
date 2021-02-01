<?php

require_once(dirname( __FILE__ ) . '/lagrange/autoload.php');
require_once(dirname( __FILE__ ) . '/lagrange/Utils.php');
require_once(dirname( __FILE__ ) . '/lagrange/IncludeWith.php');
require_once(dirname( __FILE__ ) . '/lagrange/FormatDate.php');
require_once(dirname( __FILE__ ) . '/lagrange/Slugify.php');

use LaGrange\DataStructure\ContentBlocks;
use LaGrange\DataStructure\ACF;
use Website\DataStructure\PostTypes;

use Website\Hooks\Filters;
use Website\Hooks\Actions;
use Website\DataStructure\RestEndpoints;
use Website\DataStructure\Taxonomies;

class Website {
	function __construct() {
		ACF::init();
		Taxonomies::init();
		PostTypes::init();
		ContentBlocks::registerAll();
		ContentBlocks::filterWPBlocks([
			'post' => [
				'core/code',
				'core/shortcode',
				'core/embed',
				'core/freeform',
				'core/block',
				'core/template',
				'core/image'
			],
			'page' => [
				'core/code',
				'core/shortcode',
				'core/embed',
				'core/block',
				'core/template'
			],
		]);
		RestEndpoints::init();

		Filters::addAll();
		Actions::addAll();
	}
}

new Website();

