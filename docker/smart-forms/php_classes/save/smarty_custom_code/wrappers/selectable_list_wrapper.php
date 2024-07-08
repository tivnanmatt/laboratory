<?php
/**
 * Created by PhpStorm.
 * User: Edgar
 * Date: 8/28/2017
 * Time: 7:33 AM
 */

class selectable_list_wrapper extends basic_field_wrapper
{
    public function RNWasOptionSelected($optionName)
    {
        if(isset($this->entryData['selectedValues']))
        {
            foreach ($this->entryData['selectedValues'] as $selectedValue)
            {
                if ($selectedValue['label'] == html_entity_decode($optionName))
                    return true;
            }
            return false;
        }
        return $this->entryData['value']==html_entity_decode($optionName);


    }



}