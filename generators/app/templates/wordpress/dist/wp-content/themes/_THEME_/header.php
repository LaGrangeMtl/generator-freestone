
<!DOCTYPE html>
<html <? language_attributes(); ?> class="no-js">
	<? $version = '?v=2020'; ?>
	<head>
		<meta charset="<? bloginfo( 'charset' ); ?>">
		<title><? wp_title(''); ?><? if ( wp_title( '', false ) ) { echo ' : '; } ?><? bloginfo('name'); ?></title>

		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">

		<? wp_head(); ?>

		<link rel="stylesheet" href="<? echo esc_url(get_template_directory_uri()); ?>/assets/css/index.css<? echo $version ?>">
	</head>

	<body <? body_class(); ?>>