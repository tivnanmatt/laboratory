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



require_once(SMART_FORMS_DIR.'integration/smart-donations-integration-license-helper.php');
require_once(SMART_FORMS_DIR.'filter_listeners/fixed-field-listeners.php');
require_once(SMART_FORMS_DIR.'smart-forms-bootstrap.php');
require_once(SMART_FORMS_DIR.'additional_fields/smart-forms-additional-fields-list.php');

smart_forms_load_license_manager("");

wp_enqueue_script('jquery');
wp_enqueue_script('isolated-slider',SMART_FORMS_DIR_URL.'js/rednao-isolated-jq.js',array('jquery'));
wp_enqueue_script('rednap-fuelux',SMART_FORMS_DIR_URL.'js/utilities/fuelux/wizard.js',array('isolated-slider'));
wp_enqueue_script('velocity-async',SMART_FORMS_DIR_URL.'js/utilities/velocityAsync/velocityAsync.js',array('isolated-slider'));
wp_enqueue_media();

$formElementDependencies=array('isolated-slider','smart-forms-form-elements-container');
$formElementDependencies=apply_filters('smart_forms_add_form_elements_dependencies',$formElementDependencies);

wp_enqueue_script('smart-forms-event-slider',SMART_FORMS_DIR_URL.'js/utilities/bootstrap-slider/bootstrap-slider.min.js',array('isolated-slider'),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('smart-forms-promise',SMART_FORMS_DIR_URL.'js/utilities/es6-promise/dist/es6-promise.min.js',array(),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('smart-forms-event-manager',SMART_FORMS_DIR_URL.'js/formBuilder/eventmanager.js',array('isolated-slider'),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('smart-forms-tutorials',SMART_FORMS_DIR_URL. 'js/tutorials/rnTutorials.js',array('smart-forms-form-elements','isolated-slider','smart-forms-event-manager'),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('smart-forms-wizard-steps',SMART_FORMS_DIR_URL. 'js/utilities/popup-wizard/wizard-steps.js',array('smart-forms-form-elements','isolated-slider'),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('smart-forms-tinymce',SMART_FORMS_DIR_URL. 'js/utilities/tinymce/tinymce.min.js',array('smart-forms-form-elements','isolated-slider'),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('smart-forms-popup-wizard',SMART_FORMS_DIR_URL. 'js/utilities/popup-wizard/popup-wizard.js',array('smart-forms-wizard-steps'),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('smart-forms-redirect-to-wizard-steps',SMART_FORMS_DIR_URL. 'js/wizards/redirect-to-wizard-steps.js',array('smart-forms-popup-wizard'),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('smart-forms-paypal-to-wizard-steps',SMART_FORMS_DIR_URL. 'js/wizards/paypal-wizard-steps.js',array('smart-forms-popup-wizard'),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('smart-forms-enable-email-steps',SMART_FORMS_DIR_URL. 'js/wizards/email-enabled-wizard-steps.js',array('smart-forms-popup-wizard'),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('smart-forms-form-elements-container',SMART_FORMS_DIR_URL.'js/formBuilder/container/Container.js',array('isolated-slider'),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('smart-forms-form-elements-resizer',SMART_FORMS_DIR_URL.'js/formBuilder/container/ContainerResizer.js',array('isolated-slider'),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('smart-forms-form-elements-containerdes',SMART_FORMS_DIR_URL.'js/formBuilder/container/ContainerDesigner.js',array('isolated-slider','smart-forms-form-elements-resizer'),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('smart-forms-form-elements',SMART_FORMS_DIR_URL.'js/formBuilder/formelements.js',$formElementDependencies,SMART_FORMS_FILE_VERSION);
wp_enqueue_script('smart-forms-list-manager',SMART_FORMS_DIR_URL.'js/utilities/rnListManager.js',array('isolated-slider'),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('smart-forms-formula-window',SMART_FORMS_DIR_URL.'js/formBuilder/formula/formulawindow.js',array('isolated-slider','smart-forms-codemirror','smart-forms-codemirror-javascript','smart-forms-codemirror-autocomplete'),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('smart-forms-formula-custom-actions',SMART_FORMS_DIR_URL.'js/formBuilder/formula/customActions.js',array('isolated-slider'),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('smart-forms-formula-fixedvalues-actions',SMART_FORMS_DIR_URL.'js/formBuilder/formula/fixedValues.js',array('isolated-slider'),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('smart-forms-elements-manipulators',SMART_FORMS_DIR_URL.'js/formBuilder/properties/manipulators.js',array('isolated-slider'),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('smart-forms-formBuilder',SMART_FORMS_DIR_URL.'js/formBuilder/formbuilder.js',array(),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('smart-forms-dragmanager',SMART_FORMS_DIR_URL.'js/formBuilder/dragManager/dragmanager.js',array(),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('smart-forms-dragitembehaviors',SMART_FORMS_DIR_URL.'js/formBuilder/dragManager/dragitembehaviors.js',array(),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('smart-forms-condition-designer',SMART_FORMS_DIR_URL.'js/conditional_manager/condition-designer.js',array('isolated-slider'),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('smart-forms-conditional-handlers',SMART_FORMS_DIR_URL.'js/bundle/conditionalHandlers_bundle.js',array('isolated-slider'),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('smart-forms-conditional-manager',SMART_FORMS_DIR_URL.'js/bundle/conditionalManager_bundle.js',array('isolated-slider','smart-forms-conditional-handlers'),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('ismart-forms-add-new',SMART_FORMS_DIR_URL.'js/subscriber_interfaces/ismart-forms-add-new.js',array('smart-forms-event-manager','isolated-slider','smart-forms-tinymce','smart-forms-add-new-tutorial'),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('smart-forms-multiple-step-base',SMART_FORMS_DIR_URL.'js/multiple_steps/multiple_steps_base.js',array('isolated-slider'),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('smart-forms-multiple-step-designer',SMART_FORMS_DIR_URL.'js/multiple_steps/multiple_steps_designer.js',array('smart-forms-multiple-step-base'),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('smart-forms-codemirror',SMART_FORMS_DIR_URL.'js/utilities/codeMirror/codemirror.js',array(),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('smart-forms-codemirror-javascript',SMART_FORMS_DIR_URL.'js/utilities/codeMirror/mode/javascript/javascript.js',array(),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('smart-forms-codemirror-placeholder',SMART_FORMS_DIR_URL.'js/utilities/codeMirror/addon/display/placeholder.js',array('smart-forms-codemirror'),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('smart-forms-codemirror-hint',SMART_FORMS_DIR_URL.'js/utilities/codeMirror/addon/hint/show-hint.js',array('smart-forms-codemirror'),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('smart-forms-codemirror-autocomplete',SMART_FORMS_DIR_URL.'js/formBuilder/formula/autoComplete.js',array('smart-forms-codemirror-hint'),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('smart-forms-eslint',SMART_FORMS_DIR_URL.'js/utilities/codeMirror/addon/lint/eslint.min.js',array(),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('smart-forms-codemirror-eslint',SMART_FORMS_DIR_URL.'js/utilities/codeMirror/addon/lint/eslint-lint.js',array('smart-forms-eslint'),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('smart-forms-codemirror-lint',SMART_FORMS_DIR_URL.'js/utilities/codeMirror/addon/lint/lint.js',array('smart-forms-codemirror-javascript'),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('smart-forms-add-new-tutorial',SMART_FORMS_DIR_URL.'js/bundle/addnewtutorial_bundle.js',array('isolated-slider','smart-forms-promise'),SMART_FORMS_FILE_VERSION);





$additionalJS=apply_filters("sf_form_configuration_on_load_js",array());
$addNewDependencies= array('smart-forms-react-dom','smart-forms-react-core', 'smart-forms-add-new-tutorial','smart-forms-list-manager','ismart-forms-add-new','isolated-slider','smart-forms-formula-window','smart-forms-formBuilder','smart-forms-select2','smart-forms-event-manager','smart-forms-conditional-manager','smart-forms-systemjs-main-config');
for($i=0;$i<count($additionalJS);$i++){

    if(!isset($additionalJS[$i]['dependencies']))
        $additionalJS[$i]['dependencies']=array('ismart-forms-add-new','smart-forms-systemjs-main-config','smart-forms-event-manager');
	wp_enqueue_script($additionalJS[$i]["handler"],$additionalJS[$i]["path"],$additionalJS[$i]['dependencies']);
	array_push($addNewDependencies,$additionalJS[$i]["handler"]);
}

wp_enqueue_script('smart-forms-react-core',SMART_FORMS_DIR_URL.'js/utilities/react/react.js');
wp_enqueue_script('smart-forms-react-dom',SMART_FORMS_DIR_URL.'js/utilities/react/react-dom.js');

//p_enqueue_script('smart-forms-react',SMART_FORMS_DIR_URL.'js/dist/AddNew_bundle.js',array('isolated-slider','smart-forms-react-dom','smart-forms-react-core'),SMART_FORMS_FILE_VERSION);




wp_enqueue_script('smart-forms-select2',SMART_FORMS_DIR_URL.'js/utilities/select2/select2.js',array('isolated-slider'),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('smart-forms-spectrum',SMART_FORMS_DIR_URL.'js/utilities/spectrum/spectrum.js',array('isolated-slider'),SMART_FORMS_FILE_VERSION);




require_once(SMART_FORMS_DIR.'translations/form-elements-translation.php');


echo "<div class='bootstrap-wrapper' style='position: absolute;width:100%;'><div id='smart-forms-notification'></div></div>";

echo "<h1>".__("Forms")."</h1>";

$fieldsDependencies=array();
$additionalFields=apply_filters('smart_forms_af_names',$fieldsDependencies);
foreach($additionalFields as $field)
{
    do_action('smart_forms_af_'.$field['id']);
}



wp_enqueue_script('smart-forms-style-elements',SMART_FORMS_DIR_URL.'js/editors/style_editor/element-styler.js',array('isolated-slider','smart-forms-styler-set','smart-forms-style-properties'),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('smart-forms-style-editor',SMART_FORMS_DIR_URL.'js/editors/style_editor/style-editor.js',array('isolated-slider'),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('smart-forms-style-properties',SMART_FORMS_DIR_URL.'js/editors/style_editor/style-properties.js',array('isolated-slider'),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('smart-forms-styler-set',SMART_FORMS_DIR_URL.'js/editors/style_editor/styler-set.js',array('isolated-slider'),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('bootstrap-materialjs',SMART_FORMS_DIR_URL.'js/bootstrap/material.min.js',array('isolated-slider'),SMART_FORMS_FILE_VERSION);

wp_enqueue_script('json2');


wp_enqueue_script('smart-forms-formula',SMART_FORMS_DIR_URL.'js/formBuilder/formula/formula.js',array('isolated-slider'),SMART_FORMS_FILE_VERSION);
wp_enqueue_style('smart-forms-slider',SMART_FORMS_DIR_URL.'js/utilities/bootstrap-slider/bootstrap-slider.min.css',array(),SMART_FORMS_FILE_VERSION);
wp_enqueue_style('smart-forms-main-style',SMART_FORMS_DIR_URL.'css/mainStyle.css',array(),SMART_FORMS_FILE_VERSION);
wp_enqueue_style('smart-forms-main-spectrum',SMART_FORMS_DIR_URL.'js/utilities/spectrum/spectrum.css',array(),SMART_FORMS_FILE_VERSION);
wp_enqueue_style('smart-forms-Slider',SMART_FORMS_DIR_URL.'css/smartFormsSlider/jquery-ui-1.10.2.custom.min.css',array(),SMART_FORMS_FILE_VERSION);
wp_enqueue_style('form-builder-boot-strap',SMART_FORMS_DIR_URL.'css/formBuilder/bootstrap.min.css',array(),SMART_FORMS_FILE_VERSION);
wp_enqueue_style('form-builder-custom',SMART_FORMS_DIR_URL.'css/formBuilder/custom.css',array(),SMART_FORMS_FILE_VERSION);
wp_enqueue_style('form-builder-select2',SMART_FORMS_DIR_URL.'js/utilities/select2/select2.css',array(),SMART_FORMS_FILE_VERSION);
wp_enqueue_style('form-builder-fuelux',SMART_FORMS_DIR_URL.'js/utilities/fuelux/fuelux.css',array(),SMART_FORMS_FILE_VERSION);
wp_enqueue_style('smart-form-codemirror-style',SMART_FORMS_DIR_URL.'js/utilities/codeMirror/codemirror.css',array(),SMART_FORMS_FILE_VERSION);
wp_enqueue_style('smart-form-codemirror-showhint',SMART_FORMS_DIR_URL.'js/utilities/codeMirror/addon/hint/show-hint.css',array(),SMART_FORMS_FILE_VERSION);
wp_enqueue_style('smart-form-codemirror-lint-style',SMART_FORMS_DIR_URL.'js/utilities/codeMirror/addon/lint/lint.css',array(),SMART_FORMS_FILE_VERSION);



wp_enqueue_style('bootstrap-material',SMART_FORMS_DIR_URL.'css/bootstrap/bootstrap-material-scoped.css',array(),SMART_FORMS_FILE_VERSION);
do_action('smart_formsa_include_systemjs');
if(get_option("SMART_FORMS_REQUIRE_DB_DETAIL_GENERATION")=='y')
	wp_enqueue_script('smart-forms-detail-generator',SMART_FORMS_DIR_URL.'utilities/smart-forms-detail-generator.js',array('isolated-slider'),SMART_FORMS_FILE_VERSION);

$GDPR=get_option('SmartFormsEnableGDPR','n');

do_action('smart_forms_load_designer_scripts');


?>


<script type="text/javascript">
    var smartFormsDesignMode=true;
    var saveNonce=<?php echo json_encode(wp_create_nonce('save_nonce')); ?>;
    var SmartFormsEnableGDPR=<?php echo json_encode($GDPR)?>;
    var smartFormsShowTutorial=<?php echo json_encode(get_option('smart_forms_show_tutorial'))?>;
    var rntinyMCEPreInit={
        baseURL: smartFormsRootPath+'js/utilities/tinymce',
        suffix: ".min"
    };
	<?php

	$emailFixedFieldListeners=array();
	$emailFixedFieldListeners=apply_filters('smart-forms-get-email-fixed-field-listener',$emailFixedFieldListeners);
    echo "var smartFormsAdditionalFields0=".json_encode($additionalFields).";";
	echo "var smartFormsFixedFields=".json_encode($emailFixedFieldListeners).";";
	 ?>

    var smartFormsPreviewUrl=<?php echo json_encode(trim(site_url()).'?smartformspreview=1')?>;
    var smartForms_arrow_closed=<?php echo json_encode(SMART_FORMS_DIR_URL.'images/arrow_right.png')?>;
    var smartForms_arrow_open=<?php echo json_encode(SMART_FORMS_DIR_URL.'images/arrow_down.png')?>;
    var smartFormsPath=<?php echo json_encode(SMART_FORMS_DIR_URL)?>;
    var smartFormsRootPath=<?php echo json_encode(SMART_FORMS_DIR_URL)?>;
    var smartFormsEmailDoctorUrl=<?php echo json_encode(strval(menu_page_url('smart_forms_menu',false)))?>;

    <?php

        $customVars=array();
        $customVars=apply_filters('smart-forms-add-new-js-vars',$customVars);

        foreach($customVars as $var)
        {
            $value=json_decode($var["value"]);
            if($value==false)
                continue;


            echo "var ".esc_js($var["name"])." = ".json_encode($value).'; ';
        }



     ?>


</script>
<style type="text/css">
    .OpHidden{
        opacity: 0.0;
        filter: alpha(opacity=0);"
    }
</style>

<div style="position:fixed;top:0;left:0;overflow: auto;z-index: 999999;width:100%;height:100%;background-color: #efefef;" id="sfMainContainer">
    <div id="loadingScreen" style="background-color: white;width: 100%;height: 100%;top:0;left:0;z-index: 100000; position: absolute;text-align: center;">
        <div style="top:200px;position: absolute;width: 100%;text-align: center;" id="smartFormsLoadingLogo">
            <img  src="<?php echo esc_attr(SMART_FORMS_DIR_URL)?>images/ProgressBar2.gif" height="211;" alt="" />
            <label  style="font-size: 31px; line-height: 31px; font-family:Verdana, Geneva, sans-serif;padding:0;margin:0; display: block;">Loading important stuff, please wait a bit =)</label>
        </div>


    </div>

    <div id="rootContentDiv" class="OpHidden" style="height: 100%;">



        <div style="background: #fbfbfb;height: 100px;">
            <div style="text-align: left;height: 55px;" class="bootstrap-wrapper">

                    <table style="z-index: 10000;;position: fixed;top:50px;right:0px;height: calc(100% - 100px);display: none;" class="sfHelper">
                        <tr>
                            <td style="vertical-align: top">
                                <div style="background-color: white" class="sfHelpIconContainer" data-toggle="popover" data-placement="left" data-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus."  >
                                    <span title="Tutorials" style="font-size: 30px;" class="glyphicon glyphicon-question-sign"></span>
                                </div>
                            </td>
                            <td>
                                <div class="sfHelpContent" style="width:0px;" >
                                    <table>
                                        <tr>
                                            <td>
                                                <div class="redNaoControls col-sm-9 has-feedback-left" style="width:300px;margin:12px 10px 10px 10px;">
                                                    <input style="" id="tbHelpSearch" name="Search_f" type="text" placeholder="Search for specific topic" class="form-control redNaoInputText " value="">
                                                    <span class="sfPlaceHolderIcon glyphicon glyphicon-search form-control-feedback"></span>
                                                </div>
                                            </td>
                                            <td><button id="btnHelpSearch" class="btn btn-success">Search</button></td>
                                        </tr>
                                    </table>



                                    <div  style="clear:both;">

                                        <div style="margin:10px;display: none;" class="waitPanel">
                                            <div class="progress">
                                                <div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 100%">
                                                    <span><?php echo __("Loading tutorials") ?></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="list-group videoList" style="display: none;">
                                            <!-- <span class="list-group-item">Dapibus ac facilisis in</span>
                                           <a href="#" class="list-group-item">Morbi leo risus</a>
                                            <a href="#" class="list-group-item">Porta ac consectetur ac</a>
                                            <a href="#" class="list-group-item">Vestibulum at eros</a>-->
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </table>



                <div style="padding: 10px;display: flex;justify-content: space-between;align-items: center;">
                    <div style="display: inline-block;">
                        <button style="min-width:100px;cursor: hand;cursor: pointer;" class="btn btn-success ladda-button" id="smartFormsSaveButton"  data-style="expand-left" onclick="return false;" >
                            <span class="glyphicon glyphicon-floppy-disk"></span><span class="ladda-label"><?php echo __("Save") ?></span>
                        </button>

                        <button style="min-width:100px;cursor: hand;cursor: pointer;" class="btn btn-primary" id="smartFormsPreview">
                            <span class="glyphicon glyphicon-search"></span><span class="ladda-label"><?php echo __("Preview") ?></span>
                        </button>
                    </div>
                    <div style="display: inline-flex;flex-grow:1;align-items: center;margin:0 10px;">
                        <h4 style="margin:0 0 0 15px;display:inline-block">Editing: </h4>
                        <input id="smartFormName" style="width:400px;cursor: pointer;background-color:transparent;flex-grow: 1;" value="New Form"/>
                    </div>
                    <span onclick="location.href='<?php echo esc_url(admin_url())?>?page=smart_forms_menu'" id="ExitButton" title="Exit" class="fa fa-times" style="font-size: 30px;float: right;"></span>
                </div>
            </div>
            <div class="nav-tab-wrapper" id="smartFormsTopTab" style="display: flex;">
                <div style="flex-grow: 1">
                    <a style="cursor: hand;cursor: pointer;" class='nav-tab nav-tab-active' id="smartFormsGeneralTab"  onclick="SmartFormsAddNewVar.GoToGeneral();"><?php echo __("Builder") ?></a>
                    <a style="cursor: hand;cursor: pointer;" class='nav-tab' id="smartFormsSettingsTab"  onclick="SmartFormsAddNewVar.GoToSettings();"><?php echo __("Settings") ?></a>
                    <a style="cursor: hand;cursor: pointer;" class='nav-tab' id="smartFormsJavascriptTab" onclick="SmartFormsAddNewVar.GoToJavascript();"><?php echo __("Javascript") ?></a>
                    <a style="cursor: hand;cursor: pointer;" class='nav-tab' id="smartFormsCSSTab" onclick="SmartFormsAddNewVar.GoToCSS();"><?php echo __("CSS") ?></a>
                    <a style="cursor: hand;cursor: pointer;" class='nav-tab' id="smartFormsAfterSubmitTab" onclick="SmartFormsAddNewVar.GoToAfterSubmit();"><?php echo __("After Submit") ?></a>


                <?php
                    $tabs=array();
                    $tabs=apply_filters("sf_form_configuration_on_load_tabs",$tabs);
                    if($tabs==null)
                        $tabs=array();
                    for($i=0;$i<count($tabs);$i++)
                    {
                        echo '<a id="smartFormsCustom'.esc_attr($i).'Tab" data-tab-id="'.esc_attr($tabs[$i]["id"]).'" class="nav-tab sfcustomtab" onclick="SmartFormsAddNewVar.GoToCustomTab('.intval($i).');" >'.esc_html($tabs[$i]["name"]).'</a>';
                    }
                ?>

                <?php
                    if(has_smart_donations_license_and_is_active())
                    {
                        $addNewDependencies[]='smart-forms-donation-elements';
                        wp_enqueue_script('smart-forms-donation-elements',SMART_FORMS_DIR_URL.'js/integration/smart-donations-integration.js',array('smart-forms-form-elements'),SMART_FORMS_FILE_VERSION);
                        ?>
                        <a class='nav-tab' id="smartDonationsTab" onclick="SmartFormsAddNewVar.GoToSmartDonations();"><?php echo __("Smart Donations") ?></a>
                    <?php
                    }
                    if($GDPR=='y'){
                        ?>
                        <a class='nav-tab' id="gdprTab" onclick="SmartFormsAddNewVar.GoToGDPR();">GDPR</a>
                <?php
                    }
                ?>
                </div>

                <i class="fa fa-question-circle faqIcon" title="FAQ" aria-hidden="true"  style="margin-right:10px;font-size: 30px;"></i>
            </div>
        </div>
        <div id="redNaoGeneralInfo" style="height: calc(100% - 100px)">



            <!--
        <div id="redNaoEmailEditor" title="Email" style="display: none;">
            <table id="emailControls">
                <tr>
                    <td style="text-align: right">From email address</td><td> <select  multiple="multiple"  id="redNaoFromEmail" style="width:300px"></td>
                    <td rowspan="5">
                        <a target="_blank" style="color:red; margin-right: 10px;margin-top: 10px;cursor:hand;cursor:pointer;" id="sfNotReceivingEmail"><?php echo __("Not receiving the email? check the email doctor.") ?></a>
                        <div class="bootstrap-wrapper" style="height: 150px;overflow-y: scroll;width: 340px;">
                            <div id="emailList"></div>
                        </div>
                    </td>
                </tr>

                <tr>
                    <td style="text-align: right"><?php echo __("From name") ?></td><td> <input placeholder="Default (Wordpress)" type="text" id="redNaoFromName" style="width:300px"></td>
                </tr>

                <tr>
                    <td style="text-align: right"><?php echo __("Send to email address(es)") ?></td><td> <select multiple="multiple" id="redNaoToEmail" style="width:300px"></select></td>
                </tr>

                <tr>
                    <td style="text-align: right"><?php echo __("Email subject") ?></td><td> <input placeholder="Default (Form Submitted)" type="text" id="redNaoEmailSubject" style="width:300px"></td>
                </tr>
            </table>


            <div id="redNaoEmailEditorComponent">
            <div id="tinyMCEContainer" style="width:600px;float:left;">
                <button type="button" class="button" id="rnAddMedia"><span class="wp-media-buttons-icon"></span> Add Media</button>
                <textarea id="redNaoTinyMCEEditor"></textarea>
            </div>

            <div id="redNaoAccordion" class="smartFormsSlider" style="float:right;">
                <h3>Form Fields</h3>
                <div>
                    <ul id="redNaoEmailFormFields">

                    </ul>
                </div>
                <h3><?php //echo __("Fixed Values") ?></h3>
                <div>
                    <ul id="redNaoEmailFormFixedFields">

                    </ul>
                </div>
            </div>
            </div>
            <div style="text-align: right;clear: both;">
                <button onclick="RedNaoEmailEditorVar.CloseEmailEditor();"><?php echo __("Close") ?></button>
                <button onclick="SmartFormsAddNewVar.SendTestEmail();"><?php echo __("Send Test Email") ?></button>
            </div>
        </div>-->
        <div id="redNaoStyleEditor" title="<?php echo __("Style Editor")?>" style="display: none;margin:0;padding:0;">
            <table style="width: 100%;height: 100%;">

                <tr>
                    <td style="width: 550px;">
                        <div id="styleEditorPreview" class="rednaoFormContainer bootstrap-wrapper" style="width: 100%;height: 100%;">
                            <table style="width: 100%;height: 100%;">
                                <tr>
                                    <td style="vertical-align: middle;" id="smartFormStyleEditorContainer">

                                    </td>
                                </tr>
                            </table>
                        </div>
                    </td>
                    <td>
                        <div style="width: 100%;height: 100%;" class="bootstrap-wrapper">
                            <div style="text-align: right" class="rnEditorContainer">
                                <label><?php echo __("Apply to:") ?></label>
                                <select  id="rnStyleApplyTo">
                                    <option value="1"><?php echo __("This field") ?></option>
                                    <option id="allOfTypeOption" value="2"><?php echo __("All fields of the same type") ?></option>
                                    <option value="3"><?php echo __("All fields") ?></option>
                                </select>
                            </div>


                            <ul class="nav nav-tabs rnEditorContainer" >
                                <li role="presentation" class="active"><a id="rnStyleEditorAttribute" href="#styleEditorAttributes" data-toggle="tab"><?php echo __("Styles") ?></a></li>
                                <li role="presentation"><a href="#styleCustomRules" data-toggle="tab"><?php echo __("Custom CSS (Advanced)") ?></a></li>
                            </ul>
                            <div class="tab-content">
                                <div class="tab-pane active" id="styleEditorAttributes" >
                                </div>
                                <div class="tab-pane" id="styleCustomRules" >
                                    <textarea style="width: 100%;height: 555px;" id="rnCustomStyleContent" placeholder="<?php echo __("Here you can put only style rules") ?> (<?php echo __("e.g.") ?> background-color:red;), <?php echo __("not selectors") ?> (<?php echo __("e.g.") ?> .mybutton{background-color:red;}.
        <?php echo __("If you want to add your own selectors and rules please add them in the CSS tab of your form.") ?>
        <?php echo __("Tip:If your rule is not working try adding !important (e.g. background-color:red !important;)") ?>"></textarea>
                                    <button id="rnApplyCustomRule" style="margin-left: auto;display: block;"><?php echo __("Apply Custom Rules") ?></button>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            </table>

        </div>


        <div id="smartFormsJavascriptDiv" class="bootstrap-wrapper" style="display: none;padding: 10px;height: 100%;background-color:#6b6b6b;padding:10px;">
            <table style="width:100%;">
                <tr>
                    <td style="width:80%;">
                        <textarea id="smartFormsJavascriptText" class="form-control" disabled="disabled"></textarea>
                        <button onclick="SmartFormsAddNewVar.Validate()"><?php echo __("Validate") ?></button>
                        <button onclick="SmartFormsAddNewVar.RestoreDefault()"><?php echo __("Restore default") ?></button>
                    </td>
                    <td style="width:20%;vertical-align: top;">
                        <div id="javascriptList"></div>
                    </td>
                </tr>
            </table>


        </div>

        <?php
            for($i=0; $i<count($tabs);$i++)
            {
                echo "<div style='display:none;height: 100%;background-color:#6b6b6b;' class='smartFormsCustomTab'  id='smartFormsCustom".$i."Div'><div style='width:100%;padding:10px;background-color: white;'>";                 echo wp_kses($tabs[$i]["content"],array(
                        'style'=>array(
                          'type'=>true
                        ),
                        'option'=>array(
                            'value'=>true,
                            'name'=>true,
                            'class'=>true,
                            'style'=>true,
                            'type'=>true,
                            'id'=>true
                        ),
                        'select'=>array(
                            'name'=>true,
                            'class'=>true,
                            'style'=>true,
                            'type'=>true,
                            'id'=>true,
                            'value'=>true
                        ),
                        'input'=>array(
                           'name'=>true,
                           'class'=>true,
                          'style'=>true,
                          'type'=>true,
                          'id'=>true,
                           'value'=>true
                        ),
                        'address'    => array(),
                        'a'          => array(
                            'class'=>true,
                            'id'=>true,
                            'style'=>true,
                            'href'     => true,
                            'rel'      => true,
                            'rev'      => true,
                            'name'     => true,
                            'target'   => true,
                            'download' => array(
                                'valueless' => 'y',
                            ),
                        ),
                        'abbr'       => array(),
                        'acronym'    => array(),
                        'area'       => array(
                            'alt'    => true,
                            'coords' => true,
                            'href'   => true,
                            'nohref' => true,
                            'shape'  => true,
                            'target' => true,
                        ),
                        'article'    => array(
                            'align'    => true,
                            'dir'      => true,
                            'lang'     => true,
                            'xml:lang' => true,
                        ),
                        'aside'      => array(
                            'align'    => true,
                            'dir'      => true,
                            'lang'     => true,
                            'xml:lang' => true,
                        ),
                        'audio'      => array(
                            'autoplay' => true,
                            'controls' => true,
                            'loop'     => true,
                            'muted'    => true,
                            'preload'  => true,
                            'src'      => true,
                        ),
                        'b'          => array(),
                        'bdo'        => array(
                            'dir' => true,
                        ),
                        'big'        => array(),
                        'blockquote' => array(
                            'cite'     => true,
                            'lang'     => true,
                            'xml:lang' => true,
                        ),
                        'br'         => array(),
                        'button'     => array(
                            'class'=>true,
                            'id'=>true,
                            'style'=>true,
                            'disabled' => true,
                            'name'     => true,
                            'type'     => true,
                            'value'    => true,
                        ),
                        'caption'    => array(
                            'align' => true,
                        ),
                        'cite'       => array(
                            'dir'  => true,
                            'lang' => true,
                        ),
                        'code'       => array(),
                        'col'        => array(
                            'align'   => true,
                            'char'    => true,
                            'charoff' => true,
                            'span'    => true,
                            'dir'     => true,
                            'valign'  => true,
                            'width'   => true,
                        ),
                        'colgroup'   => array(
                            'align'   => true,
                            'char'    => true,
                            'charoff' => true,
                            'span'    => true,
                            'valign'  => true,
                            'width'   => true,
                        ),
                        'del'        => array(
                            'datetime' => true,
                        ),
                        'dd'         => array(),
                        'dfn'        => array(),
                        'details'    => array(
                            'align'    => true,
                            'dir'      => true,
                            'lang'     => true,
                            'open'     => true,
                            'xml:lang' => true,
                        ),
                        'div'        => array(
                            'class'=>true,
                            'id'=>true,
                            'style'=>true,
                            'align'    => true,
                            'dir'      => true,
                            'lang'     => true,
                            'xml:lang' => true,
                        ),
                        'dl'         => array(),
                        'dt'         => array(),
                        'em'         => array(),
                        'fieldset'   => array(),
                        'figure'     => array(
                            'align'    => true,
                            'dir'      => true,
                            'lang'     => true,
                            'xml:lang' => true,
                        ),
                        'figcaption' => array(
                            'align'    => true,
                            'dir'      => true,
                            'lang'     => true,
                            'xml:lang' => true,
                        ),
                        'font'       => array(
                            'color' => true,
                            'face'  => true,
                            'size'  => true,
                        ),
                        'footer'     => array(
                            'align'    => true,
                            'dir'      => true,
                            'lang'     => true,
                            'xml:lang' => true,
                        ),
                        'h1'         => array(
                            'align' => true,
                        ),
                        'h2'         => array(
                            'align' => true,
                        ),
                        'h3'         => array(
                            'align' => true,
                        ),
                        'h4'         => array(
                            'align' => true,
                        ),
                        'h5'         => array(
                            'align' => true,
                        ),
                        'h6'         => array(
                            'align' => true,
                        ),
                        'header'     => array(
                            'align'    => true,
                            'dir'      => true,
                            'lang'     => true,
                            'xml:lang' => true,
                        ),
                        'hgroup'     => array(
                            'align'    => true,
                            'dir'      => true,
                            'lang'     => true,
                            'xml:lang' => true,
                        ),
                        'hr'         => array(
                            'align'   => true,
                            'noshade' => true,
                            'size'    => true,
                            'width'   => true,
                        ),
                        'i'          => array(),
                        'img'        => array(
                            'alt'      => true,
                            'align'    => true,
                            'border'   => true,
                            'height'   => true,
                            'hspace'   => true,
                            'loading'  => true,
                            'longdesc' => true,
                            'vspace'   => true,
                            'src'      => true,
                            'usemap'   => true,
                            'width'    => true,
                        ),
                        'ins'        => array(
                            'datetime' => true,
                            'cite'     => true,
                        ),
                        'kbd'        => array(),
                        'label'      => array(
                                'id'=>true,
                            'style'=>true,
                            'class'=>true,
                            'for' => true,
                        ),
                        'legend'     => array(
                            'align' => true,
                        ),
                        'li'         => array(
                            'align' => true,
                            'value' => true,
                        ),
                        'main'       => array(
                            'align'    => true,
                            'dir'      => true,
                            'lang'     => true,
                            'xml:lang' => true,
                        ),
                        'map'        => array(
                            'name' => true,
                        ),
                        'mark'       => array(),
                        'menu'       => array(
                            'type' => true,
                        ),
                        'nav'        => array(
                            'align'    => true,
                            'dir'      => true,
                            'lang'     => true,
                            'xml:lang' => true,
                        ),
                        'object'     => array(
                            'data' => array(
                                'required'       => true,
                                'value_callback' => '_wp_kses_allow_pdf_objects',
                            ),
                            'type' => array(
                                'required' => true,
                                'values'   => array( 'application/pdf' ),
                            ),
                        ),
                        'p'          => array(
                            'align'    => true,
                            'dir'      => true,
                            'lang'     => true,
                            'xml:lang' => true,
                        ),
                        'pre'        => array(
                            'width' => true,
                        ),
                        'q'          => array(
                            'cite' => true,
                        ),
                        's'          => array(),
                        'samp'       => array(),
                        'span'       => array(
                            'dir'      => true,
                            'align'    => true,
                            'lang'     => true,
                            'xml:lang' => true,
                        ),
                        'section'    => array(
                            'align'    => true,
                            'dir'      => true,
                            'lang'     => true,
                            'xml:lang' => true,
                        ),
                        'small'      => array(),
                        'strike'     => array(),
                        'strong'     => array(),
                        'sub'        => array(),
                        'summary'    => array(
                            'align'    => true,
                            'dir'      => true,
                            'lang'     => true,
                            'xml:lang' => true,
                        ),
                        'sup'        => array(),
                        'table'      => array(
                            'align'       => true,
                            'bgcolor'     => true,
                            'border'      => true,
                            'cellpadding' => true,
                            'cellspacing' => true,
                            'dir'         => true,
                            'rules'       => true,
                            'summary'     => true,
                            'width'       => true,
                        ),
                        'tbody'      => array(
                            'align'   => true,
                            'char'    => true,
                            'charoff' => true,
                            'valign'  => true,
                        ),
                        'td'         => array(
                            'abbr'    => true,
                            'align'   => true,
                            'axis'    => true,
                            'bgcolor' => true,
                            'char'    => true,
                            'charoff' => true,
                            'colspan' => true,
                            'dir'     => true,
                            'headers' => true,
                            'height'  => true,
                            'nowrap'  => true,
                            'rowspan' => true,
                            'scope'   => true,
                            'valign'  => true,
                            'width'   => true,
                        ),
                        'textarea'   => array(
                            'cols'     => true,
                            'rows'     => true,
                            'disabled' => true,
                            'name'     => true,
                            'readonly' => true,
                        ),
                        'tfoot'      => array(
                            'align'   => true,
                            'char'    => true,
                            'charoff' => true,
                            'valign'  => true,
                        ),
                        'th'         => array(
                            'abbr'    => true,
                            'align'   => true,
                            'axis'    => true,
                            'bgcolor' => true,
                            'char'    => true,
                            'charoff' => true,
                            'colspan' => true,
                            'headers' => true,
                            'height'  => true,
                            'nowrap'  => true,
                            'rowspan' => true,
                            'scope'   => true,
                            'valign'  => true,
                            'width'   => true,
                        ),
                        'thead'      => array(
                            'align'   => true,
                            'char'    => true,
                            'charoff' => true,
                            'valign'  => true,
                        ),
                        'title'      => array(),
                        'tr'         => array(
                            'align'   => true,
                            'bgcolor' => true,
                            'char'    => true,
                            'charoff' => true,
                            'valign'  => true,
                        ),
                        'track'      => array(
                            'default' => true,
                            'kind'    => true,
                            'label'   => true,
                            'src'     => true,
                            'srclang' => true,
                        ),
                        'tt'         => array(),
                        'u'          => array(),
                        'ul'         => array(
                            'type' => true,
                        ),
                        'ol'         => array(
                            'start'    => true,
                            'type'     => true,
                            'reversed' => true,
                        ),
                        'var'        => array(),
                        'video'      => array(
                            'autoplay'    => true,
                            'controls'    => true,
                            'height'      => true,
                            'loop'        => true,
                            'muted'       => true,
                            'playsinline' => true,
                            'poster'      => true,
                            'preload'     => true,
                            'src'         => true,
                            'width'       => true,
                        ),
                    ));
                echo "</div></div>";
            }
        ?>



        <div id="smartDonationsDiv" style="display: none;height: 100%;background-color:#6b6b6b;padding:10px;">
            <table style="width: 100%;background-color: white;">
                <tr>
                    <td style="text-align: right;width: 200px;"><?php echo __("Campaign") ?></td><td>
                        <select id="redNaoCampaign"></select></td>
                </tr>
                <tr >
                    <td style="text-align: right" ><span class="smartDonationsConfigurationInfo"><?php echo __("PayPal email") ?></span></td><td class="smartDonationsConfigurationInfo"> <input type="text" id="smartDonationsEmail" />  <span  class="description smartDonationsConfigurationInfoDesc" style="margin-bottom:5px;display: inline;"> <?php echo __("*The email of your paypal account"); ?></span></td>
                </tr>
                <tr >
                    <td style="text-align: right" ><span class="smartDonationsConfigurationInfo"><?php echo __("Type") ?></span></td><td class="smartDonationsConfigurationInfo">
                        <select id="redNaoPaypalType">
                            <option value="payment">Payment</option>
                            <option value="donation" selected="selected">Donation</option>
                        </select>

                    </td>
                </tr>
                <tr >
                    <td style="text-align: right"><span class="smartDonationsConfigurationInfo"><?php echo __("Donation/Payment description") ?></span></td><td class="smartDonationsConfigurationInfo"> <input type="text" id="smartDonationsDescription"/><span class="description smartDonationsConfigurationInfoDesc" style="margin-bottom:5px;display: inline;"> <?php echo __("*This description is going to be shown in the Paypal transaction page "); ?><a href="<?php echo SMART_FORMS_DIR_URL?>images/paypal_transaction_page.png" target="_blank"><?php echo __("(Screenshot)")?></a></span></td>
                </tr>



                <tr >
                    <td style="text-align: right"><span class="smartDonationsConfigurationInfo"><?php echo __("Currency") ?></span></td><td> <select class="smartDonationsConfigurationInfo" id="smartDonationsCurrencyDropDown" name="donation_currency"></select></td>
                </tr>


                <tr >
               <?php /*     <td style="text-align: right"><span class="smartDonationsConfigurationInfo">Send thank you email</span></td><td class="smartDonationsConfigurationInfo"> <input  type="checkbox" id="redNaoSendThankYouEmail" ><span  class="description smartDonationsConfigurationInfoDesc" style="margin-bottom:5px;display: inline;"> <?php echo __("*If you check this box the thank you email is going to be send to the donators "); ?> <a href="<?php echo SMART_FORMS_DIR_URL?>images/campaign.png" target="_blank"><?php echo __("(Screenshot)")?></a></span></td> */?>
                </tr>
                <tr>
                    <td>
                    </td>
                    <td class="bootstrap-wrapper">
                        <button style="display: inline;" class="smartDonationsConfigurationInfo" id="setUpDonationFormulaButton"><?php echo __("Setup donation formula") ?></button>
                        <span  class="addConditionLogic glyphicon glyphicon glyphicon-link sfConditionLogicPayPal" style="cursor: pointer; cursor:hand;margin-left:5px;display: inline;"></span>
                    </td>
                </tr>


            </table>
        </div>
        <div id="gdprDiv" style="display: none" class="bootstrap-wrapper">
            <table style="max-width: 700px; margin-top:10px;" class="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>Activate</th>
                        <th>Action</th>
                    </tr>
                    <tr>

                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="text-align: center;">
                            <input style="margin:0;" type="checkbox" id="smartFormsDisableDBStorage"/>
                        </td>
                        <td>
                            <label style="margin:0;font-weight: normal" for="smartFormsDisableDBStorage">Do not save the entry in the database (you still can receive all the form information in your email)</label>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: center;">
                            <input style="margin:0;" type="checkbox" id="smartFormsDisableIPStorage"/>
                        </td>
                        <td>
                            <label style="margin:0;font-weight: normal" for="smartFormsDisableIPStorage">Do not save user's device information (like IP address)</label>
                        </td>
                    </tr>

                </tbody>
            </table>
        </div>


            <div id="smartFormsAfterSubmitDiv" class="bootstrap-wrapper" style="display: none;border:none;width:auto;padding:10px;height: 100%;background-color:#6b6b6b;padding:10px;" >
                <table class="table table-bordered table-striped" style="background-color: white;">
                    <thead>
                        <tr>
                            <th><?php echo __("Activate") ?></th>
                            <th><?php echo __("Action") ?></th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr class="sfAfterSubmitAction">
                            <td style="text-align: center"> <input type="checkbox" checked="checked"  id="smartFormsSendNotificationEmail"/></td>
                            <td>
                                <span><?php echo __("Send notification email"); ?></span>
                                <button id="redNaoEditEmailButton" class="btn btn-default" disabled="disabled"><?php echo __("Edit Email"); ?></button>
                            </td>
                        </tr>

                        <tr class="sfAfterSubmitAction">
                            <td style="text-align: center"><input  type="checkbox"   id="redNaoRedirectToCB"/></td>
                            <td>
                                <span ><?php echo __("Redirect to"); ?></span>
                                <table id="redirectToOptionsItems">

                                </table>


                            </td>
                        </tr>

                        <tr class="sfAfterSubmitAction">
                            <td style="text-align: center"><input style="vertical-align: top"  type="checkbox"  id="redNaoAlertMessageCB"/></td>
                            <td>
                                <span style="vertical-align: top"><?php echo __("Show alert message"); ?></span>
                                <textarea style="width:250px;height: 70px;" id="alertMessageInput" disabled="disabled" ></textarea>
                            </td>
                        </tr>

                        <tr class="sfAfterSubmitAction">
                            <td style="text-align: center"><input style="vertical-align: top"  type="checkbox"  id="rednaoDontClearForm"/></td>
                            <td>
                                <span style="vertical-align: top"><?php echo __("Don't clear the form after submission."); ?></span>
                            </td>
                        </tr>


                    </tbody>
                </table>
            </div>




        <div id="smartFormsCSSDiv" style="display: none;padding: 10px;height: 100%;background-color:#6b6b6b;padding:10px;" class="form-horizontal bootstrap-wrapper">

            <textarea id="smartFormsCSSText" placeholder="<?php echo __("You can put your custom css rules here, example:") ?>
        button{
            background-color:red;
        }
        <?php echo __("TIP: if the rule is not working try adding") ?> !important, <?php echo __("e.g.") ?> background-color:red !important;
        "></textarea>
            <button id="sfApplyCss">Apply</button>

        </div>


        <div id="smartFormsSettingsDiv" style="display: none;height: 100%;background-color:#6b6b6b;padding:10px;" class="bootstrap-wrapper">
            <div id="rednaoSmartForms" class="bootstrap-wrapper">

                <input type="hidden" id="smartFormsId" value=""/>


                <div  id="smartFormsBasicDetail" class="tab-content" style="background-color: white;">
                    <div class="tab-pane active">
                        <table class="table table-bordered table-striped">
                            <tbody>


                            <tr>
                                <td>
                                    <span><?php echo __("Description"); ?></span>
                                    <span style="margin-left: 2px;cursor:hand;cursor:pointer;" data-toggle="tooltip" data-placement="right" title="" class="glyphicon glyphicon-question-sign" data-original-title="<?php echo __("The form description, this is displayed in the form list") ?>"></span>
                                </td>
                                <td>
                                    <input type="text"  id="smartFormDescription" style="width: 400px;display: inline-block;" class="form-control"/>

                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <div style="width: 200px;display: inline;">
                                        <div style="display: inline-block" class="sfLabelLayoutContainer">
                                            <span><?php echo __("Labels Layout"); ?></span>

                                            <span class="sfLabelLayout glyphicon glyphicon-question-sign"style="margin-left: 2px;cursor:hand;cursor:pointer;" data-toggle="tooltip" data-placement="right" title="" class="glyphicon glyphicon-question-sign" data-original-title="<?php echo __("<strong>Left</strong>:Always in the left of the field")."<img src='".SMART_FORMS_DIR_URL."images/labelsLeft.png'/>"."\r\n".__("<strong>Top</strong>: Labels always in the top of the field.")."<img src='".SMART_FORMS_DIR_URL."images/labelsTop.png'/>\r\n".__("<strong>Auto</strong>:If enough space put labels on the left, otherwise on the top.")."<img src='".SMART_FORMS_DIR_URL?>images/labelsAuto.gif'/>"  ?></span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <select class="form-control rnLabelLayout" style="margin-right: 5px;width: 200px;display: inline;">
                                        <option  value="auto"><?php echo __("Auto"); ?></option>
                                        <option selected="selected" value="top"><?php echo __("Top"); ?></option>
                                        <option value="left"><?php echo __("left"); ?></option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div style="width: 200px;display: inline;">
                                        <span><?php echo __("Theme"); ?></span>

                                    </div>
                                </td>
                                <td>
                                    <select class="form-control rnTheme" style="margin-right: 5px;width: 200px;display: inline;">
                                        <option selected="selected" value="basic"><?php echo __("Basic"); ?></option>
                                        <option value="material"><?php echo __("Material"); ?></option>
                                    </select>
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <span><?php echo __("Invalid field message"); ?></span>
                                    <span style="margin-left: 2px;cursor:hand;cursor:pointer;" data-toggle="tooltip" data-placement="right" title="" class="glyphicon glyphicon-question-sign" data-original-title="<?php echo __("The message that is displayed when a required field is empty"); ?>"></span>
                                </td>
                                <td>
                                    <input style="width: 400px;display: inline-block;" class="form-control" type="text"  id="smartFormsInvalidFieldMessage" value="*Please fill all the required fields"/>

                                    <div style="display: inline-block;">
                                        <span class="sfToolTipPosition" style="display: none;margin-left: 10px;"><?php echo __("Position") ?></span>
                                        <span class="sfToolTipPosition glyphicon glyphicon-question-sign"style="display: none; margin-left: 2px;cursor:hand;cursor:pointer;" data-toggle="tooltip" data-placement="right" title="" class="glyphicon glyphicon-question-sign" data-original-title="<?php echo __("The invalid message is displayed in a tooltip, select the position of the tooltip") ?>"></span>
                                        <div class="sfToolTipPosition" style="display: none;" role="toolbar" id="tooltipPositionList">
                                            <button id="toolTipPosition_none" type="button"  style="outline: invert none medium;" title="<?php echo __("Don't display tooltip") ?>" class="btn btn-default"><span class="glyphicon glyphicon-remove-sign"></span></button>
                                            <button id="toolTipPosition_left" type="button" style="outline: invert none medium;" title="<?php echo __("Left") ?>" class="btn btn-default"><span class="glyphicon glyphicon-hand-left"></span></button>
                                            <button id="toolTipPosition_top" type="button"  style="outline: invert none medium;" title="<?php echo __("Up") ?>" class="btn btn-default"><span class="glyphicon glyphicon-hand-up"></span></button>
                                            <button id="toolTipPosition_right" type="button" style="outline: invert none medium;" title="<?php echo __("Right") ?>" class="btn btn-default"><span class="glyphicon glyphicon-hand-right"></span></button>
                                            <button id="toolTipPosition_bottom" type="button" style="outline: invert none medium;" title="<?php echo __("Down") ?>" class="btn btn-default"><span class="glyphicon glyphicon-hand-down"></span></button>
                                        </div>
                                    </div>

                                </td>
                            </tr>



                            <tr>
                                <td>
                                    <span><?php echo __("Form Type"); ?></span>
                                    <span style="margin-left: 2px;cursor:hand;cursor:pointer;" data-toggle="tooltip" data-placement="right" title="" class="glyphicon glyphicon-question-sign" data-original-title="Normal: The normal form <br>Multiple Steps: A form that is divided in multiple sections, perfect for big forms"></span>
                                </td>
                                <td>
                                    <div>
                                        <select id="rnFormType" class="form-control" style="width: 400px;display: inline-block;">
                                            <option value="nor">Normal</option>
                                            <option value="sec"><?php echo __("Multiple Steps Form (pro)") ?></option>
                                        </select>
                                    </div>
                                    <div style="width:100px;float:left;display: none;" class="msfText" >
                                        <span>Previous</span><input type="text" class="form-control" id="prevText"/>
                                    </div>
                                    <div style="width:100px;float:left;display: none;" class="msfText" >
                                        <span>Next</span><input type="text" class="form-control" id="nextText"/>
                                    </div>
                                    <div style="width:100px;float:left;display: none;" class="msfText" >
                                        <span><?php echo __("Complete")?></span><input type="text" class="form-control"  id="completeText"/>
                                    </div>

                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>


                <br/>
            </div>
        </div>

        <div id="smartFormsGeneralDiv" style="height: 100%;">
        <form  style="height: 100%;">
        <!--

                <div class="treeDiv" id="smartDonationsAdvanced">
                    <img class="treeButton" src="<?php echo plugin_dir_url(__FILE__)?>images/arrow_right.png" alt=""/>
                    <h2 class="treeTitle">Advanced Options</h2>
                </div>
                <div  id="smartDonationsAdvancedDetail">
                    <hr/>
                    <div class="category" >
                        <span>Currency</span>
                        <select id="smartDonationsCurrencyDropDown" name="donation_currency"></select>
                        <span class="description">*the selected currency for the donation</span>
                        <br/>
                        <span>Returning Url</span>
                        <input type="text" id="smartDonationsReturningUrl"/>
                        <span class="description">*Page displayed after he does a donation</span>
                        <br/>
                        <span>Donation Description</span>
                        <input type="text" id="smartDonationsDonationDescription"/>
                        <span class="description">*This text is going to be shown in the paypal invoice</span>
                    </div>


                </div>-->


            <div id="redNaoFormBackground" class="bootstrap-wrapper" style="height: 100%;">
                <div class="rednaoformbuilder container rednaoFormContainer" style="margin:0;width:100%;height: 100%;">

                    <div style="border-collapse: collapse;background-color: #efefef;width: 100%;height: 100%;">


                        <div style=" vertical-align: top;max-width: 570px;display: inline-block;width: 570px;height: 100%;height:100%;overflow: auto;">
                            <div id="formSettingsScrollArea" style="height: 100%;box-sizing: border-box;display: block;">
                                <div id="formSettings" style="height: 100%;overflow: auto;display: flex;flex-direction: column;">
                                    <ul class="nav nav-tabs" id="sfSettingTabs" role="tablist" style="margin: 0">
                                        <li class="active"><a style="cursor:pointer" id="formRadio1"
                                                              href="#formBuilderComponents" data-toggle="tab"><span
                                                        class="glyphicon glyphicon-list-alt"></span><?php echo __("Fields") ?>
                                            </a></li>
                                        <li><a style="cursor:pointer" id="formRadio2" href="#formPropertiesContainer"
                                               data-toggle="tab"><span
                                                        class="glyphicon glyphicon glyphicon-cog"></span><?php echo __("Field Settings") ?>
                                            </a></li>
                                        <li><a style="cursor:pointer" id="formRadio4" href="#formStylesContainer"
                                               data-toggle="tab"><span
                                                        class="fa fa-paint-brush"></span><?php echo __("Styles") ?></a>
                                        </li>
                                        <li><a style="cursor:pointer" id="formRadio3"
                                               href="#formConditionalLogicContainer" data-toggle="tab"><span
                                                        class="glyphicon glyphicon glyphicon-link"></span><?php echo __("Conditional Logic") ?>
                                            </a></li>
                                    </ul>
                                    <!--
                                    <div id="formBuilderButtonSet" class="smartFormsSlider">
                                        <input type="radio" id="formRadio1" value="Fields"  name="smartFormsFormEditStyle"  checked="checked" style="display:inline-block;"/><label style="margin:0;width:150px;display:inline-block;" for="formRadio1"><?php echo __("Fields") ?></label>
                                        <input type="radio" id="formRadio2"  value="Settings" name="smartFormsFormEditStyle" style="display:inline-block;"/><label style="width:150px;margin: 0 0 0 -5px;display:inline-block;" for="formRadio2"><?php echo __("Field Settings") ?></label>
                                        <input type="radio" id="formRadio3"  value="ConditionalLogic" name="smartFormsFormEditStyle" style="display:inline-block;"/><label style="width:170px;margin: 0 0 0 -5px;display:inline-block;" for="formRadio3"><?php echo __("Conditional Logic") ?></label>
                                    </div>-->

                                    <div id="formBuilderContainer" class="tab-content" style="overflow: auto">


                                        <div class="span6 tab-pane active" id="formBuilderComponents">
                                            <h2 class="redNaoFormContainerHeading"><?php echo __("Fields List") ?></h2>
                                            <hr>
                                            <div class="tabbable">
                                                <ul class="nav nav-tabs" id="navtab">
                                                    <li><a id="alayout" class="formtab"><?php echo __("Layout") ?></a>
                                                    </li>
                                                    <li><a id="atabinput"
                                                           class="formtab selectedTab"><?php echo __("Basic Input") ?></a>
                                                    </li>
                                                    <li><a id="atabselect"
                                                           class="formtab"><?php echo __("Advanced") ?></a></li>
                                                    <li><a id="atabradioscheckboxes"
                                                           class="formtab"><?php echo __("Multiple Choices") ?></a></li>


                                                    <li><a id="atabbuttons"
                                                           class="formtab" <?php echo(has_smart_donations_license_and_is_active() ? "" : 'style="display: none"'); ?> ><?php echo __("Paypal") ?></a>
                                                    </li>
                                                    <li><a id="atabpro" class="formtab"><?php echo __("Pro") ?></a></li>
                                                </ul>
                                                <div class="form-horizontal" id="components">
                                                    <fieldset>
                                                        <div class="tab-content">
                                                            <div class="tab-pane active rednaotablist smartFormFieldTabLayout"
                                                                 id="layout" style="display: none;width:100%;">
                                                                <div class="component">
                                                                    <div class="control-group rednaotitle">
                                                                    </div>
                                                                </div>
                                                                <div class="component">
                                                                    <div class="control-group rednaolineseparator">
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="tab-pane active rednaotablist smartFormFieldTabBasic"
                                                                 id="tabinput">
                                                                <div class="component">
                                                                    <div class="control-group rednaotextinput">
                                                                    </div>
                                                                </div>
                                                                <div class="component">
                                                                    <div class="control-group rednaoprependedtext">
                                                                    </div>
                                                                </div>
                                                                <div class="component">
                                                                    <div class="control-group rednaoappendedtext">
                                                                    </div>
                                                                </div>
                                                                <div class="component">
                                                                    <div class="control-group rednaoprependedcheckbox">
                                                                    </div>
                                                                </div>
                                                                <div class="component">
                                                                    <div class="control-group rednaoappendedcheckbox">
                                                                    </div>
                                                                </div>
                                                                <div class="component">
                                                                    <div class="control-group rednaotextarea">
                                                                    </div>
                                                                </div>

                                                                <div class="component">
                                                                    <div class="control-group rednaodatepicker">
                                                                    </div>
                                                                </div>

                                                                <div class="component rednaosubmitbuttoncontainer">
                                                                    <div class="control-group rednaosubmissionbutton">
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div class="tab-pane rednaotablist smartFormFieldTabAdvanced"
                                                                 id="tabselect" style="display: none;">
                                                                <div class="component">
                                                                    <div class="control-group rednaoname">
                                                                    </div>
                                                                </div>
                                                                <div class="component">
                                                                    <div class="control-group rednaophone">
                                                                    </div>
                                                                </div>
                                                                <div class="component">
                                                                    <div class="control-group rednaoemail">
                                                                    </div>
                                                                </div>
                                                                <div class="component">
                                                                    <div class="control-group rednaonumber">
                                                                    </div>
                                                                </div>

                                                                <div class="component">
                                                                    <div class="control-group rednaoaddress">
                                                                    </div>
                                                                </div>

                                                                <div class="component">
                                                                    <div class="control-group rednaohtml">
                                                                    </div>
                                                                </div>

                                                            </div>
                                                            <div class="tab-pane rednaotablist smartFormFieldTabMultiple"
                                                                 id="tabradioscheckboxes" style="display: none;">
                                                                <div class="component">
                                                                    <div class="control-group rednaomultipleradios"></div>
                                                                </div>

                                                                <div class="component">
                                                                    <div class="control-group rednaomultiplecheckboxes">
                                                                    </div>
                                                                </div>

                                                                <div class="component">
                                                                    <div class="control-group rednaoselectbasic">
                                                                    </div>
                                                                </div>

                                                                <div class="component">
                                                                    <div class="control-group rednaosearchablelist">
                                                                    </div>
                                                                </div>

                                                                <div class="component">
                                                                    <div class="control-group rednaosurveytable"></div>
                                                                </div>
                                                                <div class="component">
                                                                    <div class="control-group rednaorating"></div>
                                                                </div>

                                                            </div>



                                                            <div class="tab-pane rednaotablist" id="tabbuttons"
                                                                 style="display: none;">
                                                                <div class="component">
                                                                    <div class="control-group rednaodonationrecurrence">
                                                                    </div>
                                                                </div>

                                                                <div class="component">
                                                                    <div class="control-group rednaodonationbutton">
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div class="tab-pane rednaotablist smartFormFieldTabPro" id="tabpro"
                                                                 style="display: none;">
                                                                <h4 id="smartFormsProWarning" style="margin-top: 0;">
                                                                    <span style="color: red;"><?php echo __("Warning") ?></span> <?php echo __("These fields require a license of smart forms, you can get one ") ?>
                                                                    <a target="_blank"
                                                                       href="http://smartforms.rednao.com/getit"><?php echo __("here") ?>
                                                                        .</a> <?php echo __("If you already have a license please") ?>
                                                                    <a href="javascript:RedNaoLicensingManagerVar.ActivateLicense();"><?php echo __("activate it here") ?></a>
                                                                </h4>

                                                                <div class="component">
                                                                    <div class="control-group sfFileUpload"></div>
                                                                </div>




                                                            </div>
                                                        </div>
                                                    </fieldset>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="tab-pane" id="formPropertiesContainer" style="padding:5px;">
                                            <div id="smartFormPropertiesContainer" style="width:100%">

                                            </div>
                                        </div>

                                        <div class="tab-pane" id="formStylesContainer" style="padding:5px;">
                                            &nbsp;
                                        </div>

                                        <div class="tab-pane" id="formConditionalLogicContainer"
                                             style="padding: 0px; overflow-x: hidden;">
                                            <table id="sfPanelContainer" cellpadding="0"
                                                   style="position: relative; width: 100%;">
                                                <tr>
                                                    <td style="vertical-align: top;">
                                                        <table id="sfSavedConditionList"
                                                               style="width:570px;padding: 5px;">

                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style="background-color: #6b6b6b;padding:20px;border-left: 1px solid #dfdfdf;border-right:1px solid #dfdfdf;vertical-align: top; height: 100%;display: inline-block;overflow: auto;
                                width: calc(100% - 575px)"
                             class="smartFormsSelectedElementContainer">

                            <div class="span6 " id="newFormContainer"
                                 style="margin:0;cursor: e-resize;width: 100%;padding: 10px;background-color: white;">
                                <div class="clearfix" style="text-align:left;cursor: auto;">


                                    <div id="build">
                                        <div id="target" class="form-horizontal" style="background-color:white;">
                                            <div id="redNaoElementlist"
                                                 class="formelements bootstrap-wrapper SfFormElementContainer">
                                                <div class="formelement last"
                                                     style="clear:both;height:77px;width:100%; ">

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </form>

        </div>
        </div>
    </div>

</div>
    <div class="bootstrap-wrapper">
        <div class="modal fade" data-backdrop="static" data-keyboard="false" id="redNaoEmailEditor" style="display: none;">
            <div class="modal-dialog" style=";width:900px;max-width: 90%; max-height: 85%;overflow-y:auto;">
                <div class="modal-content" style="overflow-x: auto;max-height: 80%"  >
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h4 class="modal-title"><span class="glyphicon glyphicon-envelope" style="line-height: 18px;vertical-align: middle;font-size: 13px;"></span> <span style="line-height: 18px;vertical-align: middle;">Email Builder</span></h4>
                        <a target="_blank" style="text-decoration: underline; color:blue; cursor:hand;cursor:pointer;position: absolute;top: 13px;right: 40px;" id="sfNotReceivingEmail" ><?php echo __("Not receiving the email? check the email doctor") ?></a>
                    </div>
                    <div class="modal-body" style="overflow:visible;padding:5px 5px 5px 5px;background-color: #fafafa;">
                        <ul id="emailTabs" class="nav nav-tabs">

                        </ul>
                        <div id="emailContainer" style="border-left:1px solid #7f7f7f;border-right:1px solid #7f7f7f;border-bottom:1px solid #7f7f7f;padding:10px;background-color:white;">
                            <table id="emailControls" style="width:100%">
                                <tr>
                                    <td style="text-align: left;width:50%;">
                                        <label style="width: 100%"><?php echo __("Send to email address(es)") ?></label>
                                        <select multiple="multiple" id="redNaoToEmail" style="width:100%"></select>
                                        <span class="sfEmailShowAdvancedOptions" style="color:blue;text-decoration: underline;cursor: pointer;">Show advanced options</span>
                                    </td>
                                    <td style="text-align: left; padding-left: 10px;vertical-align: top;width:50%;">
                                        <label style="width:100%;text-align: left;"><?php echo __("From name") ?></label>
                                        <input class="form-control" style="width:100%" placeholder="Default (Wordpress)" type="text" id="redNaoFromName" style="width:300px">
                                    </td>


                                    <!-- <td rowspan="5">
                                                <a target="_blank" style="color:red; margin-right: 10px;margin-top: 10px;cursor:hand;cursor:pointer;" id="sfNotReceivingEmail"><?php echo __("Not receiving the email? check the email doctor.") ?></a>
                                                <div class="bootstrap-wrapper" style="height: 150px;overflow-y: scroll;width: 340px;">
                                                    <div id="emailList"></div>
                                                </div>
                                            </td>-->
                                </tr>
                                <tr>
                                    <td colspan="2">
                                        <div style="width:100%;display: none;overflow: hidden;" class="sfEmailAdvancedOptions" >
                                            <div class="row" style="margin:0;">
                                                <div class="col-sm-6" style="text-align: left;width:50%;padding:0;">
                                                    <label style="width: 100%;"><?php echo __("Reply To") ?> <span id="replyToTooltip" style="margin-left: 2px;cursor:hand;cursor:pointer;" data-toggle="tooltip" data-placement="right" title="" class="glyphicon glyphicon-question-sign" data-original-title=" <?php echo __("When you receive the email and hit reply your reply will be send to this email"); ?>"></span></label>
                                                    <select  placeholder="Default (admin email)" multiple="multiple"  id="redNaoReplyTo" style="width:100%"></select>
                                                </div>
                                                <div class="col-sm-6"  style="text-align: left;width:50%;padding-left: 10px;">
                                                    <label style="width:100%;text-align: left;">From email address <span id="fromEmailAddressTooltip" style="margin-left: 2px;cursor:hand;cursor:pointer;" data-toggle="tooltip" data-placement="right" title="" class="glyphicon glyphicon-question-sign" data-original-title=" <?php echo __("Important: if you use an email address different than the default one some email providers will flag your email as spam and block it"); ?>"></span></label>
                                                    <select placeholder="Default (recommended)" style="width:100%"  multiple="multiple"  id="redNaoFromEmail"></select>
                                                </div>
                                            </div>
                                            <div class="row" style="margin:0;">
                                                <div class="col-sm-6" style="overflow: hidden;padding:0;" >
                                                    <label style="width: 100%"><?php echo __("Bcc address(es)") ?></label>
                                                    <select multiple="multiple" id="redNaoBccEmail" style="width:100%"></select>
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                </tr>

                                <tr>
                                    <td colspan="2" style="text-align: left;padding:0;">
                                        <label><?php echo __("Email subject") ?></label>
                                        <input placeholder="Default (Form Submitted)" type="text" id="redNaoEmailSubject" style="width:100%" class="form-control"></td>
                                </tr>
                            </table>


                            <div id="redNaoEmailEditorComponent" style="min-width: 760px;margin-top:15px;">

                            </div>
                            <div style="text-align: right;clear: both;">
                                <div style="display:inline;float:left;">
                                    <input  checked="checked" class="sfEmailElementToShow"  style="margin:0;padding:0;outline:none;" id="showEmailName" type="radio" value="label" name="emailElementToShow">
                                    <label style="margin:0;padding:0" for="showEmailName">&nbsp;Show Label</label>
                                    <input class="sfEmailElementToShow" id="showEmailId" style="margin:0;padding:0;margin-left:10px;outline:none;" value="id" type="radio" name="emailElementToShow">
                                    <label style="margin:0;padding:0" for="showEmailId">&nbsp;Show Id</label>
                                </div>
                                <button onclick="RedNaoEmailEditorVar.CloseEmailEditor();"><?php echo __("Close") ?></button>
                                <button onclick="SmartFormsAddNewVar.SendTestEmail();"><?php echo __("Send Test Email") ?></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="bootstrap-wrapper">
        <div class="modal fade" data-backdrop="static" data-keyboard="false" id="templateManager" style="display: none;">
            <div class="modal-dialog" style=";width:90%;max-width: 1200px; height: 85%;overflow-y:auto;">
                <div class="modal-content" style="overflow-x: auto;max-height: 100%;display: flex;flex-direction: column;height: 100%;"  >
                    <div class="modal-header" style="height: 55px;min-height: auto;">
                        <button type="button" onclick="event.preventDefault();window.location.href='<?php echo admin_url()?>?page=smart_forms_menu'" class="close" aria-hidden="true">×</button>
                        <h4 class="modal-title"><span class="fa fa-paint-brush" style="line-height: 18px;vertical-align: middle;font-size: 13px;"></span> <span style="line-height: 18px;vertical-align: middle;">Select a template</span></h4>
                    </div>
                    <div class="modal-body" style="overflow:visible;padding:0;background-color: #fafafa;height: calc(100% - 55px)">

                    </div>
                </div>
            </div>
        </div>
    </div>
<?php
wp_enqueue_script('smart-forms-add-new',SMART_FORMS_DIR_URL.'js/dist/AddNew_bundle.js',$addNewDependencies,SMART_FORMS_FILE_VERSION);
require_once(SMART_FORMS_DIR.'translations/smart-forms-add-new-translation.php');
do_action('smart_forms_pr_add_new_extension');

