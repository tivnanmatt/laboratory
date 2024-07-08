<?php

function sf_smart_donations_check_license($email,$key,&$error,$isNew)
{
    if($email!=null||$key!=null)
    {
        if(get_transient("smart_donations_check_again"))
            return true;
        if(sf_smart_donations_license_is_valid($email,$key,$error))
        {
            update_option('smart_donations_email',$email);
            update_option('smart_donations_key',$key);
     

            set_transient("smart_donations_check_again",1,60*60*24*7);
            return true;
        }
    }

    return false;
}

function has_smart_donations_license_and_is_active()
{
	if(!is_plugin_active("smart-donations/smartdonations.php")&&!is_plugin_active("smart-donations-addon/smartdonations.php"))
		return false;


    if(get_transient("smart_donations_check_again"))
        return true;
    $email=get_option('smart_donations_email');
    $key=get_option('smart_donations_key');
    return sf_smart_donations_check_license(($email?$email:""), ($key?$key:""),$error,false);
}

function sf_smart_donations_license_is_valid($email,$key,&$error)
{
    $email=trim($email);
    $key=trim($key);
    delete_transient("smart_donations_check_again");
    $response=wp_remote_post(REDNAO_URL.'smart_donations_license_validation.php',array('body'=> array( 'email'=>$email,'key'=>$key),'timeout'=>10));
    if($response instanceof WP_Error)
    {
        $error= $response->get_error_message();
        return false;
    }

    if(strcmp ($response['body'], "valid") == 0)
        return true;
    else{
        return false;
    }

}