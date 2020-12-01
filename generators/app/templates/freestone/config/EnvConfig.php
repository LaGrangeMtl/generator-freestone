<?php

namespace Freestone;

VEnv::$dbServer = 'local.enclos.ca';
VEnv::$dbName = '<%= props.projectName %>_master_local';
VEnv::$dbUser = '<%= props.projectName %>_master_local';
VEnv::$dbPass = '<%= props.dbPassLocal %>';

ClientSettings::$settings['site_name'] = '<%= props.projectName %>.master.local.enclos';
