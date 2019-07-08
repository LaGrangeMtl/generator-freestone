<?PHP
namespace Freestone;

VEnv::addEnv('dev', ['.com'], [
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

