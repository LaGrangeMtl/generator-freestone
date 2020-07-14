<?php

// autoload_real.php @generated by Composer
class ComposerAutoloaderInitd33af858c50447a3cd221acc366dd04f
{
    private static $loader;
    public static function loadClassLoader($class)
    {
        if ('DeliciousBrains\\WP_Offload_Media\\Gcp\\Composer\\Autoload\\ClassLoader' === $class) {
            require __DIR__ . '/ClassLoader.php';
        }
    }
    public static function getLoader()
    {
        if (\null !== self::$loader) {
            return self::$loader;
        }
        \spl_autoload_register(array('ComposerAutoloaderInitd33af858c50447a3cd221acc366dd04f', 'loadClassLoader'), \true, \true);
        self::$loader = $loader = new \DeliciousBrains\WP_Offload_Media\Gcp\Composer\Autoload\ClassLoader();
        \spl_autoload_unregister(array('ComposerAutoloaderInitd33af858c50447a3cd221acc366dd04f', 'loadClassLoader'));
        $useStaticLoader = \PHP_VERSION_ID >= 50600 && !\defined('HHVM_VERSION') && (!\function_exists('zend_loader_file_encoded') || !\zend_loader_file_encoded());
        if ($useStaticLoader) {
            require_once __DIR__ . '/autoload_static.php';
            \call_user_func(\DeliciousBrains\WP_Offload_Media\Gcp\Composer\Autoload\ComposerStaticInitd33af858c50447a3cd221acc366dd04f::getInitializer($loader));
        } else {
            $classMap = (require __DIR__ . '/autoload_classmap.php');
            if ($classMap) {
                $loader->addClassMap($classMap);
            }
        }
        $loader->setClassMapAuthoritative(\true);
        $loader->register(\true);
        if ($useStaticLoader) {
            $includeFiles =DeliciousBrains\WP_Offload_Media\Gcp\Composer\Autoload\ComposerStaticInitd33af858c50447a3cd221acc366dd04f::$files;
        } else {
            $includeFiles = (require __DIR__ . '/autoload_files.php');
        }
        foreach ($includeFiles as $fileIdentifier => $file) {
            \composerRequired33af858c50447a3cd221acc366dd04f($fileIdentifier, $file);
        }
        return $loader;
    }
}
function composerRequired33af858c50447a3cd221acc366dd04f($fileIdentifier, $file)
{
    if (empty($GLOBALS['__composer_autoload_files'][$fileIdentifier])) {
        require $file;
        $GLOBALS['__composer_autoload_files'][$fileIdentifier] = \true;
    }
}
