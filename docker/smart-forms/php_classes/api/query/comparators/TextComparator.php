<?php

require_once SMART_FORMS_DIR.'php_classes/api/query/comparators/ComparatorBase.php';
class TextComparator extends ComparatorBase
{

    public function Validate()
    {
        if($this->Comparator!='=' &&
                $this->Comparator!='<>')
            return 'Invalid Comparison for '.$this->Field['Id'].'. Allowed values =,<>,like,not like';



    }

    public function GetConditionString()
    {
        global $wpdb;
        switch ($this->Comparator)
        {
            case '<>':
                return $wpdb->prepare(" detail.value <> %s ",$this->Value);
            case '=':
                return $wpdb->prepare(" detail.value =%s",$this->Value);
            case 'not like':
                if(strlen($this->Value)<4)
                {
                    return " detail.value not like '%".$wpdb->esc_like($this->Value)."%'";
                }else
                    return $wpdb->prepare(" not match(detail.value) against(%s in boolean mode) ",'*'.$this->Value.'*');
            case 'like':
                if(strlen($this->Value)<4)
                {
                    return " detail.value like '%".$wpdb->esc_like($this->Value)."%'";
                }else
                    return $wpdb->prepare(" match(detail.value) against(%s in boolean mode)",'*'.$this->Value.'*');
        }
    }
}
