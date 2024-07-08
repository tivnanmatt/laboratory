<?php

require_once SMART_FORMS_DIR.'php_classes/api/query/comparators/ComparatorBase.php';

class DateComparator extends ComparatorBase
{

    public function Validate()
    {
        if($this->Comparator!='=' &&
            $this->Comparator!='<>'&&
            $this->Comparator!='>'&&
            $this->Comparator!='>='&&
            $this->Comparator!='<'&&
            $this->Comparator!='<='
        )
            return 'Invalid Comparison for '.$this->Field->Id.'. Allowed values =,<>,>,>=,<,<=';
    }

    public function GetConditionString()
    {
        global $wpdb;
        $date=$this->Value;
        if(is_numeric($date))
            $date=date('c',$date);

        switch ($this->Comparator)
        {
            case '<>':
                return $wpdb->prepare(" detail.datevalue <> %s ", $date);
            case '=':
                return $wpdb->prepare(" detail.datevalue =%s ", $date);
            case '>':
                return $wpdb->prepare(" detail.datevalue >%s ", $date);
            case '>=':
                return $wpdb->prepare(" detail.datevalue >=%s ",$date);
            case '<':
                return $wpdb->prepare(" detail.datevalue < %s ", $date);
            case '<=':
                return $wpdb->prepare(" detail.datevalue <=%s ",$date);
        }
    }
}
