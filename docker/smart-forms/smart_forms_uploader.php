<?php
$data="";
if(isset($_POST["data"]))
	$data= sanitize_text_field(stripslashes($_POST["data"]));


require_once SMART_FORMS_DIR.'utilities/JSONSanitizer.php';
$data=RednaoJSONSanitizer::Sanitize(json_decode($data,true),(object)
    ["formid"=>'',
      "action"=>''
        ]);

foreach($data as $key=>$value)
{
	if($key=='captcha'||$key=='nonce')
		$_POST[$key]=$value;
	else
		$_POST[$key]=addslashes($value);
}
require_once "smart-forms-ajax.php";
rednao_smart_forms_save_form_values();
