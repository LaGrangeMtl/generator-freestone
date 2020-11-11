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
	 * Adds lazy loading and fixes CORS issues with external images.
	 * @param $attrs
	 * @param $infos
	 *
	 * @return array
	 */
	public static function modifyImageBankItemAttrs($attrs, $infos) {
		$attrs = array_merge($attrs, ['loading="lazy"']);
		if ($infos["external_url"]) {
			$attrs = array_merge($attrs, ['crossorigin="anonymous"']);
		}
		return $attrs;
	}
}
