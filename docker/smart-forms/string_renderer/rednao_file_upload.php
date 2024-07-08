<?php
/**
 * Created by PhpStorm.
 * User: edseventeen
 * Date: 11/28/13
 * Time: 8:58 PM
 */

class rednao_file_upload extends  rednao_base_elements_renderer{

    public function GetString($formElement,$entry,$entryId='')
    {
		$html="";
		$firstElement=true;
		foreach($entry as $value)
		{
			if(!isset($value["path"]))
				continue;
			if($firstElement)
				$firstElement=false;
			else
				$html.="<br/>";
			$html.='<a href="'.esc_attr($value["path"]).'">'.esc_html($value["path"]).'</a>';
		}

		return $html;
    }

    public function GetPlain($formElement, $entry)
    {
        $text='';
        $firstElement=true;
        foreach($entry as $value)
        {
            if(!isset($value["path"]))
                continue;
            if($firstElement)
                $firstElement=false;
            else
                $text.=" ";
            $text.=$value["path"];
        }

        return $text;
    }


    public function GetExValues($formElement, $entry)
	{
		$html="";
		$firstElement=true;
		foreach($entry as $value)
		{
			if($firstElement)
				$firstElement=false;


			$html.= $value["path"].';;;';
		}


		$path='';
		$ppat='';

		if(isset($value["path"]))
		    $path=$value["path"];
		if(isset($value["ppath"]))
		    $ppat=$value["ppath"];

		return array(
			"exvalue1"=>htmlspecialchars($html),
            "exvalue2"=>$path,
            "exvalue3"=>$ppat,
            "exvalue4"=>"",
            "exvalue5"=>"",
            "exvalue6"=>""
		);
	}
}