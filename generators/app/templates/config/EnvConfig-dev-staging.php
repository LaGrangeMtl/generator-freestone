<?PHP
namespace Freestone;

VEnv::addEnv('enclos', ['.enclos.ca'], [
	'dbServer' => 'localhost',
	'dbName' => '<%= props.projectName %>_dev_staging',
	'dbUser' => '',
	'dbPass' => '',
	'cacheConfig' => [
		'life' => 3600,
		'noCacheVars' => false,
	],

	'isDev' => true,
	'forceWww' => false,
	'api'=> [

	]
]);

ClientSettings::$settings['gtm_ca'] = '';
ClientSettings::$settings['gtm_us'] = '';
ClientSettings::$settings['site_name'] = '<%= props.projectName %>.dev.staging.enclos';
ClientSettings::$settings['regions']['ca']['tld'] = 'ca';
ClientSettings::$settings['regions']['ca']['use_region_as_prefix'] = true;
ClientSettings::$settings['regions']['us']['tld'] = 'ca';
ClientSettings::$settings['regions']['us']['use_region_as_prefix'] = true;
