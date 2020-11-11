<?PHP
namespace Freestone;
use Freestone\Config\AbstractClientSettings;

//ID of that client
VEnv::$client = '<%= props.projectNamespace %>';
VEnv::$siteName = '<%= props.projectName %>';

// assets version to prevent cache
VEnv::$assetsVersion = '0';

//array of css to display in html fields of the admin
VEnv::$pathCss = ['css/index.css'];

VEnv::$defaultID = 1;
VEnv::$defaultLang = 'fr';
VEnv::$defaultTable = 'page';

VEnv::$fieldBasedTplNames = ['zva_admin_page'=>'template', 'page'=>'template'];

VEnv::$salt = '<%= props.salt %>';
VEnv::$secret = '<%= props.secret %>';

VEnv::$api['google']['clientId'] = 'key.apps.googleusercontent.com';

VEnv::$cacheConfig = [
	'life' => 86000,
	'noCacheVars' => false,
];

class ClientSettings extends AbstractClientSettings {

	public static $settings = array(
		'site_name' => 'example',
		'fb_appid' => 'xxx',
		'urchin' => 'UA-xxx',
		'contentblocksLocation' => 'content-blocks/types',
		'reCAPTCHA_siteKey' => '',
		'reCAPTCHA_secretKey' => '',
	);
	
	protected static function initValues(){
		// Utils::debug(self::$settings);
	}

}
