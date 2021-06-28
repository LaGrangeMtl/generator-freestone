<?php

namespace Freestone;

VEnv::$name = 'prod';
VEnv::$dbServer = 'localhost';
VEnv::$dbName = '<%= props.projectName %>_master_prod';
VEnv::$dbUser = '';
VEnv::$dbPass = '';

VEnv::$isDev = false;
VEnv::$forceWww = true;

VEnv::$cacheConfig = [
	'life' => 86000,
	'noCacheVars' => false,
];
