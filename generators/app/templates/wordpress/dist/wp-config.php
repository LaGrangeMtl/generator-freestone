<?php

require "config.php";

define( 'DB_CHARSET', 'utf8' );
define( 'DB_COLLATE', '' );

define( 'AUTH_KEY',         '<%= props.authKey %>' );
define( 'SECURE_AUTH_KEY',  '<%= props.secureAuthKey %>' );
define( 'LOGGED_IN_KEY',    '<%= props.loggedInKey %>' );
define( 'NONCE_KEY',        '<%= props.nonceKey %>' );
define( 'AUTH_SALT',        '<%= props.authSalt %>' );
define( 'SECURE_AUTH_SALT', '<%= props.secureAuthSalt %>' );
define( 'LOGGED_IN_SALT',   '<%= props.loggedInSalt %>' );
define( 'NONCE_SALT',       '<%= props.nonceSalt %>' );

$table_prefix = '<%= props.tablePrefix %>_';

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
