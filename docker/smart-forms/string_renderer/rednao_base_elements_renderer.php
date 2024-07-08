<?php
/**
 * Created by PhpStorm.
 * User: edseventeen
 * Date: 11/28/13
 * Time: 8:51 PM
 */

abstract class rednao_base_elements_renderer {
    public function __construct()
    {

    }

    public abstract function GetString($formElement,$entry,$entryId='');
    public function GetPlain($formElement,$entry){
        return $this->GetString($formElement,$entry);
    }
	public abstract function GetExValues($formElement,$entry);
    public function GetDateValue($formElement,$entry)
    {
        return null;
    }


    public function GetListValue($formElement,$entry)
    {
        throw new Exception('List serialization type not supported');
    }

} 