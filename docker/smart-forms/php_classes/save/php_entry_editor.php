<?php
require_once SMART_FORMS_DIR.'php_classes/edit/pre_edit_entry.php';

class php_entry_editor
{
    function execute_editor($entryId,$entryData,$elementOptions)
    {
        global $wpdb;
        $entry=new PreEditEntry($entryId,$entryData,$elementOptions);
        do_action('smart_forms_before_editing_entry',array($entry));
        $result= $wpdb->update(
            SMART_FORMS_ENTRY,
            array(
                'data'=>$entryData,
            ),
            array(
                'entry_id'=>$entryId
            )
        );

        if($result==false)
            return true;

        $entryData=json_decode($entryData,true);

        $entryData["_formid"]=$entryId;
        $result=$this->ParseAndInsertDetail($entryId,$entryData,$this->GetFormElementsDictionary($elementOptions));
        return $result;
    }

    public function GetFormElementsDictionary($elementOptions)
    {
        $elements=json_decode($elementOptions,true);
        $formElementsDictionary =array();
        foreach($elements as $element)
            $formElementsDictionary[$element["Id"]]=$element;

        return $formElementsDictionary;
    }


    function ParseAndInsertDetail($entryId,$entryData,$formElementsDictionary)
    {
        include_once(SMART_FORMS_DIR.'string_renderer/rednao_string_builder.php');
        include_once(SMART_FORMS_DIR.'smart-forms-ajax.php');
        $stringBuilder=new rednao_string_builder();
        global $wpdb;
        $wpdb->delete(SMART_FORMS_ENTRY_DETAIL, array('entry_id' => $entryId));
        foreach($entryData as $key=>$unprocessedValue)
        {
            if(!isset($formElementsDictionary[$key]))
                continue;

            $fieldConfiguration=$formElementsDictionary[$key];
            $value=$stringBuilder->GetStringFromColumn($fieldConfiguration,$unprocessedValue);
            $exValue=$stringBuilder->GetExValue($fieldConfiguration,$unprocessedValue);
            $dateValue=$stringBuilder->GetDateValue($fieldConfiguration,$unprocessedValue);
            if($dateValue!=null)
                $dateValue=date('Y-m-d',$dateValue);
            $jsonValue=json_encode($unprocessedValue);
            if(!$this->InsertDetailRecord($entryId,$key,$value,$jsonValue,$exValue,$dateValue))
                return true;
        }

        return true;
    }

    function InsertDetailRecord($entry_id, $fieldId, $value, $jsonValue,$exValue,$dateValue)
    {
        global $wpdb;
        $arrayToInsert=array_merge(array(
            "entry_id"=>$entry_id,
            "field_id"=>$fieldId,
            "json_value"=>$jsonValue,
            "value"=>$value
        ),$exValue);

        if($dateValue!=null)
            $arrayToInsert["datevalue"]=$dateValue;
        return $wpdb->insert(SMART_FORMS_ENTRY_DETAIL,$arrayToInsert);
    }
}