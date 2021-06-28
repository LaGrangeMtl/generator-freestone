<?php

namespace Freestone;

VEnv::$name = 'staging';
VEnv::$dbServer = 'localhost';
VEnv::$dbName = '<%= props.projectName %>_master_staging';
VEnv::$dbUser = '<%= props.projectName %>_master_staging';
VEnv::$dbPass = '<%= props.dbPassStaging %>';
