<?php

namespace Freestone;

VEnv::$dbServer = 'localhost';
VEnv::$dbName = '<%= props.projectName %>_master_prod';
VEnv::$dbUser = '';
VEnv::$dbPass = '';

VEnv::$isDev = false;
VEnv::$forceWww = true;

ClientSettings::$settings['site_name'] = '<%= props.projectName %>';
ClientSettings::$settings['regions']['ca']['tld'] = 'ca';
ClientSettings::$settings['regions']['ca']['use_region_as_prefix'] = false;
ClientSettings::$settings['regions']['us']['tld'] = 'com';
ClientSettings::$settings['regions']['us']['use_region_as_prefix'] = false;
