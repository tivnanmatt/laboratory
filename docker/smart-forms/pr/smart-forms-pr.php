<?php
require_once('smart-forms-pr-config.php');

//****************************************************************************************add new extension********************************************************
add_action('smart_forms_pr_add_new_extension','smart_forms_pr_add_new_extension');
add_filter('smart_forms_pr_add_new_js_extension','smart_forms_pr_add_new_js_extension');
function smart_forms_pr_add_new_extension()
{

		wp_enqueue_script('smart-forms-pr-add-new-extension',SMART_FORMS_PR_DIR_URL.'js/main_screens/add-new-extensions.js',array('isolated-slider','rednao-smart-forms-licensing-manager','smart-forms-form-elements'),SMART_FORMS_FILE_VERSION);

	do_action('smart_forms_pr_add_form_elements_extensions');
}
function smart_forms_pr_add_new_js_extension($val)
{
	$result=smart_forms_lc_is_valid_with_options(array());
	if($result["is_valid"]==true)
	{
		array_push($val,'smart-forms-pr-add-new-extension');
	}
	return $val;
}

//****************************************************************************************form element extensions********************************************************
add_action('smart_forms_pr_add_form_elements_extensions','smart_forms_pr_add_form_elements_extensions');
function smart_forms_pr_add_form_elements_extensions()
{
		wp_enqueue_script('smart-forms-form-elements-extensions',SMART_FORMS_PR_DIR_URL.'js/form_element_extensions/form-element-extensions.js',array('smart-forms-form-elements','isolated-slider'),SMART_FORMS_FILE_VERSION);
		wp_enqueue_style('smart-forms-pr-main-style',SMART_FORMS_PR_DIR_URL.'css/main-style.css');
}


//****************************************************************************************License********************************************************
add_filter('smart_forms_lc_is_valid','smart_forms_lc_is_valid');
add_filter('smart_forms_lc_is_valid_with_options','smart_forms_lc_is_valid_with_options');
function smart_forms_lc_is_valid($val)
{
	$email=$val["email"];
	$key=$val["key"];

	$email=trim($email);
	$key=trim($key);
	delete_transient("smart_forms_check_again");


	$response=wp_remote_post(SECURE_SMART_FORMS_REDNAO_URL.'smart_forms_license_validation.php',array('sslverify' => false,'body'=> array( 'email'=>$email,'key'=>$key,'product'=>'sf','ver'=>"2"),'timeout'=>10));
	if($response instanceof WP_Error)
	{
		$val["error"]=$response->get_error_message();
		$val["is_valid"]=false;
		$val["licenseType"]="";
	}
	else
	{
		if(strpos ($response['body'], "invalid")===false&&strpos ($response['body'], "valid") !==false)
		{
			$val["is_valid"] = true;
			$val["licenseType"]="";
            set_transient("smart_forms_check_again",1,60*60*24*7);

		}
		else{
			$val["is_valid"]=false;
		}
	}

	return $val;
}

function smart_forms_lc_is_valid_with_options($val)
{
	if(get_transient("smart_forms_check_again"))
		return array("is_valid"=>true,"error"=>"","licenseType"=>get_option("smart_forms_license"));
	$email=get_option('smart_forms_email');
	$key=get_option('smart_forms_key');

	if($email==false||$key==false)
		return array("is_valid"=>false,"error"=>"","licenseType"=>"");

	return smart_forms_lc_is_valid(
		array(
			"email"=>($email?$email:""),
			"key"=>($key?$key:""),
			"error"=>"",
			"is_valid"=>false
		));

}