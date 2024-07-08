<?php

require_once SMART_FORMS_DIR.'php_classes/api/query/comparators/ComparatorBase.php';
class NumberComparator extends ComparatorBase
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
        switch ($this->Comparator)
        {
            case '<>':
                return $wpdb->prepare(" detail.numericvalue <> %f ", $this->Value);
            case '=':
                return $wpdb->prepare(" detail.numericvalue =%f ", $this->Value);
            case '>':
                return $wpdb->prepare(" detail.numericvalue >%f ", $this->Value);
            case '>=':
                return $wpdb->prepare(" detail.numericvalue >=%f ", $this->Value);
            case '<':
                return $wpdb->prepare(" detail.numericvalue < %f ", $this->Value);
            case '<=':
                return $wpdb->prepare(" detail.numericvalue <=%f ", $this->Value);
        }
    }
}
