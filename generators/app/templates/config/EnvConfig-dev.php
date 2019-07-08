<?PHP
namespace Freestone;

VEnv::addEnv('dev', ['.local'], [
	'dbUser' => 'remote',
	'dbPass' => 'remote',
	'dbServer' => '192.168.1.199',
	'dbName' => 'example',
	'cacheConfig' => [
		'life' => 0,
		'noCacheVars' => false,
	],
	'isDev' => true,
]);

