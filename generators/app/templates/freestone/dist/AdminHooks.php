<?php

namespace Freestone;
use Freestone\VEnv;


class AdminHooks {

	/**
	 * Returns an object that will be merged with tinyMce's config for wysiwyg fields
	 */
	public static function getHtmlEditorConfig() {
		return [
			'content_css' => VEnv::$absoluteClientDir . 'assets/css/index-wysiwyg.css',
			'style_formats' => [
				// see : https://www.tiny.cloud/docs/configure/content-formatting/#formats
				// [
				// 	'title' => 'Custom Element',
				// 	'block' => 'div',
				// 	'classes' => 'custom-element',
				// ]
			]
		];
	}

}
