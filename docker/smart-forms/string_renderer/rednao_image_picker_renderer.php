<?php
/**
 * Created by PhpStorm.
 * User: edseventeen
 * Date: 11/28/13
 * Time: 10:00 PM
 */

class rednao_image_picker_renderer extends  rednao_base_elements_renderer {
    public function GetString($formElement,$entry,$entryId='')
    {
        $rowInformation= "";
        $arrayValues=$entry["selectedValues"];
        foreach($arrayValues as $value)
        {
            $rowInformation.=htmlspecialchars($value["value"]).';';
        }
        return $rowInformation;
    }

	public function GetExValues($formElement, $entry)
	{

		$rowInformation= ";;;";
		$arrayValues=$entry["selectedValues"];
		foreach($arrayValues as $value)
		{
			$rowInformation.=htmlspecialchars($value["value"]).';;;';
		}

		if(strlen($rowInformation)==3)
			$rowInformation="";
		return array(
			"exvalue1"=>htmlspecialchars($rowInformation),
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
            foreach($entry["selectedValues"] as $selectedValues)
                if($value["label"]==$selectedValues["value"])
                {
                    array_push($array,$value);
                }

        if(count($array)!=count($entry["selectedValues"]))
            throw new Exception('Value selected not found');

        return $array;
    }
}