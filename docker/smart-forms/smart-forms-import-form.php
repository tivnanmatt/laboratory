<?php
if (isset($_FILES['upload_file'])&& $_FILES['upload_file']['error'] == UPLOAD_ERR_OK && is_uploaded_file($_FILES['upload_file']['tmp_name'])) {
    $content= file_get_contents($_FILES['upload_file']['tmp_name']);

    $parsedContent=json_decode($content,true);
    $parsedContent["form_id"]="0";
    $formName=$parsedContent["form_name"];

    global $wpdb;
    $count=1;

    while(true)
    {
        $count= $wpdb->get_var($wpdb->prepare("SELECT count(*) FROM ".SMART_FORMS_TABLE_NAME." where form_name=%s",$formName));
        if($count==0)
            break;
        $formName.=' Copy';
    }

    $parsedContent["form_name"]=$formName;
    $formOptions=json_decode($parsedContent['form_options'],true);
    $formOptions["Name"]=$formName;
    $parsedContent['form_options']=json_encode($formOptions);

    $values=array('form_name'=>$parsedContent["form_name"],
        'element_options'=>$parsedContent["element_options"],
        'form_options'=>$parsedContent["form_options"],
        'client_form_options'=>$parsedContent["client_form_options"],
        'donation_email'=>$parsedContent["donation_email"]
    );

    $wpdb->insert(SMART_FORMS_TABLE_NAME,$values);

    ?>
    <div style="height: 50px;" class="bootstrap-wrapper">
        <div style="height: 50px;"><div id="sdNotifications" class="alert alert-success" style="padding: 10px; box-shadow: none; display: block;"><span class="glyphicon glyphicon-ok" style="margin-right: 5px;"></span><span>Form Imported Successfully. Form Name: <?php echo esc_html($formName) ?></span></div></div>
    </div>


<?php
}



