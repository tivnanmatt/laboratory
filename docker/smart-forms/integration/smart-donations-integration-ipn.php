<?php
 function SmartFormsSaveDonationForm($formId,$formData,$referenceId)
 {
     include_once(SMART_FORMS_DIR.'php_classes/save/php_entry_saver_base.php');

     $phpEntry=new php_entry_saver_base($formId,$formData,'n',$referenceId);
     $phpEntry->ProcessEntry();
 }

function SmartFormsEmailIsValid($Email)
{
	global $wpdb;
	$count = $wpdb->get_var($wpdb->prepare("select count(*) from " . SMART_FORMS_TABLE_NAME . " where donation_email=%s", $Email));

	return $count > 0;
}