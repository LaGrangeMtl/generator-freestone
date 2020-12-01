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
		return array_merge($attrs, ['loading="lazy"']);
	}
}
