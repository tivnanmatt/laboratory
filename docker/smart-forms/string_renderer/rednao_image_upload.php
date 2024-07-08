<?php
/**
 * Created by PhpStorm.
 * User: edseventeen
 * Date: 11/28/13
 * Time: 8:58 PM
 */

class rednao_image_upload extends  rednao_base_elements_renderer{

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
			if(file_exists($value['ppath']))
            {
                $isImage=false;
                if(function_exists('getimagesize'))
                {
                    if(@is_array(getimagesize($value['ppath']))){
                        $isImage = true;
                    }
                }

                if(function_exists('mime_content_type')&& strpos(mime_content_type($value['ppath']),'image/')===0)
                {

                }

                if($isImage)
                {
                    $html .= '<img style="max-width:600px" src="' . esc_attr($value["path"]) . '" alt="' . esc_attr($value["path"]) . '"/>';
                    continue;
                }else{
                    $html.='<a href="'.esc_attr($value["path"]).'">'.esc_html($value["path"]).'</a>';

                }
            }


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