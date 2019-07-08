<?PHP
namespace Freestone;

VEnv::addEnv('prod', ['.com'], [
	'dbUser' => '',
	'dbPass' => '',
	'dbServer' => 'localhost',
	'dbName' => '',
	'cacheConfig' => [
		'life' => 0,
		'noCacheVars' => false,
	],
	'isDev' => true,
]);

