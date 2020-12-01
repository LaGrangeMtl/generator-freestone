<?php

namespace Freestone;

VEnv::$dbServer = 'localhost';
VEnv::$dbName = '<%= props.projectName %>_master_staging';
VEnv::$dbUser = '<%= props.projectName %>_master_staging';
VEnv::$dbPass = '<%= props.dbPassStaging %>';

ClientSettings::$settings['site_name'] = '<%= props.projectName %>.master.staging.enclos';

