<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

# Composer
if (!is_dir(__DIR__ . '/vendor')) {
	echo "Missing vendor directory. Did you forget to run composer install?";
	exit;
}

# Autoload
$root = __DIR__ . '/vendor/la-grange/freestone-backend';
require_once($root . '/freestone/autoload.php');
require_once(__DIR__ . '/vendor/autoload.php');

# Config
require_once(__DIR__.'/config/config.php');

# EnvConfig
$envConfig = __DIR__.'/config/EnvConfig.php';
if (file_exists($envConfig)) {
	/** @noinspection PhpIncludeInspection */
	require_once($envConfig);
} else {
	$envConfig = __DIR__.'/../config/EnvConfig.php';
	/** @noinspection PhpIncludeInspection */
	require_once($envConfig);
}

# VEnv
use Freestone\VEnv;
VEnv::$clientDir = '';
VEnv::init(__DIR__.'/');
VEnv::connectDb();

# Fix for production servers that are often strict by default.
use Freestone\VQuery;
new VQuery("SET sql_mode='';");
