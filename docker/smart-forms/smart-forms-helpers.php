<?php
function rednao_smart_forms_load_form($title,$form_id,$returnComponent)
{
    require_once(SMART_FORMS_DIR.'additional_fields/smart-forms-additional-fields-list.php');
    //$options=get_transient("rednao_smart_forms_$form_id");
    $options=false;
    if($options==false)
    {
        global $wpdb;
		/** @noinspection PhpUndefinedMethodInspection */
		$result="";
		if($form_id!=-1)
        {
            $result = $wpdb->get_results($wpdb->prepare("select form_id,element_options,form_options,client_form_options from " . SMART_FORMS_TABLE_NAME . " where form_id=%d", $form_id));
            if (count($result) > 0)
            {
                $result = $result[0];
                $options = array('elements' => $result->element_options,
                    'options' => $result->form_options,
                    'form_id' => $result->form_id,
                    'client_form_options' => $result->client_form_options
                );

                set_transient("rednao_smart_forms_$form_id", $options);
            }
        }else
            $options=array(1);

    }


    $additionalFields=array();
    if(isset($_GET['sfpreview']))
        $additionalFields=apply_filters('smart_forms_af_names',$additionalFields);
    else{
        $formOptions=json_decode($options['options'],true);
        if(isset($formOptions["AdditionalFields"]))
        {
            foreach($formOptions["AdditionalFields"] as $field)
            {
                array_push($additionalFields,array("id"=>$field));
            }
        }
    }

    $generatorDependencies=array('isolated-slider','smart-forms-event-manager','smart-forms-generator-interface','smart-forms-form-elements');
    foreach($additionalFields as $field)
    {
        array_push($generatorDependencies,'smart-forms-af-'.$field['id']);
        do_action('smart_forms_af_'.$field['id']);
    }

    $formElementDependencies=array('isolated-slider','smart-forms-form-elements-container');
    $formElementDependencies=apply_filters('smart_forms_add_form_elements_dependencies',$formElementDependencies);

    wp_enqueue_script('jquery');
    wp_enqueue_script('smart-forms-event-manager',SMART_FORMS_DIR_URL.'js/formBuilder/eventmanager.js',array('isolated-slider'),SMART_FORMS_FILE_VERSION);
    wp_enqueue_script('smart-forms-generator-interface',SMART_FORMS_DIR_URL.'js/subscriber_interfaces/ismart-forms-generator.js',array('isolated-slider'),SMART_FORMS_FILE_VERSION);
    wp_enqueue_script('isolated-slider',plugin_dir_url(__FILE__).'js/rednao-isolated-jq.js',SMART_FORMS_FILE_VERSION);
    wp_enqueue_script('smart-forms-generator',plugin_dir_url(__FILE__).'js/form-generator.js',$generatorDependencies,SMART_FORMS_FILE_VERSION);
    wp_enqueue_script('smart-forms-form-elements-container',SMART_FORMS_DIR_URL.'js/formBuilder/container/Container.js',array('isolated-slider'),SMART_FORMS_FILE_VERSION);
    wp_enqueue_script('smart-forms-form-elements',plugin_dir_url(__FILE__).'js/formBuilder/formelements.js',$formElementDependencies,SMART_FORMS_FILE_VERSION);
    wp_enqueue_script('smart-forms-formula',SMART_FORMS_DIR_URL.'js/formBuilder/formula/formula.js',array('isolated-slider','smart-forms-event-manager'),SMART_FORMS_FILE_VERSION);
    wp_enqueue_script('smart-forms-formula-manager',SMART_FORMS_DIR_URL.'js/formBuilder/formula/formulamanager.js',array('isolated-slider','smart-forms-event-manager','smart-forms-formula'),SMART_FORMS_FILE_VERSION);
    wp_enqueue_script('smart-forms-elements-manipulators',SMART_FORMS_DIR_URL.'js/formBuilder/properties/manipulators.js',array('isolated-slider'),SMART_FORMS_FILE_VERSION);
	wp_enqueue_script('smart-forms-conditional-handlers',SMART_FORMS_DIR_URL.'js/bundle/conditionalHandlers_bundle.js',array('isolated-slider'),SMART_FORMS_FILE_VERSION);

	if($form_id==-1)
        wp_enqueue_script('smart-forms-preview-helper',plugin_dir_url(__FILE__).'js/formBuilder/previewHelper.js',array('smart-forms-generator'),SMART_FORMS_FILE_VERSION);

    do_action('smart_forms_loading_form',$options);
	do_action('smart_forms_pr_add_form_elements_extensions');
	require_once(SMART_FORMS_DIR.'translations/form-elements-translation.php');
	require_once(SMART_FORMS_DIR.'smart-forms-bootstrap.php');

    wp_enqueue_style('smart-forms-Slider',SMART_FORMS_DIR_URL.'css/smartFormsSlider/jquery-ui-1.10.2.custom.min.css',array(),SMART_FORMS_FILE_VERSION);
    wp_enqueue_style('smart-forms-custom-elements',plugin_dir_url(__FILE__).'css/formBuilder/custom.css',array(),SMART_FORMS_FILE_VERSION);


    $random=rand();
    if($form_id==-1)
        $random="sfpreviewcontainer";

	if(!defined ("SMART_DONATIONS_PLUGIN_URL"))
		define("SMART_DONATIONS_PLUGIN_URL","");

	if(!defined ("SMART_DONATIONS_SANDBOX"))
		define("SMART_DONATIONS_SANDBOX","");


    $user=wp_get_current_user();
    $userName=$user->user_login;
    $firstName='';
    $lastName='';
    $email='';
    if($userName==false)
        $userName='';
    else{
        $firstName=$user->user_firstname;
        $lastName=$user->user_lastname;
        $email=$user->user_email;
    }


    if($returnComponent==false)
    {
        echo "<script type=\"text/javascript\">var ajaxurl = '".esc_url(admin_url('admin-ajax.php'))."';</script>";
		echo "<div class='widget'>";
        if($options==null)
            return null;

        if($title)
            echo "<div class='widget-wrapper'><h3 class='widgettitle widget-title'>".esc_html($title)."</h3>";

        ?>


        <div id="formContainer<?php echo esc_attr($random)?>" class='sfForm rednaoFormContainer bootstrap-wrapper SfFormElementContainer'></div>
        <script type="text/javascript">
            var smartFormsSaveNonce=<?php echo json_encode(wp_create_nonce('save_form'))?>;
			var smartFormsCurrentTime=new Date(<?php echo json_encode(date('D M d Y H:i:s O'))?>);
            var smartFormsUserName=<?php echo json_encode($userName)?>;
            var smartFormsFirstName=<?php echo json_encode($firstName)?>;
            var smartFormsLastName=<?php echo json_encode($lastName)?>;
            var smartFormsEmail=<?php echo json_encode($email)?>;
            var smartFormsPath=<?php echo json_encode(plugin_dir_url(__FILE__))?>;
            var smartDonationsRootPath=<?php echo json_encode(SMART_DONATIONS_PLUGIN_URL) ?>;
            var smartDonationsSandbox=<?php echo json_encode(SMART_DONATIONS_SANDBOX) ?>;
			var smartFormsDesignMode=false;
			var smartFormsAdditionalFields<?php echo ($options['form_id']==null?0:intval($options['form_id']))?>=<?php echo json_encode($additionalFields)?>;
            if(!window.smartFormsItemsToLoad)
                window.smartFormsItemsToLoad=[];

            window.smartFormsItemsToLoad.push(<?php echo json_encode([
                'form_id'=>$options['form_id'],
                'elements'=>json_decode($options['elements']),
                'client_form_options'=>json_decode($options['client_form_options']),
                'container'=>'formContainer'.$random
                ])?>);

        </script>
        <?php
        if($title)
            echo "</div>";

		echo "</div>";

    }else{

        global $createdForms;
        if($createdForms==null)
            $createdForms=array();

        $loadedForm="";
        if($form_id!=-1)
        {


            $newOptions=[];
            $newOptions['form_id']=$form_id;
            $newOptions['elements']=json_decode($options['elements']);
            $newOptions['client_form_options']=json_decode($options['client_form_options']);
            $newOptions['container']='formContainer'.$random;

            $createdForms[]=$newOptions;
            wp_localize_script('smart-forms-generator','smartFormsItemsToLoad',$createdForms);

        }
        $script="
            var ajaxurl = '".admin_url('admin-ajax.php')."';
            var smartFormsCurrentTime=new Date('".date('D M d Y H:i:s O')."');
            	var smartFormsSaveNonce=\"".wp_create_nonce('save_form')."\";
            	var smartFormsUserName=\"".$userName."\";
            	var smartFormsFirstName=\"".$firstName."\";
            	var smartFormsLastName=\"".$lastName."\";
            	var smartFormsEmail=\"".$email."\";
                var smartFormsPath=\"".plugin_dir_url(__FILE__)."\";
                var smartDonationsRootPath=\"".SMART_DONATIONS_PLUGIN_URL."\";
                var smartDonationsSandbox=\"".SMART_DONATIONS_SANDBOX."\";
                var smartFormsAdditionalFields".(!isset($options['form_id'])?0:$options['form_id'])."=".json_encode($additionalFields).";
                var smartFormsDesignMode=false;
                if(!window.smartFormsItemsToLoad)
                    window.smartFormsItemsToLoad=new Array();                                                   
        ";

        $script.=$loadedForm;
        if($options==null)
            return "";

        $container="<div id='formContainer$random' class='sfForm rednaoFormContainer SfFormElementContainer bootstrap-wrapper'></div>";
        $useInlineScript=false;
        if($useInlineScript&&function_exists('wp_add_inline_script'))
        {
            wp_add_inline_script('smart-forms-generator',$script);
            return $container;
        }else
            return $container."<script>$script</script>";


    }

	return null;
}

function rednao_smart_forms_load_preview(){
    $previewPage=get_page_by_title("Smart Forms Page Preview","OBJECT","smartforms_preview");
    $page_id=0;
    if($previewPage==null)
    {
        $post = array(
            'post_content'   => '[sform]-1[/sform]',
            'post_name'      => 'Smart Forms Page Preview',
            'post_title'     => 'Smart Forms Page Preview',
            'post_status'    => 'draft',
            'post_type'      => 'smartforms_preview',
            'ping_status'    => 'closed',
            'comment_status' => 'closed'
        );
        $page_id = wp_insert_post( $post );
        wp_redirect( trailingslashit( site_url() ) . '?page_id='.$page_id.'&sfpreview=true');
    }else
        $page_id=$previewPage->ID;

    $url=get_permalink($page_id);

    if(strpos($url,'?')===false)
        $url.=$url.'?';

    $url.='?page_id='.$previewPage->ID.'&sfpreview=true';
        wp_redirect($url);

}