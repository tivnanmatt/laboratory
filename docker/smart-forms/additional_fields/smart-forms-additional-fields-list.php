<?php
add_action( 'smart_forms_af_rednaoimagepicker', 'smart_forms_af_rednaoimagepicker' );
function smart_forms_af_rednaoimagepicker(){
    wp_enqueue_script('smart-forms-af-rednaoimagepicker',SMART_FORMS_DIR_URL.'js/formBuilder/additionalFields/rednaoimagepicker.js',array('smart-forms-form-elements','isolated-slider'),SMART_FORMS_FILE_VERSION);
    wp_enqueue_script('smart-forms-image-picker',SMART_FORMS_DIR_URL.'js/utilities/imagePicker/image-picker.min.js',array('isolated-slider'),SMART_FORMS_FILE_VERSION);
    wp_enqueue_style('smart-forms-image-picker-css',SMART_FORMS_DIR_URL.'js/utilities/imagePicker/image-picker.css',array(),SMART_FORMS_FILE_VERSION);
}


add_action( 'smart_forms_af_rednaosignature', 'smart_forms_af_rednaosignature' );
function smart_forms_af_rednaosignature(){
    wp_enqueue_script('smart-forms-af-rednaosignature',SMART_FORMS_DIR_URL.'js/formBuilder/additionalFields/rednaosignature.js',array('smart-forms-form-elements','isolated-slider','smart-forms-af-signature-lib'),SMART_FORMS_FILE_VERSION);
    wp_enqueue_script('smart-forms-af-signature-lib',SMART_FORMS_DIR_URL.'js/utilities/signature/jSignature.js',array('isolated-slider'),SMART_FORMS_FILE_VERSION);
}


add_action( 'smart_forms_af_rednaodatatable', 'smart_forms_af_rednaodatatable' );
function smart_forms_af_rednaodatatable(){
    wp_enqueue_script('smart-forms-af-handsontable',SMART_FORMS_DIR_URL.'js/formBuilder/additionalFields/rednaotable/handsontable.full.js',array('smart-forms-form-elements','isolated-slider'),SMART_FORMS_FILE_VERSION);
    wp_enqueue_script('smart-forms-af-rednaodatatable',SMART_FORMS_DIR_URL.'js/formBuilder/additionalFields/rednaotable/rednaodatatable.js',array('smart-forms-af-handsontable'),SMART_FORMS_FILE_VERSION);
    wp_enqueue_style('smart-forms-af-handsontable-st',SMART_FORMS_DIR_URL.'js/formBuilder/additionalFields/rednaotable/handsontable.full.min.css',array(),SMART_FORMS_FILE_VERSION);

}



add_action( 'smart_forms_af_rednaoimage', 'smart_forms_af_rednaoimage' );
function smart_forms_af_rednaoimage(){
    wp_enqueue_script('smart-forms-af-rednaoimage',SMART_FORMS_DIR_URL.'js/formBuilder/additionalFields/rednaoimage.js',array('smart-forms-form-elements','isolated-slider'),SMART_FORMS_FILE_VERSION);
}

add_action( 'smart_forms_af_rednaogrouppanel', 'smart_forms_af_rednaogrouppanel' );
function smart_forms_af_rednaogrouppanel(){
    wp_enqueue_script('smart-forms-af-rednaogrouppanel',SMART_FORMS_DIR_URL.'js/formBuilder/additionalFields/rednaogrouppanel.js',array('smart-forms-form-elements','isolated-slider'),SMART_FORMS_FILE_VERSION);
}

add_action( 'smart_forms_af_rednaorepeater', 'smart_forms_af_rednaorepeater' );
function smart_forms_af_rednaorepeater(){
    wp_enqueue_script('smart-forms-af-rednaorepeater',SMART_FORMS_DIR_URL.'js/formBuilder/additionalFields/rednaorepeater.js',array('smart-forms-form-elements','isolated-slider'),SMART_FORMS_FILE_VERSION);
}

add_action( 'smart_forms_af_rednaotimepicker', 'smart_forms_af_rednaotimepicker' );
function smart_forms_af_rednaotimepicker(){
    wp_enqueue_script('smart-forms-af-rednaotimepicker-lib',SMART_FORMS_DIR_URL.'js/utilities/timepicker/timepickerlib.min.js',array('smart-forms-form-elements','isolated-slider'),SMART_FORMS_FILE_VERSION);
    wp_enqueue_script('smart-forms-af-rednaotimepicker',SMART_FORMS_DIR_URL.'js/formBuilder/additionalFields/rednaotimepicker/rednaotimepicker.js',array('smart-forms-af-rednaotimepicker-lib'),SMART_FORMS_FILE_VERSION);
    wp_enqueue_style('smart-forms-af-rednaotimepicker-style',SMART_FORMS_DIR_URL.'js/utilities/timepicker/bootstrap-timepicker.css',array(),SMART_FORMS_FILE_VERSION);
}


add_action( 'smart_forms_af_rednaorecaptcha2', 'smart_forms_af_rednaorecaptcha2' );
function smart_forms_af_rednaorecaptcha2(){
    wp_enqueue_script('smart-forms-af-rednaorecaptcha2',SMART_FORMS_DIR_URL.'js/formBuilder/additionalFields/rednaorecaptcha2.js',array('smart-forms-form-elements','isolated-slider'),SMART_FORMS_FILE_VERSION);

}

add_action( 'smart_forms_af_rednaoimageupload', 'smart_forms_af_rednaoimageupload' );
function smart_forms_af_rednaoimageupload(){
    wp_enqueue_script('smart-forms-af-rednaoimageupload',SMART_FORMS_DIR_URL.'js/formBuilder/additionalFields/rednaoimageupload/rednaoimageupload.js',array('smart-forms-form-elements','isolated-slider'),SMART_FORMS_FILE_VERSION);
    wp_enqueue_style('smart-forms-af-rednaoimageupload-style',SMART_FORMS_DIR_URL.'js/formBuilder/additionalFields/rednaoimageupload/rednaoimageupload.css',array(),SMART_FORMS_FILE_VERSION);

}



add_action( 'smart_forms_af_rednaocurrency', 'smart_forms_af_rednaocurrency' );
function smart_forms_af_rednaocurrency(){
    wp_enqueue_script('smart-forms-af-rednaocurrency',SMART_FORMS_DIR_URL.'js/formBuilder/additionalFields/rednaocurrency.js',array('smart-forms-form-elements','isolated-slider'),SMART_FORMS_FILE_VERSION);

}


add_action( 'smart_forms_af_rednaotermofservice', 'smart_forms_af_rednaotermofservice' );
function smart_forms_af_rednaotermofservice(){
    wp_enqueue_script('smart-forms-af-rednaotermofservice',SMART_FORMS_DIR_URL.'js/formBuilder/additionalFields/rednaotermofservice.js',array('smart-forms-form-elements','isolated-slider'),SMART_FORMS_FILE_VERSION);

}


add_filter( 'smart_forms_af_names', 'smart_forms_af_names' );
function smart_forms_af_names($val)
{
    array_push($val,array('id'=>'rednaoimageupload','section'=>'Pro'));
    array_push($val,array('id'=>'rednaoimagepicker','section'=>'Multiple'));
    array_push($val,array('id'=>'rednaosignature','section'=>'Advanced'));
    array_push($val,array('id'=>'rednaoimage','section'=>'Layout'));
    array_push($val,array('id'=>'rednaogrouppanel','section'=>'Layout'));
    array_push($val,array('id'=>'rednaorepeater','section'=>'Layout'));
    array_push($val,array('id'=>'rednaotimepicker','section'=>'Basic'));
    array_push($val,array('id'=>'rednaocurrency','section'=>'Basic'));
    array_push($val,array('id'=>'rednaorecaptcha2','section'=>'Advanced'));
    array_push($val,array('id'=>'rednaotermofservice','section'=>'Advanced'));
    //array_push($val,array('id'=>'rednaodatatable','section'=>'Others'));
    return $val;
}