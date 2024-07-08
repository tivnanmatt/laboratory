<?php
/**
 * Created by PhpStorm.
 * User: Edgar
 * Date: 8/28/2017
 * Time: 8:54 AM
 */

class fixed_field_processor
{
    public $match;
    public $entryData;
    public $elementOptions;
    public $useTestData;
    function __construct($match,$entryData,$elementOptions,$useTestData)
    {
        $this->match=$match;
        $this->entryData=$entryData;
        $this->elementOptions=$elementOptions;
        $this->useTestData=$useTestData;
    }

    public function __toString()
    {
        return rednao_get_fixed_field_value($this->match,$this->entryData,$this->elementOptions,$this->useTestData);
    }


}