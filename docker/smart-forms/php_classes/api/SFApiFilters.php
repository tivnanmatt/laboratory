<?php

/**
 * Created by PhpStorm.
 * User: Edgar
 * Date: 9/11/2016
 * Time: 8:17 AM
 */
class SFApiFilters
{
    public function register_hooks(){
        add_filter( 'smart_formsf_include_systemjs', array($this,'include_systemjs') );
    }

    public function include_systemjs($htmlContent){


        $htmlContent="<script type='text/javascript'>var smartFormsRootPath='".esc_url(SMART_FORMS_DIR_URL)."'</script>".$htmlContent;
        wp_enqueue_script('smart-forms-rxjs',SMART_FORMS_DIR_URL.'/js/utilities/rxjs/rxjs.js',array(),SMART_FORMS_FILE_VERSION);
        wp_enqueue_script('smart-forms-systemjs-polyfill',SMART_FORMS_DIR_URL.'/js/utilities/systemjs/system-polyfill.js',array(),SMART_FORMS_FILE_VERSION);
        wp_enqueue_script('smart-forms-systemjs',SMART_FORMS_DIR_URL.'/js/utilities/systemjs/system.js',array('smart-forms-systemjs-polyfill'),SMART_FORMS_FILE_VERSION);
        //wp_enqueue_script('smart-forms-systemjs-css',SMART_FORMS_DIR_URL.'/js/utilities/systemjs/system-css.js',array('smart-forms-systemjs'));
        wp_enqueue_script('smart-forms-systemjs-main-config',SMART_FORMS_DIR_URL.'/js/utilities/systemjs/systemJsMainConfig.js',array('smart-forms-systemjs','smart-forms-rxjs'),SMART_FORMS_FILE_VERSION);
        return $htmlContent;
    }
}