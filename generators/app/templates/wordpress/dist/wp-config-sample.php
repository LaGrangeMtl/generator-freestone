<?php

require "config.php";

define( 'DB_CHARSET', 'utf8' );
define( 'DB_COLLATE', '' );

define( 'AUTH_KEY',         '<%= props.wpAuthKey %>' );
define( 'SECURE_AUTH_KEY',  '<%= props.wpSecureAuthKey %>' );
define( 'LOGGED_IN_KEY',    '<%= props.wpLoggedInKey %>' );
define( 'NONCE_KEY',        '<%= props.wpNonceKey %>' );
define( 'AUTH_SALT',        '<%= props.wpAuthSalt %>' );
define( 'SECURE_AUTH_SALT', '<%= props.wpSecureAuthSalt %>' );
define( 'LOGGED_IN_SALT',   '<%= props.wpLoggedInSalt %>' );
define( 'NONCE_SALT',       '<%= props.wpNonceSalt %>' );

$table_prefix = '<%= props.wpTablePrefix %>_';

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
