<?php
/**
 * Created by JetBrains PhpStorm.
 * User: edseventeen
 * Date: 6/13/13
 * Time: 8:04 PM
 * To change this template use File | Settings | File Templates.
 */

if(!defined('ABSPATH'))
    die('Forbidden');

global $wpdb;
require_once(SMART_FORMS_DIR.'smart-forms-bootstrap.php');
require_once(SMART_FORMS_DIR.'additional_fields/smart-forms-additional-fields-list.php');

wp_enqueue_script('isolated-slider',SMART_FORMS_DIR_URL.'js/rednao-isolated-jq.js',array(),SMART_FORMS_FILE_VERSION);


$fieldsDependencies=array();
$additionalFields=apply_filters('smart_forms_af_names',$fieldsDependencies);
foreach($additionalFields as $field)
{
    do_action('smart_forms_af_'.$field['id']);
}



$formElementDependencies=array('isolated-slider','smart-forms-form-elements-container');
$formElementDependencies=apply_filters('smart_forms_add_form_elements_dependencies',$formElementDependencies);

wp_enqueue_script('smart-forms-form-elements-container',SMART_FORMS_DIR_URL.'js/formBuilder/container/Container.js',array('isolated-slider'),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('smart-forms-form-elements',SMART_FORMS_DIR_URL.'js/formBuilder/formelements.js',$formElementDependencies,SMART_FORMS_FILE_VERSION);
wp_enqueue_script('smart-forms-event-manager',SMART_FORMS_DIR_URL.'js/formBuilder/eventmanager.js',array('isolated-slider'),SMART_FORMS_FILE_VERSION);

do_action('smart_formsa_include_systemjs');
do_action('smart_forms_include_form_elemeents_scripts');
do_action('smart_forms_pr_add_form_elements_extensions');


wp_enqueue_style('form-builder-custom',SMART_FORMS_DIR_URL.'css/formBuilder/custom.css',array(),SMART_FORMS_FILE_VERSION);
wp_enqueue_style('smart-donations-Slider',SMART_FORMS_DIR_URL.'css/smartFormsSlider/jquery-ui-1.10.2.custom.min.css',array(),SMART_FORMS_FILE_VERSION);

if(wp_script_is('wp-element'))
    wp_enqueue_script('smart_forms_entries',SMART_FORMS_DIR_URL.'js/dist/Entries_bundle.js',array('wp-element','isolated-slider'));
else
{
    wp_enqueue_script('sfreact', SMART_FORMS_DIR_URL . 'js/utilities/react/react.js', array('isolated-slider'));
    wp_enqueue_script('sfreactdom', SMART_FORMS_DIR_URL . 'js/utilities/react/react-dom.js', array('sfreact'));
    wp_enqueue_script('smart_forms_entries', SMART_FORMS_DIR_URL . 'js/dist/Entries_bundle.js', array('sfreactdom', 'isolated-slider'));
}
include_once(SMART_FORMS_DIR.'smart-forms-license.php');
smart_forms_load_license_manager("");
wp_localize_script('smart_forms_entries','SmartFormsEntriesVar',array(
    'Forms'=>apply_filters('smart-forms-entries-forms', $wpdb->get_results("select form_id FormId,form_name FormName, element_options ElementOptions,form_options ServerOptions from ".SMART_FORMS_TABLE_NAME." order by form_name")),
    'Nonce'=>wp_create_nonce('smart_forms_export'),
    'EditNonce'=>wp_create_nonce('smart_forms_edit_values'),
    'ListEntries'=>wp_create_nonce('smart_forms_list_entries'),
    'NonceDelete'=>wp_create_nonce('smart_delete_entry')
));

?>

<style>
#editDialog{
    max-height: 700px;
    overflow-y:auto;

    padding:15px;
}
</style>

<script type="text/javascript" language="javascript">
    var smartFormsRootPath=<?php echo json_encode(SMART_FORMS_DIR_URL)?>;
    var RedNaoCampaignList="";
    var smartFormsDesignMode=false;
</script>


<script type="text/javascript">
    var smartFormsPath=<?php echo json_encode(SMART_FORMS_DIR_URL)?>;
    var smartFormsAdditionalFields0=<?php echo json_encode($additionalFields)?>;
</script>

<div id="editDialog"></div>
<script type="application/javascript">
    var SmartFormsElementsTranslation = {};

</script>

<div id="app"></div>
