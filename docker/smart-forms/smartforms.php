<?php
/**
 * Plugin Name: Smart Forms
 * Plugin URI: http://smartforms.rednao.com/getit
 * Description: Place diferent form of donations on your blog...
 * Author: RedNao
 * Author URI: http://rednao.com
 * Version: 2.6.98
 * Text Domain: Smart Forms
 * Domain Path: /languages/
 * License: GPLv3
 * License URI: http://www.gnu.org/licenses/gpl-3.0
 * Slug: smartforms
 */

/**
 *	Copyright (C) 2012-2013 RedNao (email: contactus@rednao.com)
 *
 *	This program is free software; you can redistribute it and/or
 *	modify it under the terms of the GNU General Public License
 *	as published by the Free Software Foundation; either version 2
 *	of the License, or (at your option) any later version.
 *
 *	This program is distributed in the hope that it will be useful,
 *	but WITHOUT ANY WARRANTY; without even the implied warranty of
 *	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *	GNU General Public License for more details.
 *
 *	You should have received a copy of the GNU General Public License
 *	along with this program; if not, write to the Free Software
 *	Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Thanks to:
 * Jakub Stacho (http://www.iconfinder.com/iconsets/checkout-icons#readme)
 * Eggib (http://openclipart.org/detail/174878/)
 * Aha-Soft (http://www.iconfinder.com/iconsets/24x24-free-pixel-icons#readme)
 * Kevin Liew (http://www.queness.com/post/106/jquery-tabbed-interfacetabbed-structure-menu-tutorial)
 * Marcis Gasuns (http://led24.de/iconset/)
 */

require_once('smart-forms-config.php');
require_once(SMART_FORMS_DIR.'integration/smart-donations-integration-ajax.php');
require_once('smart-forms-ajax.php');
require_once(SMART_FORMS_DIR.'widgets/smart-form-widget.php');
require_once (SMART_FORMS_DIR.'php_classes/api/SFApiActions.php');
require_once (SMART_FORMS_DIR.'php_classes/api/SFApiFilters.php');

add_shortcode('sform','rednao_smart_form_short_code');

add_action( 'admin_notices', 'smart_forms_review_request' );
add_action('init', 'rednao_smart_forms_init');
add_action( 'wp_ajax_rednao_smart_forms_export_entries', 'rednao_smart_forms_export_entries' );
add_action( 'wp_ajax_rednao_smart_forms_resend_email', 'rednao_smart_forms_resend_email' );
add_action( 'wp_ajax_rednao_smart_forms_export', 'rednao_smart_forms_export' );
add_action( 'wp_ajax_rednao_smart_forms_save', 'rednao_smart_forms_save' );
add_action( 'wp_ajax_rednao_smart_forms_send_files', 'rednao_smart_forms_send_files' );
add_action( 'wp_ajax_nopriv_rednao_smart_forms_send_files', 'rednao_smart_forms_send_files' );
add_action( 'wp_ajax_rednao_smart_form_short_code_setup', 'rednao_smart_form_short_code_setup' );
add_action( 'wp_ajax_rednao_smart_form_delete_entries', 'rednao_smart_form_delete_entries' );
add_action( 'wp_ajax_rednao_smart_forms_entries_list', 'rednao_smart_forms_entries_list' );
add_action( 'wp_ajax_rednao_smart_forms_save_form_values','rednao_smart_forms_save_form_values');
add_action( 'wp_ajax_rednao_smart_forms_edit_form_values','rednao_smart_forms_edit_form_values');
add_action( 'wp_ajax_nopriv_rednao_smart_forms_save_form_values','rednao_smart_forms_save_form_values');
add_action( 'wp_ajax_rednao_smart_form_send_test_email','rednao_smart_form_send_test_email');
add_action('wp_ajax_rednao_smart_forms_submit_license','rednao_smart_forms_submit_license');
add_action('wp_ajax_rednao_smart_forms_execute_op','rednao_smart_forms_execute_op');
add_action('wp_ajax_rednao_smart_forms_generate_detail','rednao_smart_forms_generate_detail');
add_action('wp_ajax_rednao_smart_forms_get_form_element_info','rednao_smart_forms_get_form_element_info');
add_action('wp_ajax_rednao_smart_forms_get_form_options','rednao_smart_forms_get_form_options');
add_action('wp_ajax_rednao_smart_forms_send_test','rednao_smart_forms_send_test');
add_action('wp_ajax_smart_forms_skip_tutorial','smart_forms_skip_tutorial');
add_action('wp_ajax_rednao_smartformsexport','smart_forms_export');
add_action('wp_ajax_rednao_smart_forms_save_settings','smart_forms_save_settings');
add_action( 'admin_menu', 'smart_forms_remove_menu_items' );
add_action('admin_enqueue_scripts','rednao_smart_forms_admin_header');
add_action( 'enqueue_block_editor_assets', 'rednao_smart_forms_register_blocks' );
add_action( 'init', 'smart_forms_register_block' );
add_action( 'wp_ajax_rednao_sf_getfile','rednao_smart_forms_get_file');
add_action( 'wp_ajax_nopriv_rednao_sf_getfile','rednao_smart_forms_get_file');

add_action( 'wp_ajax_rednao_sf_getsignature','rednao_sf_getsignature');
add_action( 'wp_ajax_nopriv_rednao_sf_getsignature','rednao_sf_getsignature');
//api
$apiActions=new SFApiActions();
$apiActions->register_hooks();
$apiFilters=new SFApiFilters();
$apiFilters->register_hooks();
//integration

add_action('wp_ajax_rednao_smart_forms_get_campaigns','rednao_smart_forms_get_campaigns');


add_action('admin_init','rednao_smart_forms_plugin_was_activated');
register_activation_hook(__FILE__,'rednao_smart_forms_plugin_was_activated');

add_action('admin_menu','rednao_smart_forms_create_menu');
add_filter('smart_forms_add_form_elements_dependencies','rednao_add_form_elements_dependencies');
add_action('admin_notices', 'ShowAllInOneNotice');

add_action( 'admin_init', 'smart_forms_admin_notices' );
add_action('wp_ajax_smart_forms_aio_dismiss','smart_forms_aio_dismiss');

function smart_forms_aio_dismiss()
{
    $nonce=$_POST['nonce'];
    if(!wp_verify_nonce($nonce,'wp_sf_aio_dismiss'))
        die('Invalid request');


    update_option('SFAIONotShowAgain',true);
}
function smart_forms_admin_notices()
{
    if ( is_multisite() ) {
        add_action( 'network_admin_notices',  'smart_forms_maybe_add_aio_notice'  );
    } else {
        add_action( 'admin_notices','smart_forms_maybe_add_aio_notice' );
    }
}

function smart_forms_maybe_add_aio_notice()
{
    if(get_option('SFAIONotShowAgain',false))
        return;
    ?>
    <div class="notice notice-success is-dismissible smart-forms-notice">
        <div style="display: flex;justify-content: flex-end;align-items: center">
            <button type="button" class="notice-dismiss"><span class="screen-reader-text">Dismiss this notice.</span></button>
        </div>
        <div style="display: flex;align-items: center;">
            <img src="<?php echo SMART_FORMS_DIR_URL?>images/aioicon.gif"/>
            <div style="margin-right: 10px">

                <p>If you like Smart Forms you will love our new form builder <a target="_blank" href="https://allinoneforms.rednao.com/migrating-to-aio-forms/">AIO Forms</a> </p>
                <div style="margin-top: 10px">
                    <a target="_blank" href="https://allinoneforms.rednao.com/migrating-to-aio-forms/" class="button-primary">What is AIO Forms and why should I use it</a>
                    <a  href="#" class="button-secondary notShowAgain">Dismiss notice and not show again</a>
                </div>
            </div>
        </div>
    </div>
    <script type="text/javascript">

        document.querySelector('.notShowAgain').addEventListener('click',function(){

            jQuery.post( ajaxurl, { action: 'smart_forms_aio_dismiss',
                nonce: '<?php echo wp_create_nonce('wp_sf_aio_dismiss')?>'
             } );


            document.querySelector('.smart-forms-notice').remove();
        });

        document.querySelector('.smart-forms-notice .notice-dismiss').addEventListener('click',function(){
            document.querySelector('.smart-forms-notice').remove();
        });
    </script>
    <?php

}

function ShowAllInOneNotice(){
    return;
    if(isset($_GET['DismissAllInOneNotice'])&&intval($_GET['DismissAllInOneNotice'])==1)
    {
        update_option('AllInOneNoticeTime',-1);
        return;
    }

    if(get_option('AllInOneNoticeTime',false)==-1)
    {
        return;
    }


    echo '<div class="notice notice-info is-dismissible"  data-dismissible="notice-one-forever" >
                <div style="padding: 10px;display: flex;align-items: center;">
                    <a target="_blank" href="https://wordpress.org/plugins/all-in-one-forms/" style="display: inline-flex;flex-direction: column;text-align: center;align-items: center">                 
                        <img src="'.esc_attr(SMART_FORMS_DIR_URL).'images/allinonelogo.png" style="width: 100px;"/>   
                        <strong style="font-size: 20px;margin-top: 5px;">All in one forms</strong>
                    </a>
                 
                    <div style="margin-left: 15px;">
                         <h2 style="margin: 0">Are you enjoing Smart Forms? Try our new form builder!</h2>
                         <ul style="list-style: circle;list-style-position: inside;margin-left: 10px;">
                            <li>More intuitive and easy to use</li>
                            <li>Support advance calculations and conditional logic</li>
                            <li>The entire form builder (that is all the fields, formulas conditions etc) are available in the free version!</li>
                          <li>If you have a license of smart forms <a target="_blank" href="https://allinoneforms.rednao.com/get-a-free-copy-of-the-plugin/">get an equivalent version for free!</a> (this copy is totally free, you can still keep using smart forms as you normaly do)</li>
                            
                                                             
                         </ul>
                    </div>              
                </div>
                    
                <div style="margin-bottom: 10px">
                    <a target="_blank" style="vertical-align: top;" href="https://wordpress.org/plugins/all-in-one-forms/" class="button-primary">Learn more</a>
                    <form style="display: inline-block;vertical-align: top;">
                        <input type="hidden" name="DismissAllInOneNotice" value="1"/>
                        <button class="button-secondary">Do not show this again</button>
                    </form>
                </div>
                
         </div>';
}


function rednao_sf_getsignature(){
    global $wpdb;
    if(!isset($_GET['id'])||!isset($_GET['tok']))
    {
        echo "Invalid request";
        die();
    }

    $id=intval($_GET['id']);
    $tok=sanitize_text_field($_GET['tok']);

    $entry=$wpdb->get_row($wpdb->prepare('select data from '.SMART_FORMS_ENTRY.' where entry_id=%s',$id));
    if($entry==null)
    {

        echo "Invalid request";
        die();
    }

    $fields=json_decode($entry->data);
    if($fields==null)
    {
        echo "Invalid request";
        die();
    }

    foreach($fields as $key=>$value)
    {
        if($value==null||!isset($value->tok))
            continue;

        if($value->tok!=$tok)
            continue;

        header('Expires: 0');
        header('Cache-Control: must-revalidate');
        header('Pragma: public');
        header('Content-type: image/png');

        echo base64_decode($value->image);
    }
    die();
}

function smart_forms_register_block(){
    if(function_exists('register_block_type'))
        register_block_type( 'smartforms/sfform-selector', array(
            'attributes'      => array(
                'formId'       => array(
                    'type' => 'string',
                )
            ),
            'render_callback' => 'smart_forms_render_form'
        ));
}

function smart_forms_render_form($values){
    require_once('smart-forms-helpers.php');
    return rednao_smart_forms_load_form(null,$values['formId'],true);
}

function rednao_smart_forms_register_blocks()
{
    wp_enqueue_script(
        'smartforms-gutenberg-form-selector',
        SMART_FORMS_DIR_URL . 'js/blocks/dist/formSelector_bundle.js',
        array( 'wp-blocks', 'wp-i18n', 'wp-element' ),
        SMART_FORMS_FILE_VERSION,
        true
    );

    global $wpdb;
    $result=$wpdb->get_results("SELECT form_name label, form_id value FROM ".SMART_FORMS_TABLE_NAME,'ARRAY_A');
    wp_localize_script('smartforms-gutenberg-form-selector','smartformsblockvars',array(
        'forms'=>$result,
        'rootUrl'=>SMART_FORMS_DIR_URL
    ));
}


function rednao_add_form_elements_dependencies($dependencies)
{
    wp_enqueue_script('smart-forms-data-store',SMART_FORMS_DIR_URL.'js/bundle/datastores_bundle.js',array(),SMART_FORMS_FILE_VERSION);
    wp_enqueue_script('smart-forms-polyfill',SMART_FORMS_DIR_URL.'js/utilities/polyfill.js',array(),SMART_FORMS_FILE_VERSION);
    wp_enqueue_script('smart-forms-promise',SMART_FORMS_DIR_URL.'js/utilities/es6-promise/es6-promise.min.js',array(),SMART_FORMS_FILE_VERSION);
    $dependencies[]='smart-forms-data-store';
    $dependencies[]='smart-forms-promise';
    return $dependencies;
}

function rednao_smart_forms_admin_header($hook){
    if($hook=='toplevel_page_smart_forms_menu'&&isset($_GET['id']))
    {
        add_action('admin_print_styles','smart_forms_filter_not_needed_styles');
        add_action('admin_print_scripts','smart_forms_filter_not_needed_scripts');
    }
}

function smart_forms_filter_not_needed_styles(){

    global $wp_styles;
    $styles=$wp_styles->queue;
    $queuedStyles=$wp_styles->queue;
    $allowedStyles=array('admin-bar','colors','ie','wp-auth-check');
    foreach($queuedStyles as $queue)
    {
        if(isset($wp_styles->registered[$queue]))
        {
            if($wp_styles->registered[$queue]->src)
            {
                if(strpos($wp_styles->registered[$queue]->src,'wp-includes/')!==false||strpos($wp_styles->registered[$queue]->src,'wp-admin/')!==false||$wp_styles->registered[$queue]->src===true)
                    continue;
                if(in_array($queue,$allowedStyles))
                    continue;

                if(strpos($queue,'smart-forms')!==false)
                    continue;

                wp_dequeue_style($queue);

            }
        }

    }

}


function smart_forms_filter_not_needed_scripts(){

    global $wp_scripts;
    $queuedScripts=$wp_scripts->queue;
    $allowedScripts=array('jquery','common','jquery-ui-core','admin-bar','utils','svg-painter','wp-auth-check');
    foreach($queuedScripts as $queue)
    {
        if(isset($wp_scripts->registered[$queue]))
        {
            if($wp_scripts->registered[$queue]->src)
            {
                if(strpos($wp_scripts->registered[$queue]->src,'wp-includes/')!==false||strpos($wp_scripts->registered[$queue]->src,'wp-admin/')!==false||$wp_scripts->registered[$queue]->src===true)
                    continue;
                if(in_array($queue,$allowedScripts))
                    continue;

                if(strpos($queue,'smart-forms')!==false)
                    continue;

                wp_dequeue_script($queue);

            }
        }

    }

}

function smart_forms_remove_menu_items() {
    remove_menu_page( 'edit.php?post_type=smartforms_preview' );
}






function rednao_smart_forms_create_menu(){

    add_menu_page('Smart Forms','Smart Forms','manage_options',"smart_forms_menu",'rednao_forms',plugin_dir_url(__FILE__).'images/smartFormsIcon.png');
    if(current_user_can('manage_options'))
        add_submenu_page("smart_forms_menu",'Entries','Entries','manage_options',__FILE__.'entries', 'rednao_smart_forms_entries');
    else if(current_user_can('smart_forms_view_entries'))
        add_submenu_page("smart_forms_menu",'Entries','Entries','smart_forms_view_entries',__FILE__.'entries', 'rednao_smart_forms_entries');
    add_submenu_page("smart_forms_menu",'Support/Wish List','Support/Wish List','manage_options',__FILE__.'wish_list', 'rednao_smart_forms_wish_list');
	add_submenu_page("smart_forms_menu",'Settings','Settings','manage_options',__FILE__.'settings', 'rednao_smart_forms_settings');

	do_action('add_smart_forms_menu_items');

}



function smart_forms_indexing_is_requred()
{
	global $wpdb;
	$entriesCount=$wpdb->get_var('select count(*) from '. SMART_FORMS_ENTRY);
	$entriesDetailCount=$wpdb->get_var('select count(*) from '. SMART_FORMS_ENTRY_DETAIL);

	return $entriesCount!=0&&$entriesDetailCount==0;
}


function rednao_smart_forms_plugin_was_activated()
{
    $dbversion=get_option("SMART_FORMS_LATEST_DB_VERSION");
    if($dbversion<SMART_FORMS_LATEST_DB_VERSION )
    {
        require_once(ABSPATH.'wp-admin/includes/upgrade.php');

        $sql="CREATE TABLE ".SMART_FORMS_TABLE_NAME." (
        form_id int AUTO_INCREMENT,       
        form_name VARCHAR(200) NOT NULL,
        element_options MEDIUMTEXT NOT NULL,
        client_form_options MEDIUMTEXT NOT NULL,
        form_options MEDIUMTEXT NOT NULL,
        donation_email VARCHAR(200),
        PRIMARY KEY  (form_id)
        ) COLLATE utf8_general_ci;";
        dbDelta($sql);

        $sql="CREATE TABLE ".SMART_FORMS_ENTRY." (
        entry_id int AUTO_INCREMENT,
        uniq_id VARCHAR(50),
        user_id VARCHAR(50),
        form_id int,
        date datetime NOT NULL,
        data MEDIUMTEXT NOT NULL,
        ip VARCHAR(39),
        reference_id VARCHAR(200),
        sequential_id BIGINT,
        PRIMARY KEY  (entry_id)
        ) COLLATE utf8_general_ci;";
        dbDelta($sql);

		$sql="CREATE TABLE ".SMART_FORMS_ENTRY_DETAIL." (
        entry_detail_id int AUTO_INCREMENT,
        entry_id int,
        field_id varchar(50) NOT NULL,
        json_value MEDIUMTEXT NOT NULL,
        value MEDIUMTEXT NOT NULL,
        exvalue1 MEDIUMTEXT NOT NULL,
        exvalue2 MEDIUMTEXT NOT NULL,
        exvalue3 MEDIUMTEXT NOT NULL,
        exvalue4 MEDIUMTEXT NOT NULL,
        exvalue5 MEDIUMTEXT NOT NULL,
        exvalue6 MEDIUMTEXT NOT NULL,
        numericvalue DOUBLE,        
        datevalue DATETIME,
        PRIMARY KEY  (entry_detail_id),
        KEY entry_id (entry_id),
        KEY field_id (field_id),
        KEY numericvalue (numericvalue),   
        FULLTEXT KEY value (value)
        ) COLLATE utf8_general_ci;";
		dbDelta($sql);


        $sql="CREATE TABLE ".SMART_FORMS_UPLOADED_FILES." (
		    uploaded_file_id INT AUTO_INCREMENT,
		    file_key  VARCHAR(32),
		    file_name VARCHAR(500),
		    file_mime VARCHAR(500),
		    original_name VARCHAR(500),
		    PRIMARY KEY (uploaded_file_id)
		)";
		dbDelta($sql);
		if(smart_forms_indexing_is_requred())
            update_site_option('SMART_FORMS_REQUIRE_DB_DETAIL_GENERATION','y');

        update_site_option("SMART_FORMS_LATEST_DB_VERSION",SMART_FORMS_LATEST_DB_VERSION);
    }
}




function rednao_forms()
{
    include(SMART_FORMS_DIR.'main_screens/smart-forms-list.php');
}

function rednao_smart_form_short_code(/** @noinspection PhpUnusedParameterInspection */ $attr,$content)
{
    require_once('smart-forms-helpers.php');
    return rednao_smart_forms_load_form(null,$content,true);
}

function rednao_smart_forms_init()
{
    if ( ! current_user_can('edit_posts') && ! current_user_can('edit_pages') ) {
        return;
    }

    if ( get_user_option('rich_editing') == 'true') {
        add_filter( 'mce_external_plugins', 'rednao_smart_forms_add_plugin' );
        add_filter( 'mce_buttons', 'rednao_smart_forms_register_button' );
    }

    register_post_type('smartforms_preview',
        array(
            'labels' => array(
                'name' => __( 'SmartFormsPreview' ),
                'singular_name' => __( 'SmartFormsPreview' )
            ),
            'public' => true,
            'has_archive' => false,
        )
    );
}

function rednao_smart_forms_add_plugin($plugin_array)
{
    wp_enqueue_script('isolated-slider',plugin_dir_url(__FILE__).'js/rednao-isolated-jq.js');
    wp_localize_script('isolated-slider','smartformsvars',array(
            'nonce'=>wp_create_nonce('short_code_setup')
    ));
    wp_enqueue_style('smart-forms-Slider',plugin_dir_url(__FILE__).'css/smartFormsSlider/jquery-ui-1.10.2.custom.min.css');
    $plugin_array['rednao_smart_forms_button']=plugin_dir_url(__FILE__).'js/shortcode/smartFormsShortCodeButton.js';
    return $plugin_array;
}

function rednao_smart_forms_register_button($buttons)
{
    $buttons[]="rednao_smart_forms_button";
    return $buttons;
}

function rednao_smart_forms_settings()
{
    include(SMART_FORMS_DIR.'main_screens/smart-forms-settings.php');
}

function rednao_smart_forms_entries()
{
    include(SMART_FORMS_DIR.'main_screens/smart-forms-entries2.php');
}
function rednao_smart_forms_wish_list()
{
    include(SMART_FORMS_DIR.'main_screens/smart-forms-wishlist.php');
}


require_once(SMART_FORMS_DIR.'pr/smart-forms-pr.php');



function rednao_smart_forms_generate_detail()
{
    if(!wp_verify_nonce($_GET['nonce'],'save_nonce')||!current_user_can('edit_pages'))
    {
        echo json_encode(array(
            'success'=>false,
            'errorMessage'=>'Invalid Request'
        ));
        die();
    }
	include(SMART_FORMS_DIR.'utilities/smart-forms-detail-generator.php');
}




add_filter('query_vars','smart_forms_add_trigger');
function smart_forms_add_trigger($vars) {
    $vars[] = 'smartformspreview';
    return $vars;
}

add_action('template_redirect', 'smart_forms_check_if_preview');
function smart_forms_check_if_preview()
{

    $val=get_query_var('smartformspreview')?get_query_var('smartformspreview'):"";
    if($val==""&&isset($_GET["smartformspreview"]))
        $val=intval($_GET["smartformspreview"]);

    if($val!=0&&$val!='')
    {
        require_once('smart-forms-helpers.php');
        rednao_smart_forms_load_preview();
    }

}
function smart_forms_review_request(){
    return;
}