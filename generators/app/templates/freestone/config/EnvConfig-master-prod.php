<?PHP
namespace Freestone;

VEnv::addEnv('prod', ['.com', '.ca'], [
	'dbServer' => 'localhost',
	'dbName' => '<%= props.projectName %>_master_prod',
	'dbUser' => '',
	'dbPass' => '',
	'cacheConfig' => [
		'life' => 3600,
		'noCacheVars' => false,
	],

	'isDev' => false,
	'forceWww' => false,
	'api'=> [

	]
]);

ClientSettings::$settings['gtm_ca'] = '';
ClientSettings::$settings['gtm_us'] = '';
ClientSettings::$settings['site_name'] = '<%= props.projectName %>';
ClientSettings::$settings['regions']['ca']['tld'] = 'ca';
ClientSettings::$settings['regions']['ca']['use_region_as_prefix'] = false;
ClientSettings::$settings['regions']['us']['tld'] = 'com';
ClientSettings::$settings['regions']['us']['use_region_as_prefix'] = false;
