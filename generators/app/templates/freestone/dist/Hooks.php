<?php

namespace Freestone;

class Hooks {

	public static function parseModelConfig($table, $config) {
		return $config;
	}

	/**
	 * Adds loading attribute to images to enable lazy loading.
	 * @param $attrs
	 * @param $infos
	 *
	 * @return array
	 */
	public static function modifyImageBankItemAttrs($attrs, $infos) {
		// Shenanigans to check if we're not in the admin
		if (Website::$id) {
			if ($infos['_type'] !== 'svg' && strpos($infos['file'], 'svg') === FALSE) {
				$attrs[] = 'loading="lazy"';
			}
			if ($infos['_width']) {
				$attrs[] = 'width="'. $infos['_width'] .'"';
			}
			if ($infos['_height']) {
				$attrs[] = 'height="'. $infos['_height'] .'"';
			}
		}
		return $attrs;
	}
}
