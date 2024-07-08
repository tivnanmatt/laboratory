<?php
abstract class php_entry_editor_base{
    public $entryId;
    private $newEntryData;
    private $oldEntryData=null;
    public $elementOptions;

    private $formId=null;

    public function __construct($entryId, $entryData, $elementOptions)
    {
        $this->entryId = $entryId;
        $this->newEntryData = $entryData;
        $this->elementOptions = $elementOptions;
    }

    public function GetNewEntryData($format){
        if($format=='string')
            return $this->newEntryData;

        if($format=='raw')
            return json_decode($this->newEntryData,true);
        throw new Exception('Undefined format');
    }

    public function GetOldEntryData($format){
        global $wpdb;
        if($this->oldEntryData==null)
            $this->oldEntryData=$wpdb->get_var($wpdb->prepare('select data from '.SMART_FORMS_ENTRY.' where entry_id=%d',$this->entryId));

        if($format=='string')
            return $this->oldEntryData;

        if($format=='raw')
            return json_decode($this->oldEntryData,true);

        throw new Exception('Undefined format');
    }

    public function GetFormId(){
        global $wpdb;
        if($this->formId==null)
            $this->formId=$wpdb->get_var($wpdb->prepare('select form_id from '.SMART_FORMS_ENTRY.' where entry_id=%d',$this->entryId));
        return $this->formId;
    }

}