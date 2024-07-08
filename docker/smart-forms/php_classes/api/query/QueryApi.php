<?php

require_once 'WhereClause.php';
class SmartFormsQuery
{
    private $formId;
    public $selectColumns;
    public $fieldDictionary;

    /**
     * @var WhereClause[]
     */
    private $conditions;
    private $orderByColumns;

    public function __construct($formId)
    {
        $this->formId=$formId;
        $this->selectColumns=array();
        $this->conditions=array();
        $this->fieldDictionary=$this->GetFormDictionary();
    }

    public function StoresInformation($formelement)
    {
        switch($formelement["ClassName"])
        {
            case "rednaotextinput":
            case 'rednaorating':
            case "rednaoprependedtext":
            case "rednaoappendedtext":
            case "rednaoemail":
            case "rednaoprependedcheckbox":
            case "rednaoappendedcheckbox":
            case "rednaotextarea":
            case "rednaomultipleradios":
            case 'rednaomultiplecheckboxes':
            case "rednaosearchablelist":
            case "rednaoimagepicker":
            case "rednaoselectbasic":
            case "rednaoname":
            case "rednaoaddress":
            case "rednaophone":
            case "rednaodonationrecurrence":
            case "sfFileUpload":
            case "rednaoimageupload":
            case "rednaodatepicker":
            case "rednaosurveytable":
            case "rednaosignature":
            case "rednaorepeater":
            case "rednaonumber":
            case 'rednaocurrency':
            case 'rednaotimepicker':
                return true;

        }

        return false;
    }

    public function AddField($fieldId)
    {
        if(!isset($this->fieldDictionary[$fieldId]))
        {
            echo "Invalid field ".$fieldId;
            return;
        }
        array_push($this->selectColumns,$fieldId);
        return $this;
    }

    /**
     * @param $fieldList array
     */
    public function AddFields($fieldList){

        foreach($fieldList as $field)
            $this->AddField($field);
    }

    public function AddCondition($field,$comparison,$value,$join='and'){
        $whereCondition='';
        if(isset($this->fieldDictionary[$field]))
        {
            $whereCondition=new WhereClause($this->fieldDictionary[$field],$comparison,$value,$join);

        }else

        if($field=='_FormId'||$field=='_SFTimeStamp'||$field=='_UserId'||$field=='_Date')
        {
            $whereCondition=new WhereClause(array('ClassName'=>'','Id'=>$field),$comparison,$value,$join);
        }else{
            echo "Invalid field ".$field;
            return null;
        }

        $this->conditions[]=$whereCondition;
        return $whereCondition;


    }

    public function AddConditions($conditionList){
        for($i=0;$i<count($conditionList);$i++)
        {
            $whereClause=$this->AddCondition($conditionList[$i]['field'],$conditionList[$i]['comparison'],$conditionList[$i]['value']);
            if($i==0)
                $whereClause->openParentheses=true;
            if($i==count($conditionList)-1)
                $whereClause->closeParentheses=true;
            $this->conditions[]=$whereClause;
        }
    }

    public function GetResults($limit='',$skip='',$format='html'){
        if(count($this->selectColumns)==0)
        {
            $this->selectColumns[]='_Date';
            foreach($this->fieldDictionary as $field)
            {
                if($this->StoresInformation($field))
                {
                    $this->selectColumns[]=$field['Id'];
                }
            }
            $this->selectColumns[]='_UserName';
        }
        return $this->Execute('',$limit,$skip,$format);
    }

    public function GetRaw($limit='',$skip=''){
        return $this->Execute('parent.*',$limit,$skip);
    }

    public function GetCount(){
        $result=$this->Execute("count(*) count");
        if(count($result)==0)
            return null;
        return $result[0]['count'];
    }



    public function GetScalar(){
        $result=$this->Execute();
        if(count($result)==0)
            return null;
        return array_pop($result[0]);
    }

    private function Execute($columns='',$limit='',$skip='',$format='html'){
        $useDefault=false;
        if($columns=='')
        {
            $useDefault=true;
            $columns='data,date,entry_id,form_id';
        }
        global $wpdb;
        $params=array();
        $params[]=$this->formId;
        $conditionText="SELECT $columns,parent.ip user_ip, user.display_name user_name,user.ID user_id FROM ".SMART_FORMS_ENTRY." parent 
            left join ".$wpdb->users ." user on user.ID=parent.user_id where form_id=%d  ";


        if(count($this->conditions)>0)
        {

            foreach ($this->conditions as $condition)
            {
                $conditionText .=$condition->GetText();
            }
        }

        $conditionText.=' order by parent.date desc ';
        if($limit!=''&&$limit!=0)
        {
            $conditionText.=' limit '.$wpdb->prepare('%d',$limit);
        }

        if($skip!='')
        {
            $conditionText.=' offset '.$wpdb->prepare('%d',$skip);
        }

        $conditionText=$wpdb->prepare($conditionText,$params);
        $result=$wpdb->get_results($conditionText,'ARRAY_A');

        if($useDefault)
        {
            return $this->ProcessResult($result,$format);
        }else{
            return $result;
        }



    }

    protected  function GetFormDictionary()
    {
        global $wpdb;

        /** @noinspection PhpUndefinedMethodInspection */
        $result=$wpdb->get_results($wpdb->prepare("select element_options from ".SMART_FORMS_TABLE_NAME." where form_id=%d",$this->formId));
        if($result===false||count($result)==0)
            throw new Exception("Couldn't get form information");

        $formInfo=json_decode($result[0]->element_options,true);

        if($formInfo==null)
            throw new Exception("Couldn't get form information");

        /** @noinspection PhpIncludeInspection */
        include_once(SMART_FORMS_DIR.'string_renderer/rednao_string_builder.php');
        $StringBuilder=new rednao_string_builder();

        $formElementsDictionary =array();
        foreach($formInfo as $element)
        {
            $element["__renderer"]=$StringBuilder->GetElementRenderer($element);
            $formElementsDictionary[$element["Id"]]=$element;
        }

        return $formElementsDictionary;
    }

    private function ProcessResult($rows,$format)
    {
        $result=array();
        foreach($rows as $row)
        {
            $entryData=array();

            $values = json_decode($row['data'],true);
            foreach ($this->selectColumns as $fieldId)
            {
                include_once(SMART_FORMS_DIR . 'string_renderer/rednao_string_builder.php');
                $stringBuilder = new rednao_string_builder();
                if($fieldId=='_Date')
                {
                    $entryData['_Date']=$row['date'];
                    continue;
                }

                if($fieldId=='_UserName')
                {
                    $entryData['_UserName']=$row['user_name'];
                    continue;
                }
                $htmlValue='';
                $rawValue=null;
                $plainValue='';
                if(isset($values[$fieldId]))
                {
                    $htmlValue = $stringBuilder->GetStringFromColumn($this->fieldDictionary[$fieldId], $values[$fieldId]);
                    $plainValue=$stringBuilder->GetPlainFromColumn($this->fieldDictionary[$fieldId], $values[$fieldId]);
                    $rawValue=$values[$fieldId];
                }

                if($format=='html')
                    $entryData[$fieldId]=$htmlValue;
                else{
                    $entryData[$fieldId]=array(
                        'value'=>$htmlValue,
                        'raw'=>$rawValue,
                        'plain'=>$plainValue
                    );
                }

            }
            $result[]=$entryData;
        }

        return $result;
    }


}


