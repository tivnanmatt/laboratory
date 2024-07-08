<?php

class SFConditionParser {

    private $insertedEntryBase;


    /**
     * @param InsertEntryBase $insertedEntryBase
     * @return mixed
     */
    public function __construct($insertedEntryBase)
    {
        $this->insertedEntryBase = $insertedEntryBase;

    }

    public function IsTrue($conditionElements)
    {
        $statementIndex=0;
        array_unshift($conditionElements,array("IsOpeningPar"=>'y',"IsClosingPar"=>'n',"Op"=>"root"));
        array_push($conditionElements,array("IsOpeningPar"=>'n',"IsClosingPar"=>'y',"Op"=>"root"));
        return $this->EvaluateStatementInsideParentheses($statementIndex,$conditionElements);
    }


    private function EvaluateStatementInsideParentheses(&$statementIndex, $conditionElements)
    {
        $latestCondition=null;
        $latestEvaluation=null;
        for($i=$statementIndex;$i<count($conditionElements);$i++)
        {
            $childParenthesesWasEvaluated=false;
            $currentCondition=$conditionElements[$i];
            if($i!=$statementIndex&&$currentCondition["IsOpeningPar"]=='y')
            {
                $currentEvaluation = $this->EvaluateStatementInsideParentheses($i, $conditionElements);
                $childParenthesesWasEvaluated=true;
            }
            else{
                if($currentCondition["Op"]=="root")
                    continue;
                $currentEvaluation=$this->EvaluateCondition($currentCondition);
            }


            if($latestCondition!=null)
            {
                if($latestCondition["Join"]=='and')
                    $currentEvaluation=$latestEvaluation&&$currentEvaluation;
                else
                    $currentEvaluation=$latestEvaluation||$currentEvaluation;
            }

            $latestCondition=$conditionElements[$i];
            $latestEvaluation=$currentEvaluation;

            if($latestCondition["IsClosingPar"]=='y'&&$childParenthesesWasEvaluated==false)
            {
                $statementIndex=$i;
                return $currentEvaluation;
            }

        }

        return $latestEvaluation;
    }

    private function EvaluateCondition($currentCondition)
    {
        if($currentCondition["SerializationType"]=="text")
            return $this->EvaluateText($currentCondition);
        if($currentCondition["SerializationType"]=="date")
            return $this->EvaluateDate($currentCondition);
        if($currentCondition["SerializationType"]=="list")
            return $this->EvaluateList($currentCondition);

        throw new Exception('Invalid serialization type '.$currentCondition["SerializationType"]);

    }

    private function EvaluateText($currentCondition)
    {
        $conditionValue=trim($currentCondition["Value"]);
        $operationType=$currentCondition["Op"];
        $fieldValue=trim($this->insertedEntryBase->GetFieldValue($currentCondition["Field"],SFSerializationType::TEXT));
        switch($operationType)
        {
            case "eq":
                return strcasecmp($conditionValue,$fieldValue)==0;
            case "neq":
                return strcasecmp($conditionValue,$fieldValue)!=0;
            case "contains":
                return stripos ($fieldValue,$fieldValue)!==false;
            case "ncontains":
                return stripos ($fieldValue,$fieldValue)===false;
            case "gt":
                $numericCondition=intval($conditionValue);
                $numericFieldValue=intval($fieldValue);
                return $numericFieldValue>$numericCondition;
            case "get":
                $numericCondition=intval($conditionValue);
                $numericFieldValue=intval($fieldValue);
                return $numericFieldValue>=$numericCondition;
            case "lt":
                $numericCondition=intval($conditionValue);
                $numericFieldValue=intval($fieldValue);
                return $numericFieldValue<$numericCondition;
            case "let":
                $numericCondition=intval($conditionValue);
                $numericFieldValue=intval($fieldValue);
                return $numericFieldValue<=$numericCondition;
            default:
                throw new Exception("Invalid condition operation type");
        }
    }

    private function EvaluateDate($currentCondition)
    {
        $operationType=$currentCondition["Op"];
        $fieldValue=$this->insertedEntryBase->GetFieldValue($currentCondition["Field"],SFSerializationType::DATE);

        $conditionValue=trim($currentCondition["Value"]);
        $splitDate=explode("-",$conditionValue);

        $conditionValue= mktime(null,null,null,intval($splitDate[1]),intval($splitDate[2]),intval($splitDate[0]));

        switch($operationType)
        {
            case "eq":
                return $fieldValue==$conditionValue;
            case "neq":
                return $fieldValue!=$conditionValue;
            case "contains":
                return $fieldValue==$conditionValue;
            case "ncontains":
                return $fieldValue!=$conditionValue;
            case "gt":
                return $fieldValue>$conditionValue;
            case "get":
                return $fieldValue>=$conditionValue;
            case "lt":
                return $fieldValue<$conditionValue;
            case "let":
                return $fieldValue<=$conditionValue;
            default:
                throw new Exception("Invalid condition operation type");
        }
    }

    private function EvaluateList($currentCondition)
    {
        $operationType=$currentCondition["Op"];
        $fieldValues=$this->insertedEntryBase->GetFieldValue($currentCondition["Field"],SFSerializationType::ARRAYLIST);

        $conditionValues=$currentCondition["Value"];


        switch($operationType)
        {
            case "contains":
                foreach($fieldValues as $fieldValue)
                    foreach($conditionValues as $conditionValue)
                        if($fieldValue["label"]==$conditionValue)
                            return true;
                return false;
            case "ncontains":
                foreach($fieldValues as $fieldValue)
                    foreach($conditionValues as $conditionValue)
                        if($fieldValue["label"]==$conditionValue)
                            return false;
                return true;
            default:
                throw new Exception("Invalid condition operation type");
        }
    }


}