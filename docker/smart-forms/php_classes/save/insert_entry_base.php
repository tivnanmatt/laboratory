<?php


class InsertEntryBase {
    public $FormId;
    public $FormEntryData;
    public $FormOptions;
    public $ElementOptions;
    public $AdditionalData;
    protected $_StringBuilder;
    /**
     * @var InsertEntryActionBase[] array
     */
    private $_actions=array();

    public function __construct(&$formId,&$formEntryData,&$formOptions,&$elementOptions,&$additionalData)
    {
        $this->FormId = $formId;
        $this->FormEntryData=$formEntryData;
        $this->FormOptions=$formOptions;
        $this->ElementOptions=$elementOptions;
        $this->AdditionalData=$additionalData;
        $this->_StringBuilder=null;
    }

    public function GetSerializedActions()
    {
        $actionData=array();
        foreach($this->_actions as $action)
        {
            array_push($actionData,$action->GetSerializedData());
        }
        return $actionData;
    }

    public function GetExtensionInfo($extensionId)
    {
        if(isset($this->FormOptions["Extensions"][$extensionId]))
            return $this->FormOptions["Extensions"][$extensionId];
        else
            return null;
    }

    public function GetField($fieldId)
    {
        foreach($this->ElementOptions as $field)
            if($field["Id"]==$fieldId)
                return $field;

        throw new Exception("Invalid field ".$fieldId);
    }

    public function GetFieldEntryData($fieldId)
    {
        foreach($this->FormEntryData as $key=>$value)
            if($key==$fieldId)
                return $value;

        throw new Exception("Invalid field ".$fieldId);
    }

    public function AddAction($action)
    {
        array_push($this->_actions,$action);
    }

    protected function GetStringBuilder()
    {
        if($this->_StringBuilder==null)
        {
            include_once(SMART_FORMS_DIR.'string_renderer/rednao_string_builder.php');
            $this->_StringBuilder=new rednao_string_builder();
        }

        return $this->_StringBuilder;
    }

    public function GetFieldValue($fieldId,$serializationType=0)
    {
        if($serializationType==SFSerializationType::TEXT)
            return $this->GetStringBuilder()->GetStringFromColumn($this->GetField($fieldId),$this->GetFieldEntryData($fieldId));
        if($serializationType==SFSerializationType::DATE)
            return $this->GetStringBuilder()->GetDateValue($this->GetField($fieldId),$this->GetFieldEntryData($fieldId));
        if($serializationType==SFSerializationType::ARRAYLIST)
            return $this->GetStringBuilder()->GetListValue($this->GetField($fieldId),$this->GetFieldEntryData($fieldId));

        throw new Exception('Invalid Serialization Type');
    }

}

abstract class SFSerializationType{
    const TEXT=0;
    const DATE=1;
    const ARRAYLIST=2;
}


class InsertEntryActionBase
{
    public $Action="";
    public $Value=Array();

    public function GetSerializedData()
    {
        return Array(
            "Action"=>$this->Action,
            "Value"=>$this->Value
        );
    }

}

class ShowMessageInsertEntryAction extends InsertEntryActionBase{
    /**
     * @var
     */

    public function __construct($message)
    {
        $this->_message = $message;
        $this->Action="ShowMessage";
        $this->Value["Message"]=$message;
    }


}

class RedirectToInsertEntryAction extends InsertEntryActionBase{
    /**
     * @var
     */

    public function __construct($url)
    {
        $this->Action="RedirectTo";
        $this->Value=$url;
    }


}

class CustomActionEntryAction extends InsertEntryActionBase{
    public function __construct($action,$value)
    {
        $this->Action=$action;
        $this->Value=$value;
    }

}