<?PHP
namespace Freestone;

VEnv::addEnv('enclos', ['.enclos'], [
	'dbUser' => 'remote',
	'dbPass' => 'remote',
	'dbServer' => 'localhost',
	'dbName' => '',
	'cacheConfig' => [
		'life' => 0,
		'noCacheVars' => false,
	],
	'isDev' => true,
]);
