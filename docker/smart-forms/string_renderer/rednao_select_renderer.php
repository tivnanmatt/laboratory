<?php
/**
 * Created by PhpStorm.
 * User: edseventeen
 * Date: 11/28/13
 * Time: 8:59 PM
 */

class rednao_select_renderer extends  rednao_base_elements_renderer{

    public function GetString($formElement,$entry,$entryId='')
    {
        return htmlspecialchars($entry["value"]);
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


    public function GetListValue($formElement,$entry)
    {
        $array= Array();
        foreach($formElement["Options"] as $value)
            if($value["label"]==$entry["value"])
            {
                array_push($array,$value);
            }

        if(count($array)!=1&&$entry["value"]!='')
            throw new Exception('Value selected not found');

        return $array;
    }
}