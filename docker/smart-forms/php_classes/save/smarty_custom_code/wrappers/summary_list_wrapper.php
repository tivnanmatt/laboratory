<?php
/**
 * Created by PhpStorm.
 * User: Edgar
 * Date: 8/28/2017
 * Time: 7:33 AM
 */

class summary_list_wrapper extends basic_field_wrapper
{
    public function RNWasOptionSelected($rowLabel,$rowValue)
    {
        if(isset($this->entryData['values']))
        {
            foreach ($this->entryData['values'] as $selectedValue)
            {
                if ($selectedValue['QuestionLabel'] == $rowLabel&&$selectedValue['ValueLabel'] == $rowValue)
                    return true;
            }
            return false;
        }
        return false;


    }



}