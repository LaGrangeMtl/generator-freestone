<?PHP

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

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
VEnv::$isDev = true;
VEnv::connectDb();

# Admin
use Freestone\Admin;
Admin::init();
