<?php

namespace Freestone;

VEnv::$name = 'dev';
VEnv::$dbServer = 'localhost';
VEnv::$dbName = '<%= props.projectName %>_master_dev';
VEnv::$dbUser = '<%= props.projectName %>_master_dev';
VEnv::$dbPass = '<%= props.dbPassDev %>';

