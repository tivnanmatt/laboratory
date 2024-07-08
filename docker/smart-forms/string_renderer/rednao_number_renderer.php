<?php
/**
 * Created by PhpStorm.
 * User: edseventeen
 * Date: 11/28/13
 * Time: 8:52 PM
 */

class rednao_number_renderer extends rednao_base_elements_renderer {


    public function GetString($formElement,$entry,$entryId='')
    {
        return htmlspecialchars($entry["value"]);
    }

	public function GetExValues($formElement, $entry)
	{
        $dataToReturn=array(
            "exvalue1"=>$this->GetString($formElement,$entry),
            "exvalue2"=>"",
            "exvalue3"=>"",
            "exvalue4"=>"",
            "exvalue5"=>"",
            "exvalue6"=>""
        );



	    if(isset($entry['numericalValue']))
        {
            $dataToReturn['numericvalue']=$entry['numericalValue'];
        }

	    return $dataToReturn;

	}
}