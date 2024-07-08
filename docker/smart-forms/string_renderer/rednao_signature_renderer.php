<?php
/**
 * Created by PhpStorm.
 * User: edseventeen
 * Date: 11/28/13
 * Time: 8:52 PM
 */

class rednao_signature_renderer extends rednao_base_elements_renderer {


    public function GetString($formElement,$entry,$entryId='')
    {
        if($entry['image']!=''){
            /*if(isset($entry['tok'])&&$entryId!='')
            {
                $url=admin_url('admin-ajax.php').'?action=rednao_sf_getsignature&id='.$entryId.'&tok='.$entry['tok'];
            }else*/
                $url='data:image/png;base64,'.$entry["image"];
            return '<table style="width: 300px;"><tbody><tr><td><img width="300" alt="The signature was not found" style="width:300px" src="'.esc_attr($url).'"/></td></tr></tbody></table>';
        }
        if($entry['native']!='')
        {
            return '<img alt="Signature could not be shown in this email provider" style="width:300px" src="data:image/svg+xml;base64,'.$entry["value"].'"/>';
        }
        return '';

    }

	public function GetExValues($formElement, $entry)
	{
		return array(
			"exvalue1"=>$this->GetString($formElement,$entry),
            "exvalue2"=>"",
            "exvalue3"=>"",
            "exvalue4"=>"",
            "exvalue5"=>"",
            "exvalue6"=>""
		);
	}
}