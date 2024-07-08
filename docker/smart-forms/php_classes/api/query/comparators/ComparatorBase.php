<?php


abstract class  ComparatorBase
{
    public $Value;
    public $Comparator;
    public $Field;

    public function Initialize($field,$comparator,$value){
        $this->Value=$value;
        $this->Comparator=trim($comparator);
        $this->Field=$field;

        $this->Validate();
    }

    public abstract function GetConditionString();
    protected abstract function Validate();
}

class ComparatorFactory
{
    public static function GetComparator($className)
    {
        switch($className){
            case 'rednaocurrency':
            case 'rednaonumber':
                require_once SMART_FORMS_DIR.'php_classes/api/query/comparators/NumberComparator.php';
                return new NumberComparator();
            case 'rednaomultiplecheckboxes':
            case 'rednaosearchablelist':
            case 'rednaoselectbasic':
            case 'rednaomultipleradios':
                require_once SMART_FORMS_DIR.'php_classes/api/query/comparators/MultipleOptionsComparator.php';
                return new MultipleOptionsComparator();
            case 'rednaodatepicker':
                require_once SMART_FORMS_DIR.'php_classes/api/query/comparators/DateComparator.php';
                return new DateComparator();
            default:
                require_once SMART_FORMS_DIR.'php_classes/api/query/comparators/TextComparator.php';
                return new TextComparator();
        }
    }
}