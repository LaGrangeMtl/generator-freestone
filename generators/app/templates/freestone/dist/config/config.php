<?php

namespace Freestone;

use Freestone\Config\AbstractClientSettings;

require_once(__DIR__.'/../Hooks.php');

// Values in this file may be override in EnvConfig-<branch>-<env>.php


// ID of that client
VEnv::$client = '<%= props.projectNamespace %>';
VEnv::$siteName = '<%= props.projectName %>';

// Assets version to prevent cache.
require_once(__DIR__.'/../assets-version.php');
VEnv::$assetsVersion = ASSETS_VERSION;

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

VEnv::$ssoAdminURL = 'https://sso.enclos.ca/admin';
VEnv::$ssoApiURL = 'https://sso.enclos.ca/fsapi/authentication/validate-ticket';

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
