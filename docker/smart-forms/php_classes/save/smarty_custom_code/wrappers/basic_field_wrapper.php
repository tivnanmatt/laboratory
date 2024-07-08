<?php
/**
 * Created by PhpStorm.
 * User: Edgar
 * Date: 8/28/2017
 * Time: 7:33 AM
 */

class basic_field_wrapper
{
    public $stringBuilder;
    public $fieldOptions;
    public $entryData;
    public $useTestData;
    function __construct($stringBuilder,$fieldOptions,$entryData,$useTestData)
    {
        $this->StringBuilder=$stringBuilder;
        $this->fieldOptions=$fieldOptions;
        $this->entryData=$entryData;
        $this->useTestData=$useTestData;
    }

    public function __toString()
    {
        if($this->useTestData)
            return 'sample data';
        return $this->StringBuilder->GetStringFromColumn($this->fieldOptions,$this->entryData);
    }


}