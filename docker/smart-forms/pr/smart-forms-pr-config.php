<?php
global $wpdb;
if(!defined('ABSPATH'))
	die('Forbidden');
define('SMART_FORMS_PR_PLUGIN_NAME',dirname(plugin_basename(__FILE__)));
define('SMART_FORMS_PR_DIR',WP_PLUGIN_DIR.'/'.SMART_FORMS_PR_PLUGIN_NAME.'/');
define('SMART_FORMS_PR_DIR_URL',plugin_dir_url(__FILE__));

