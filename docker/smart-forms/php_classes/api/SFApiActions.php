<?php

/**
 * Created by PhpStorm.
 * User: Edgar
 * Date: 9/11/2016
 * Time: 8:17 AM
 */
class SFApiActions
{
    public function register_hooks()
    {
        add_action('smart_formsa_include_systemjs',array($this,'include_systemjs'));
    }

    public function include_systemjs(){
        $htmlToPrint= apply_filters('smart_formsf_include_systemjs','');
        //This html was escaped in the filter
        echo $htmlToPrint;
    }
}