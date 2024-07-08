<?php

function GetPostValue($parameterName)
{
    require_once SMART_FORMS_DIR.'utilities/JSONSanitizer.php';
    if(isset($_POST[$parameterName]))
        if(is_array(($_POST[$parameterName])))
            return RednaoJSONSanitizer::Sanitize($_POST[$parameterName],(Object)['Data'=>(object)[]]);
        else
            return stripslashes(RednaoJSONSanitizer::Sanitize($_POST[$parameterName],(Object)['Data'=>(object)[]]));

    return "";
}

function rednao_smart_forms_export(){

        require_once SMART_FORMS_DIR.'smart-forms-export-form.php';


    die();
}

function smart_forms_export(){
    if(!wp_verify_nonce(GetPostValue('nonce'),'smart_forms_list_entries')||!current_user_can('edit_pages'))
    {
        echo json_encode(array(
            'success'=>false,
            'errorMessage'=>'Invalid Request'
        ));
        die();
    }

    require_once 'smart-forms-exporter.php';
}

function smart_forms_skip_tutorial(){
    if(!wp_verify_nonce(GetPostValue('nonce'),'save_nonce')||!current_user_can('edit_pages'))
    {
        echo json_encode(array(
            'success'=>false,
            'errorMessage'=>'Invalid Request'
        ));
        die();
    }

    update_site_option('smart_forms_show_tutorial','y');
}

function smart_forms_save_settings(){
    if((!wp_verify_nonce(GetPostValue('nonce'),'smart-forms-save-settings'))||!current_user_can('edit_pages'))
    {
        echo json_encode(array(
            'success'=>false,
            'message'=>'Invalid request'
        ));
        die();
    }
    $options=GetPostValue('options');
    if($options=='')
        return;
    foreach($options as $value)
    {
        update_option($value['key'],$value['value']);
    }
}

function rednao_smart_forms_resend_email(){
    $data=GetPostValue('data');


    require_once SMART_FORMS_DIR.'utilities/JSONSanitizer.php';
    $data=RednaoJSONSanitizer::Sanitize(json_decode(stripslashes($_POST['data'])),(object)[
        "EmailIndex"=>0,
        "FormId"=>0,
        "EntryId"=>0,
        "Nonce"=>''
    ]);

    if(!wp_verify_nonce($data->Nonce,'smart_forms_list_entries')||!current_user_can('edit_pages'))
    {
        echo json_encode(array(
            'success'=>false,
            'errorMessage'=>'Invalid Request'
        ));
        die();
    }
    $emailIndex=$data->EmailIndex;
    $form=$data->Form;
    $entryId=$data->EntryId;

    include_once(SMART_FORMS_DIR.'php_classes/save/php_entry_saver_base.php');

    global $wpdb;
    $entryRow=$wpdb->get_row($wpdb->prepare('select data from '.SMART_FORMS_ENTRY.' where entry_id=%d',$entryId));
    $form=$wpdb->get_row($wpdb->prepare('select * from '.SMART_FORMS_TABLE_NAME.' where form_id=%d',$form));


    $phpEntry=new php_entry_saver_base($data->Form,$entryRow->data,'n','',json_decode($form->form_options,true),json_decode($form->element_options,true));
    if($phpEntry->FormOptions['Emails']!=null&&count($phpEntry->FormOptions['Emails'])>$emailIndex)
    {
        require_once SMART_FORMS_DIR.'php_classes/save/insert_entry_base.php';
        require_once SMART_FORMS_DIR.'php_classes/save/pre_insert_entry.php';
        $additionalData=[];
        $preInsertedEntry=new PreInsertEntry($data->Form,$phpEntry->FormEntryData,$phpEntry->FormOptions,$phpEntry->ElementOptions,$additionalData);
        $phpEntry->SendFormEmail($phpEntry->FormOptions['Emails'][$emailIndex],$phpEntry->FormEntryData,$phpEntry->ElementOptions,$preInsertedEntry,false);
    }

    echo json_encode(array(
        'success'=>true,
        'result'=>true
    ));

    die();

}

function rednao_smart_forms_save()
{
    $form_id=GetPostValue("id");
    $element_options=GetPostValue("element_options");
    $form_options=GetPostValue("form_options");
    $client_form_options=GetPostValue("client_form_options");
    $donation_email=GetPostValue("donation_email");
    $nonce='';
    if(isset($_POST['nonce']))
        $nonce=$_POST['nonce'];

    if(!wp_verify_nonce($nonce,'save_nonce')||!current_user_can('manage_options'))
    {
        $form_id=intval($form_id);
        echo "{\"FormId\":\"$form_id\",\"Message\":\"Invalid Request\"}";
        die();
    }
    //$form_options=str_replace("\\\"","\"",$form_options);
    $formParsedValues=json_decode($form_options);


    if($formParsedValues->Name=="")
    {
        $message=__("Name is mandatory");
    }else{

            global $wpdb;
            if($form_id=="0")
            {
                $count= $wpdb->get_var($wpdb->prepare("SELECT count(*) FROM ".SMART_FORMS_TABLE_NAME." where form_name=%s",$formParsedValues->Name));

                if($count>0)
                {
                    $message=__("Form name already exists");

                }else
                {
                    $values=array('form_name'=>$formParsedValues->Name,
                        'element_options'=>$element_options,
                        'form_options'=>$form_options,
                        'client_form_options'=>$client_form_options,
                        'donation_email'=>$donation_email
                    );

                    $wpdb->insert(SMART_FORMS_TABLE_NAME,$values);
                    $form_id=$wpdb->insert_id;
                    $message="saved";
                    delete_transient("rednao_smart_forms_$form_id");
                }
            }else
            {
                $wpdb->update(SMART_FORMS_TABLE_NAME,array(
                    'form_name'=>$formParsedValues->Name,
                    'element_options'=>$element_options,
                    'form_options'=>$form_options,
                    'client_form_options'=>$client_form_options,
                    'donation_email'=>$donation_email
                ),array("form_id"=>$form_id));
                $message="saved";
                delete_transient("rednao_smart_forms_$form_id");

            }

        }


    echo json_encode(array(
        'FormId'=>$form_id,
        'Message'=>$message
    ));

    die();
}


function rednao_smart_form_short_code_setup()
{
    if ( (! current_user_can('edit_posts') && ! current_user_can('edit_pages'))||!wp_verify_nonce($_POST['nonce'],'short_code_setup') ) {
        return;
    }

    global $wpdb;

	$shortCodeOptions=array();
	array_push($shortCodeOptions,array(
		"Name"=>"Forms",
		"ShortCode"=>"sform",
		"Elements"=>array()
	));

	$result=$wpdb->get_results("SELECT form_id,form_name FROM ".SMART_FORMS_TABLE_NAME);
    //echo "[{\"Id\":\"0\",\"Name\":\"Select a Form\"}";
    foreach($result as $key=>$row)
    {
		array_push($shortCodeOptions[0]["Elements"],array(
			"Id"=>$row->form_id,
			"Name"=>$row->form_name
		));

    }

	$shortCodeOptions=apply_filters("smart_forms_get_short_code_options",$shortCodeOptions);

	echo json_encode($shortCodeOptions);
    die();
}




function rednao_smart_forms_save_form_values()
{
    include_once(SMART_FORMS_DIR.'php_classes/save/php_entry_saver_base.php');

    $form_id=GetPostValue("form_id");
    $formString=GetPostValue("formString");

    if(isset($_POST['nonce']))
        $nonce=$_POST['nonce'];

    $blockAnonymousSubmissions=get_option('smart_forms_block_anonymous_submissions');
    if(apply_filters('smart_forms_block_annonymous_submissions',$blockAnonymousSubmissions)&&!wp_verify_nonce($nonce,'save_form'))
    {
        echo '{"message":"'.__("Invalid submission, please refresh your screen and try again.").'","refreshCaptcha":"n","success":"n"}';
        die();
    }

	$captcha="";
	if(isset($_POST["captcha"]))
		if(is_array($_POST["captcha"]))
        {
            require_once SMART_FORMS_DIR.'utilities/JSONSanitizer.php';
            $captcha=(array)RednaoJSONSanitizer::Sanitize($_POST["captcha"],(object)[
                "version"=>"",
                "response"=>''
            ]);
        }
		else
			$captcha=sanitize_text_field(stripslashes($_POST["captcha"]));

    $phpEntry=new php_entry_saver_base($form_id,$formString,$captcha);
    $phpEntry->ProcessEntry();
	die();
}

function rednao_smart_forms_get_form_element_info()
{
	$formId=GetPostValue("formId");
    $nonce=GetPostValue("nonce");
	if (( ! current_user_can('edit_posts') && ! current_user_can('edit_pages'))||!wp_verify_nonce($nonce,'save_nonce') ) {
		return;
	}

	global $wpdb;
	$result=$wpdb->get_var($wpdb->prepare("SELECT element_options FROM ".SMART_FORMS_TABLE_NAME.' where form_id=%d',$formId));

	echo json_encode(array(
	    'elementsInfo'=>json_decode($result)
    ));

	die();
}

function rednao_smart_forms_get_form_options()
{
    $formId=GetPostValue("formId");
    $nonce=GetPostValue("nonce");
    if (( ! current_user_can('edit_posts') && ! current_user_can('edit_pages') )||!wp_verify_nonce($nonce,'save_nonce')) {
        return;
    }

    global $wpdb;
    $result=$wpdb->get_results($wpdb->prepare("SELECT form_options,element_options FROM ".SMART_FORMS_TABLE_NAME.' where form_id=%d',$formId));

    global $current_user;
    echo json_encode(array(
        'formOptions'=>json_decode($result[0]->form_options),
        'elementOptions'=>json_decode($result[0]->element_options),
        'CurrentEmail'=>strval($current_user->user_email)
    ));
    die();
}

function rednao_get_fixed_field_value($match,$entryData,$elementOptions,$useTestData)
{
	require_once(SMART_FORMS_DIR.'filter_listeners/fixed-field-listeners.php');
    $match=str_replace("'","\"",$match);
	$fixedFieldParameters=json_decode($match,true);
	if($fixedFieldParameters==null)
	{
		error_log('error parsing fixed field');
		return '';
	}

	try{
		$value=apply_filters("smart-forms-fixed-field-value-".$fixedFieldParameters["Op"],$fixedFieldParameters,$entryData,$elementOptions,$useTestData);
		if($value==$fixedFieldParameters)
			return "";
		if($value==null)
		    $value='';
		return strval($value);
	}catch(Exception $e)
	{
			error_log("Couldn't format date ".$e->getMessage());
	}

	return "";
}

function GetValueByField($stringBuilder,$match,$entryData,$elementOptions,$useTestData)
{
	if(strpos(trim($match),'{')===0)
	{
		return rednao_get_fixed_field_value($match,$entryData,$elementOptions,$useTestData);
	}

    foreach($entryData as $key=>$value)
    {
        $element=null;
        if($key!=$match)
            continue;

        $element=null;
        foreach($elementOptions as $item)
        {
            if($item["Id"]==$key)
            {
                $element=$item;
                break;
            }
        }
        if($element==null)
            continue;

        $value= $stringBuilder->GetStringFromColumn($element,$value);
        if($value==""&&$useTestData)
            $value="sample text";
        return $value;
    }

    if($useTestData)
        return "sample text";
}

function rednao_smart_forms_send_files(){
    require_once SMART_FORMS_DIR.'smart_forms_uploader.php';
    die();
}

function rednao_smart_form_delete_entries(){
    $data=json_decode(GetPostValue('data'));

    $nonce=$data->Nonce;

    if(!wp_verify_nonce($nonce,'smart_delete_entry')||!current_user_can('edit_pages'))
    {
        echo json_encode(array(
            'success'=>false,
            'errorMessage'=>'Invalid nonce, please refresh your screen and try again'
        ));
        die();
    }

    if($data==null||!isset($data->Ids))
    {
        echo json_encode(array(
            'success'=>false,
            'errorMessage'=>'Invalid values'
        ));
        die();
    }

    global $wpdb;

    $how_many = count($data->Ids);
    $placeholders = array_fill(0, $how_many, '%d');
    $format = implode(', ', $placeholders);
    $query = "DELETE FROM ".SMART_FORMS_ENTRY." WHERE entry_id IN($format)";
    $wpdb->query( $wpdb->prepare($query, $data->Ids) );


    $query = "DELETE FROM ".SMART_FORMS_ENTRY_DETAIL." WHERE entry_id IN($format)";
    $wpdb->query( $wpdb->prepare($query, $data->Ids) );

    echo json_encode(array(
        'success'=>true,
        'result'=>true
    ));

    die();


}

function rednao_smart_forms_entries_list()
{
    $data=json_decode(GetPostValue('data'));

    if(!isset($data->nonce)||!wp_verify_nonce($data->nonce,'smart_forms_list_entries')||(!current_user_can('manage_options')&&!current_user_can('smart_forms_view_entries'))) {
        echo json_encode(array(
            'success' => false,
            'errorMessage' => 'Invalid Request'
        ));
        die();
    }
    if($data==null)
    {
        echo json_encode(array(
            'success'=>false,
            'errorMessage'=>'Invalid values'
        ));
        die();
    }

    require_once SMART_FORMS_API;

    $query=new SmartFormsQuery($data->Form);


    global $wpdb;


    foreach($data->Conditions as $condition)
    {
        if(isset($condition->FieldId)&&isset($condition->Comparison)&& $condition->FieldId!=''&&$condition->Comparison!='')
        {
            $query->AddCondition($condition->FieldId,$condition->Comparison,$condition->Value);
        }
    }

    if($data->StartDate!=0)
    {
        $query->AddCondition('_Date','>=',get_gmt_from_date(date('Y-m-d H:i:s',$data->StartDate)));

    }

    if($data->EndDate!=0)
    {
        $query->AddCondition('_Date','<',get_gmt_from_date(date('Y-m-d H:i:s',$data->EndDate+86400)));
    }


    $result=$query->GetRaw($data->PageSize,$data->PageSize*$data->PageIndex);
    $entries=array();
    foreach($result as $row)
    {
        $entries[]=array(
            "date"=>get_date_from_gmt($row['date']),
            "entry_id"=>$row['entry_id'],
            "user_name"=>$row['user_name'],
            "user_id"=>$row['user_id'],
            "user_ip"=>$row['user_ip'],
            "data"=>json_decode($row['data'])
        );

    }
    echo json_encode(array(
        'success'=>true,
        'result'=>array(
            'rows'=>json_encode($entries),
            'count'=>$query->GetCount()
        )
    ));
    die();

}

function rednao_smart_form_send_test_email()
{
    $FromEmail=GetPostValue("FromEmail");
    $FromName=GetPostValue("FromName");
    $ToEmail=rtrim(GetPostValue("ToEmail"),",");
    $EmailSubject=GetPostValue("EmailSubject");
    $EmailText=GetPostValue("EmailText");
    $ReplyTo=GetPostValue("ReplyTo");
    $Bcc=GetPostValue("Bcc");
    $elementOptions=GetPostValue("element_options");
    $pdfs=GetPostValue("PDFS");
    $nonce=GetPostValue('nonce');

    if(!wp_verify_nonce($nonce,'save_nonce')||!current_user_can('edit_pages'))
    {
        echo '{"Message":"'.__("Invalid request").'"}';
        die();
    }

    if(!is_array($elementOptions))
        $elementOptions=json_decode($elementOptions,true);


    $valueArray=Array(
        "FromEmail"=>$FromEmail,
        "FromName"=>$FromName,
        "ToEmail"=>$ToEmail,
        "EmailSubject"=>$EmailSubject,
        "EmailText"=>$EmailText,
        "ReplyTo"=>$ReplyTo,
        "PDFS"=>$pdfs,
        "Bcc"=>$Bcc
    );
    $entryData=Array();


    if($EmailText=="")
    {
        echo '{"Message":"'.__("Email text can't be empty").'"}';
        die();
    }

	include_once(SMART_FORMS_DIR.'php_classes/save/php_entry_saver_base.php');
	$entrySaver=new php_entry_saver_base("","","");
    if($entrySaver->SendFormEmail($valueArray,$entryData,$elementOptions,null,true))
        echo '{"Message":"'.__("Email sent successfully").'"}';
    else
        echo '{"Message":"'.__("There was an error sending the email, please check the configuration").'"}';
    die();
}


function rednao_smart_forms_submit_license()
{
    include_once(SMART_FORMS_DIR.'smart-forms-license.php');



    $email=GetPostValue("email");
    $key=GetPostValue("key");
    $nonce=GetPostValue('nonce');
    if(!wp_verify_nonce($nonce,'save_nonce')||!current_user_can('edit_pages'))
    {
        echo json_encode(array(
            'success'=>false,
            'errorMessage'=>'Invalid Request'
        ));
        die();
    }

    $license=smart_forms_check_license($email,$key,$error);
    if($license["is_valid"])
    {
        echo '{"IsValid":"y","Message":"'.__("License submitted successfully, thank you!!").'","licenseType":""}';
    }else
    {
        if($error==null)
        {
            echo '{"IsValid":"n",  "Message":"'.__("Invalid user or license").'"}';
        }else {
            echo '{"IsValid":"n","Message":"' . __("An error occurred") . '"}';
        }
    }

    die();
}

function rednao_smart_forms_execute_op()
{
	$id=GetPostValue('TransactionId');
	$oper=GetPostValue('oper');
    $nonce=GetPostValue('nonce');

    if (( ! current_user_can('edit_posts') && ! current_user_can('edit_pages') )||!wp_verify_nonce($nonce,'smart_forms_list_entries')) {
        return;
    }
	if($oper=="del")
	{
		global $wpdb;
		if($wpdb->query($wpdb->prepare("delete from ".SMART_FORMS_ENTRY." WHERE entry_id=%d",$id))>0)
        {
            $wpdb->query($wpdb->prepare("delete from ".SMART_FORMS_ENTRY_DETAIL." WHERE entry_id=%d",$id));
            echo '{"success":"1"}';
        }
		else
			echo '{"success":"0","message":"'.__("Could not delete row").'"}';
		die();
	}

	if($oper=='massDelete')
    {
        global $wpdb;
        $ids=GetPostValue('entriesToDelete');
        $ids=json_decode($ids);
        $idwhere='';
        foreach($ids as $id)
        {
            if($idwhere!='')
                $idwhere.=',';
            $idwhere.=$wpdb->prepare('%d',$id);
        }

        $wpdb->query('delete from '.SMART_FORMS_ENTRY.' where entry_id in('.$idwhere.')');
        $wpdb->query('delete from '.SMART_FORMS_ENTRY_DETAIL.' where entry_id in('.$idwhere.')');
        echo '{"success":"1"}';
        die();

    }

}

function rednao_smart_forms_send_test()
{
    if (( ! current_user_can('edit_posts') && ! current_user_can('edit_pages') )||!wp_verify_nonce(GetPostValue('nonce'),'save_nonce')) {
        return;
    }

    require_once SMART_FORMS_DIR.'php_classes/smart_forms_troubleshoot/smart_forms_email.php';
    switch(GetPostValue('Id'))
    {
        case "basic":
            $smartFormsEmail=new smart_forms_email_troubleshoot_basic();
            break;
        case "custom":
            $smartFormsEmail=new smart_forms_email_troubleshoot_custom_smtp();
            break;
    }
    if($smartFormsEmail->Start())
        echo json_encode(
            array(
                "Passed"=>'y'
        ));
    else
        echo json_encode(
            array(
                "Passed"=>'n',
                "Message"=>$smartFormsEmail->LatestError
            ));
    die();
}

function rednao_smart_forms_export_entries(){
    if(!isset($_GET['data']))
    {
        echo "Invalid request";
        die();
    }

    require_once SMART_FORMS_DIR.'utilities/JSONSanitizer.php';
    $data=RednaoJSONSanitizer::Sanitize(json_decode(stripslashes($_GET['data'])),(object)[
       "Nonce"=>'',
        "Form"=>0,
        "StartDate"=>0,
        "EndDate"=>0,
        "Conditions"=>[(object)[
            "FieldId"=>"",
            "Comparison"=>"",
            "Value"=>"",

        ]]
    ]);

    if($data==null)
    {
        echo "Invalid request";
        die();
    }

    if(!wp_verify_nonce($data->Nonce,'smart_forms_export')||!current_user_can('manage_options'))
    {
        echo "Invalid request";
        die();
    }
    require_once SMART_FORMS_API;
    $query=new SmartFormsQuery($data->Form);


    global $wpdb;


    foreach($data->Conditions as $condition)
    {
        if(isset($condition->FieldId)&&isset($condition->Comparison)&& $condition->FieldId!=''&&$condition->Comparison!='')
        {
            $query->AddCondition($condition->FieldId,$condition->Comparison,$condition->Value);
        }
    }

    if($data->StartDate!=0)
    {
        $query->AddCondition('_Date','>=',get_gmt_from_date(date('Y-m-d H:i:s',$data->StartDate)));

    }

    if($data->EndDate!=0)
    {
        $query->AddCondition('_Date','<',get_gmt_from_date(date('Y-m-d H:i:s',$data->EndDate+86400)));
    }


    $formName=$wpdb->get_var($wpdb->prepare('select form_name from '.SMART_FORMS_TABLE_NAME.' where form_id=%s',$data->Form));

    $result=$query->GetResults('','','array');
    $fh = fopen('php://output', 'w');
    $headers=array();

    header('Pragma: public');
    header('Expires: 0');
    header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
    header('Cache-Control: private', false);
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="' . str_replace('"', '\"', $formName[0].'_Export')  . '.csv";');
    header('Content-Transfer-Encoding: binary');

    foreach($query->selectColumns as $column)
    {
        if($column=='_Date')
            $headers[]='Date';
        if($column=='_UserName')
            $headers[]='User Name';

        if(isset($query->fieldDictionary[$column]))
        {
            $field=$query->fieldDictionary[$column];
            if($field['ClassName']=='rednaosurveytable')
            {
                foreach($field['Rows'] as $row)
                {
                    $headers[]=$row['label'];
                }
            }else
                $headers[]=$field['Label'];
        }
    }

    fputcsv($fh,$headers);

    foreach($result as $row)
    {
        $csvRow=array();
        foreach($query->selectColumns as $column)
        {
            if($column=='_Date')
                $csvRow[]=$row['_Date'];
            if($column=='_UserName')
                $csvRow[]=$row['_UserName'];


            if(!isset($query->fieldDictionary[$column]))
                continue;
            $field=$query->fieldDictionary[$column];
            if($field['ClassName']=='rednaosurveytable')
            {
                $raw=$row[$column]['raw'];
                foreach($field['Rows'] as $fieldRow)
                {
                    $value='';
                    if(isset($raw['values'])&&is_array($raw['values']))
                    {
                        foreach($raw['values'] as $surveyRow)
                        {
                            if(isset($surveyRow['QuestionLabel'])&&$surveyRow['QuestionLabel']==$fieldRow['label']){
                                $value=$surveyRow['ValueLabel'];
                            }
                        }
                    }

                    $csvRow[]=str_replace(array("\n", "\r"), ' ', $value);
                }
            }else
                $csvRow[]=str_replace(array("\n", "\r"), ' ',  $row[$column]['plain']);
        }
        fputcsv($fh,$csvRow);
    }

    die();


}

function rednao_smart_forms_edit_form_values()
{
    $entryId=GetPostValue("entryId");
    $entryString=GetPostValue("entryString");
    $elementOptions=GetPostValue("elementOptions");
    $nonce=GetPostValue("nonce");

    if(!wp_verify_nonce($nonce,'smart_forms_edit_values')||!current_user_can('edit_pages'))
    {
        echo json_encode(array('result'=>false));
        die();

    }



    include_once(SMART_FORMS_DIR.'php_classes/save/php_entry_editor.php');
    $phpEditor=new php_entry_editor();
    echo json_encode(array('result'=>$phpEditor->execute_editor($entryId,$entryString,$elementOptions)));
    die();
}

function rednao_smart_forms_get_file(){
    if(!isset($_GET['id']))
    {
        echo "Invalid request";
        die();
    }
    $id=sanitize_text_field($_GET['id']);
    global $wpdb;
    $result=$wpdb->get_row($wpdb->prepare('select original_name,file_name,file_mime from '.SMART_FORMS_UPLOADED_FILES.' where file_key=%s',$id));
    if($result==false)
    {
        echo 'File not found';
        die();
    }
    header('Content-type: '.$result->file_mime);
    header('Content-Disposition: attachment; filename="'.$result->original_name.'"');
    readfile($result->file_name);
    die();
}