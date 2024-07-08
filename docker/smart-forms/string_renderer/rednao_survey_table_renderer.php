<?php
/**
 * Created by PhpStorm.
 * User: edseventeen
 * Date: 11/28/13
 * Time: 8:52 PM
 */

class rednao_survey_table_renderer extends rednao_base_elements_renderer {


    public function GetString($formElement,$entry,$entryId='')
    {
        $table='<table style="border-color:#ddd;Border-style:solid;border-width:1px;" border="1">';
        foreach($entry['values'] as $item=>$value)
        {
            $table.="<tr><td style='padding:5px;'><strong>".htmlspecialchars($value['QuestionLabel'])."</strong></td><td>".htmlspecialchars($value['ValueLabel'])."</td></tr>";
        }
        $table.='</table>';
        return $table;
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