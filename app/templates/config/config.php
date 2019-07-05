<?PHP
namespace Freestone;
use Freestone\VEnv;
use Freestone\VQuery;
use Freestone\Config\AbstractClientSettings;
use Freestone\Frontendv2\Website;

//ID of that client
VEnv::$client = '<%= props.projectNamespace %>';
VEnv::$siteName = '<%= props.projectName %>';

VEnv::addEnv('bobette', ['.local'], [
    'dbUser' => 'remote',
    'dbPass' => 'remote',
    'dbServer' => '192.168.1.199',
    'dbName' => '<%= props.dbName %>',
    'cacheConfig' => [
        'life' => 0,
        'noCacheVars' => false,
    ],
    'isDev' => true,
]);

VEnv::addEnv('enclos', ['.enclos'], [
    'dbUser' => '',
    'dbPass' => '',
    'dbServer' => 'localhost',
    'dbName' => '<%= props.dbName %>',
    'cacheConfig' => [
        'life' => 0,
        'noCacheVars' => false,
    ],
    'isDev' => true,
]);

VEnv::addEnv('prod', ['.com'], [
    'dbUser' => 'remote',
    'dbPass' => 'remote',
    'dbServer' => '192.168.1.199',
    'dbName' => '<%= props.dbName %>',
    'cacheConfig' => [
        'life' => 0,
        'noCacheVars' => false,
    ],
    'isDev' => false,
    'forceWww' => true,
]);

// assets version to prevent cache
VEnv::$assetsVersion = '0';

//array of css to display in html fields of the admin
VEnv::$pathCss = ['css/master.css'];

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

    protected static $settings = array(
        'site_name' => '<%= props.projectName %>',
        'fb_appid' => 'xxx',
        'urchin' => 'UA-xxx',
        'contentblocksLocation' => 'content-blocks/types',
    );
    
    protected static function initValues(){
        // Utils::debug(self::$settings);
    }

}