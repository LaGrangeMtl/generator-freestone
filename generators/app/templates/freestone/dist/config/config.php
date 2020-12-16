<?php

namespace Freestone;

use Freestone\Config\AbstractClientSettings;

require_once(__DIR__.'/../Hooks.php');

// Values in this file may be override in EnvConfig-<branch>-<env>.php


// ID of that client
VEnv::$client = '<%= props.projectNamespace %>';
VEnv::$siteName = '<%= props.projectName %>';

// Assets version to prevent cache.
VEnv::$assetsVersion = '0';

VEnv::$defaultID = 1;
VEnv::$defaultLang = 'fr';
VEnv::$defaultTable = 'page';

VEnv::$fieldBasedTplNames = ['zva_admin_page'=>'template', 'page'=>'template'];

VEnv::$salt = '<%= props.salt %>';
VEnv::$secret = '<%= props.secret %>';

VEnv::$api['google']['clientId'] = 'key.apps.googleusercontent.com';

VEnv::$cacheConfig = [
	'life' => 3600,
	'noCacheVars' => false,
];

VEnv::$forceWww = false;
VEnv::$isDev = true;

class ClientSettings extends AbstractClientSettings {

	public static $settings = [
		'site_name' => 'example',
		'fb_appid' => 'xxx',
		'urchin' => 'UA-xxx',
		'contentblocksLocation' => 'content-blocks/types',
		'reCAPTCHA_siteKey' => '',
		'reCAPTCHA_secretKey' => '',
	];
	
	protected static function initValues(){

	}

}
