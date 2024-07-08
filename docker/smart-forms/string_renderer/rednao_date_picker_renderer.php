<?php


class rednao_date_picker_renderer extends rednao_base_elements_renderer {

	public function GetString($formElement,$entry,$entryId='')
	{
		return htmlspecialchars($entry["formattedValue"]);
	}

	public function GetExValues($formElement, $entry)
	{
		return array(
			"exvalue1"=>$entry["formattedValue"],
            "exvalue2"=>"",
            "exvalue3"=>"",
            "exvalue4"=>"",
            "exvalue5"=>"",
            "exvalue6"=>""
		);
	}

	public function GetDateValue($formElement,$entry)
	{
		if($entry["value"]!="")
		{
			$splitDate=explode("-",$entry["value"]);
			if(count($splitDate)!=3)
				return null;

			return mktime(null,null,null,intval($splitDate[1]),intval($splitDate[2]),intval($splitDate[0]));

		}
		return null;
	}

}