<?php
add_filter('smart-forms-get-email-fixed-field-listener','smart_forms_email_current_date');
function smart_forms_email_current_date($array)
{
	array_push($array,
		array(
				"Label"=>__("Current Date"),
				"Op"=>"CurrentDate",
				"Parameters"=>array(
					"Format"=>"m/d/y"
				)
			)
	);

	return $array;
}
add_filter('smart-forms-fixed-field-value-CurrentDate','smart_forms_get_fixed_fields_CurrentDate',10,4);
function smart_forms_get_fixed_fields_CurrentDate($fieldParameters,$formData,$elementOptions,$useTestData)
{
	return date($fieldParameters["Format"]);
}



add_filter('smart-forms-get-email-fixed-field-listener','smart_forms_email_sequential_id');
function smart_forms_email_sequential_id($array)
{
    array_push($array,
        array(
            "Label"=>__("Entry Id (sequential number)"),
            "Op"=>"SequentialId",
            "Parameters"=>array(
            )
        )
    );

    return $array;
}

add_filter('smart-forms-get-email-fixed-field-listener','smart_forms_email_original_url');
function smart_forms_email_original_url($array)
{
	array_push($array,
		array(
			"Label"=>__("Original URL"),
			"Op"=>"OriginalUrl",
			"Parameters"=>array(
			)
		)
	);

	return $array;
}
add_filter('smart-forms-fixed-field-value-OriginalUrl','smart_forms_get_fixed_fields_OriginalUrl',10,4);
function smart_forms_get_fixed_fields_OriginalUrl($fieldParameters,$formData,$elementOptions,$useTestData)
{
    if(!isset($_POST['requestUrl']))
        return '';

	return esc_url($_POST['requestUrl']);
}


add_filter('smart-forms-fixed-field-value-SequentialId','smart_forms_get_fixed_fields_SequentialId',10,4);
function smart_forms_get_fixed_fields_SequentialId($fieldParameters,$formData,$elementOptions,$useTestData)
{
    if(!isset($formData['_sequentialId']))
        return '';

    return strval($formData['_sequentialId']);
}







add_filter('smart-forms-get-email-fixed-field-listener','smart_forms_email_form_id');
function smart_forms_email_form_id($array)
{
    array_push($array,
        array(
            "Label"=>__("Form Id"),
            "Op"=>"FormId",
            "Parameters"=>array(
            )
        )
    );

    return $array;
}
add_filter('smart-forms-fixed-field-value-FormId','smart_forms_get_fixed_fields_FormId',10,4);
function smart_forms_get_fixed_fields_FormId($fieldParameters,$formData,$elementOptions,$useTestData)
{
    if($useTestData)
        return 'test';
    return $formData['_formid'];
}



add_filter('smart-forms-get-email-fixed-field-listener','smart_forms_email_ip');
function smart_forms_email_ip($array)
{
	array_push($array,
		array(
			"Label"=>__("IP"),
			"Op"=>"IP",
			"Parameters"=>array(
			)
		)
	);

	return $array;
}
add_filter('smart-forms-fixed-field-value-IP','smart_forms_get_fixed_fields_IP',10,4);
function smart_forms_get_fixed_fields_IP($fieldParameters,$formData,$elementOptions,$useTestData)
{
	return $_SERVER['REMOTE_ADDR'];
}



add_filter('smart-forms-get-email-fixed-field-listener','smart_forms_logged_user');
function smart_forms_logged_user($array)
{
	array_push($array,
		array(
			"Label"=>__("Username"),
			"Op"=>"USERNAME",
			"Parameters"=>array(
			)
		)
	);

	return $array;
}
add_filter('smart-forms-fixed-field-value-USERNAME','smart_forms_get_fixed_fields_username',10,4);
function smart_forms_get_fixed_fields_username($fieldParameters,$formData,$elementOptions,$useTestData)
{
	$current_user = wp_get_current_user();
	if(!$current_user)
		return '';

	return $current_user->user_login;
}



add_filter('smart-forms-get-email-fixed-field-listener','smart_forms_fieldsummary');
function smart_forms_fieldsummary($array)
{
	array_push($array,
		array(
			"Label"=>__("Field Summary"),
			"Op"=>"FIELDSUMMARY",
			"Parameters"=>array(
			)
		)
	);

	return $array;
}
add_filter('smart-forms-fixed-field-value-FIELDSUMMARY','smart_forms_get_fixed_fields_FIELDSUMMARY',10,4);
function smart_forms_get_fixed_fields_FIELDSUMMARY($fieldParameters,$formData,$elementOptions,$useTestData)
{
	include_once(SMART_FORMS_DIR.'string_renderer/rednao_string_builder.php');
	include_once(SMART_FORMS_DIR.'smart-forms-ajax.php');
	$stringBuilder=new rednao_string_builder();

	$summary="";
	foreach($elementOptions as $option){
		$fieldId=$option["Id"];

		if($useTestData)
            if($option['ClassName']=='rednaosubmissionbutton')
                $value='';
            else
                $value = 'test';
		else{
            if(!isset($formData[$fieldId]))
                continue;
            $value=$stringBuilder->GetStringFromColumn($option,$formData[$fieldId],$formData['_formid']);
        }

		if(trim($value)!==""){
		    if($option['ClassName']=='rednaorepeater'){
                $summary .=  $value . "<br/>";
            }else
            {
                $label='';
                if(isset($option["Label"]))
                    $label= htmlspecialchars($option["Label"]);
                $summary .= "<strong style='vertical-align: top'>" . $label . ":</strong> " . $value . "<br/>";
            }
		}
	}

	$summary=apply_filters('smartforms_executed_fieldsummary',$summary,$fieldParameters,$formData,$elementOptions);
	return $summary;
}
