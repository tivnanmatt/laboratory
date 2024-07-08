<?php
/**
 * Created by JetBrains PhpStorm.
 * User: edseventeen
 * Date: 3/29/13
 * Time: 9:29 AM
 * To change this template use File | Settings | File Templates.
 */

if(!defined('ABSPATH'))
    die('Forbidden');

if(!current_user_can('manage_options'))
    die('Forbidden');

wp_enqueue_style('smart-forms-toast-style',SMART_FORMS_DIR_URL.'js/utilities/toastr/toastr.min.css');

wp_enqueue_script('smart-forms-toast',SMART_FORMS_DIR_URL.'js/utilities/toastr/toastr.min.js');
wp_enqueue_script('isolated-slider',SMART_FORMS_DIR_URL.'js/rednao-isolated-jq.js',array('jquery'));
wp_enqueue_script('smart-forms-settings',SMART_FORMS_DIR_URL.'js/main_screens/settings.js',array('jquery','isolated-slider'),SMART_FORMS_FILE_VERSION);
wp_localize_script('smart-forms-settings','rnparams',array(
    'SmartFormsEnableGDPR'=>get_option('SmartFormsEnableGDPR',false),
    'nonce'=>wp_create_nonce('smart-forms-save-settings')
));
require_once(SMART_FORMS_DIR.'smart-forms-bootstrap.php');


?>



<div class="bootstrap-wrapper" style="margin:10px;">
    <h1>Smart Forms Settings</h1>
    <button style="min-width:100px;cursor: hand;cursor: pointer;" class="btn btn-success ladda-button" id="smartFormsSave" data-style="expand-left">
        <span class="glyphicon glyphicon-floppy-disk"></span><span class="ladda-label">Save</span>
    </button>
    <h4>GDPR</h4>
    <hr style="border-bottom: 1px solid #e4e4e4;margin:1px !important;"/>
    <div class="row">
        <input id="inputGDPR" type="checkbox" style="margin:0;padding:0;"/>
        <label for="inputGDPR" style="margin:0;padding:0;">Enable GDPR features in your form <a target="_blank" href="https://sfmanual.rednao.com/documentation/other-features/gdpr">Learn more here</a> </label>
    </div>
</div>
