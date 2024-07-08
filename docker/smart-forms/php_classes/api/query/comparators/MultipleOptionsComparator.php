<?php

require_once SMART_FORMS_DIR.'php_classes/api/query/comparators/ComparatorBase.php';
class MultipleOptionsComparator extends ComparatorBase
{

    public function Validate()
    {
        if($this->Comparator!='contains' &&
            $this->Comparator!='not contains'
        )
            return 'Invalid Comparison for '.$this->Field->Id.'. Allowed values contains,not contains';
    }

    public function GetConditionString()
    {
        global $wpdb;
        $condition='(';
        switch ($this->Comparator)
        {
            case 'not contains':
                foreach($this->Value as $currentValue)
                {
                    if(strlen($currentValue)<4)
                    {
                        $condition .= " detail.exvalue1 not like '%" . $wpdb->esc_like(';;;' . $currentValue . ';;;') . "%' and ";
                    }else{
                        $condition.=$wpdb->prepare(" not match(detail.exvalue1) against(%s in boolean mode) and ",'*;;;'.$currentValue.';;;*');
                    }
                }
            break;
            case 'contains':

                    foreach($this->Value as $currentValue)
                    {
                        if(strlen($currentValue)<4)
                        {
                            $condition .= " detail.exvalue1 like '%" . $wpdb->esc_like(';;;' . $currentValue . ';;;') . "%' or ";
                        }else
                        {
                            $condition .= $wpdb->prepare(" match(detail.exvalue1) against(%s in boolean mode) or ", '*;;;' . $currentValue . ';;;*');
                        }
                    }

        }


        $condition=substr($condition,0,-4).')';

        return $condition;

    }
}
