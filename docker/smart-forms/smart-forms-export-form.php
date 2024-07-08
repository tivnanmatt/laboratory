<?php

if ( !current_user_can('edit_posts') &&  !current_user_can('edit_pages') ) {
    die('Forbidden');
}
if(!defined('ABSPATH'))
    die('Forbidden');

if(!current_user_can('manage_options'))
    die('Forbidden');
$formId='';

if(isset($_GET['formId']))
    $formId=intval($_GET["formId"]);


global $wpdb;

$result=$wpdb->get_results($wpdb->prepare("SELECT * FROM ".SMART_FORMS_TABLE_NAME.' where form_id=%d',$formId),"ARRAY_A");
if(count($result)==0)
    return;

header('Content-Encoding: UTF-8');
header('Content-type: text/csv; charset=UTF-8');
header('Content-Disposition: attachment; filename='.$result[0]['form_name'].'.export');
echo json_encode($result[0]);


