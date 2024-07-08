<?php
wp_enqueue_script('jquery');
wp_enqueue_script('isolated-slider',SMART_FORMS_DIR_URL.'js/rednao-isolated-jq.js',array('jquery'),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('rednao-commons',SMART_FORMS_DIR_URL.'js/utilities/rnCommons.js',array('isolated-slider'),SMART_FORMS_FILE_VERSION);
wp_enqueue_style('smart-forms-bootstrap-theme',SMART_FORMS_DIR_URL.'css/bootstrap/bootstrap-theme.css',array(),SMART_FORMS_FILE_VERSION);
wp_enqueue_style('smart-forms-bootstrap',SMART_FORMS_DIR_URL.'css/bootstrap/bootstrap-scopped.css',array(),SMART_FORMS_FILE_VERSION);
wp_enqueue_style('smart-forms-ladda',SMART_FORMS_DIR_URL.'css/bootstrap/ladda-themeless.min.css',array(),SMART_FORMS_FILE_VERSION);
wp_enqueue_style('smart-forms-fontawesome',SMART_FORMS_DIR_URL.'css/bootstrap/font-awesome.min.css',array(),SMART_FORMS_FILE_VERSION);

wp_enqueue_script('smart-forms-bootstrap-theme',SMART_FORMS_DIR_URL.'js/bootstrap/bootstrapUtils.js',array('isolated-slider','smart-forms-bootstrap-js'),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('smart-forms-bootstrap-js',SMART_FORMS_DIR_URL.'js/bootstrap/bootstrap.min.js',array('isolated-slider'),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('smart-forms-spin-js',SMART_FORMS_DIR_URL.'js/bootstrap/spin.min.js',array(),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('smart-forms-ladda-js',SMART_FORMS_DIR_URL.'js/bootstrap/ladda.min.js',array('smart-forms-spin-js'),SMART_FORMS_FILE_VERSION);