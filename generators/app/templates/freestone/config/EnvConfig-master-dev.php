<?PHP
namespace Freestone;

VEnv::addEnv('dev', ['.enclos.ca'], [
	'dbServer' => 'localhost',
	'dbName' => '<%= props.projectName %>_master_dev',
	'dbUser' => '<%= props.projectName %>_master_dev',
	'dbPass' => '<%= props.dbPassDev %>',
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
ClientSettings::$settings['site_name'] = '<%= props.projectName %>.master.dev.enclos';
ClientSettings::$settings['regions']['ca']['tld'] = 'ca';
ClientSettings::$settings['regions']['ca']['use_region_as_prefix'] = true;
ClientSettings::$settings['regions']['us']['tld'] = 'ca';
ClientSettings::$settings['regions']['us']['use_region_as_prefix'] = true;
