<?php

namespace Freestone;

VEnv::$dbServer = 'localhost';
VEnv::$dbName = '<%= props.projectName %>_master_dev';
VEnv::$dbUser = '<%= props.projectName %>_master_dev';
VEnv::$dbPass = '<%= props.dbPassDev %>';

ClientSettings::$settings['site_name'] = '<%= props.projectName %>.master.dev.enclos';

