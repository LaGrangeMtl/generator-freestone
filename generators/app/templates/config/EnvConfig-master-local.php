<?PHP
namespace Freestone;

VEnv::addEnv('local', ['.local', '.lol', '.com', '.ca'], [
	'dbServer' => '192.168.1.199',
	'dbName' => 'client_master_local',
	'dbUser' => 'remote',
	'dbPass' => 'remote',
	'cacheConfig' => [
		'life' => 3600,
		'noCacheVars' => false,
	],

	'isDev' => true,
	'forceWww' => false,
	'api'=> [

	],
]);

ClientSettings::$settings['gtm_ca'] = '';
ClientSettings::$settings['gtm_us'] = '';
ClientSettings::$settings['site_name'] = '<%= props.projectName %>.master.local.enclos';
ClientSettings::$settings['regions']['ca']['tld'] = 'ca';
ClientSettings::$settings['regions']['ca']['use_region_as_prefix'] = true;
ClientSettings::$settings['regions']['us']['tld'] = 'ca';
ClientSettings::$settings['regions']['us']['use_region_as_prefix'] = true;

