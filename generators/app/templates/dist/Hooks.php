<?php

namespace Freestone;
use Freestone\VEnv;
use Freestone\VQuery;
use Freestone\Frontendv2\Website;

class Hooks {

	public static function parseModelConfig($table, $config) {
		return $config;
	}

	/**
	 * S3 fix for CORS images
	 */
	public static function modifyImageBankItemAttrs($attrs, $infos) {
		if ($infos["external_url"]) return array_merge($attrs, ['crossorigin="anonymous"']);
		return $attrs;
	}
}