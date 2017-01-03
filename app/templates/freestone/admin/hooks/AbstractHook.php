<?php

namespace Clients\<%= props.projectPhpNamespace %>\Admin\Hooks;

use Freestone\Utils;
use Freestone\VQuery;
use Freestone\VEnv;


class AbstractHook {

	public static function onUpdate($recId) {
		return static::performUpdate($recId);
	}

}