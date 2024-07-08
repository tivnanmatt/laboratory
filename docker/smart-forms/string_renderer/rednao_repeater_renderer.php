<?php
/**
 * Created by PhpStorm.
 * User: edseventeen
 * Date: 11/28/13
 * Time: 8:59 PM
 */



class rednao_repeater_renderer extends  rednao_base_elements_renderer{


    public function GetString($formElement,$entry,$entryId='')
    {
        $values=$entry['value'];
        $IncludeItemNumber=$formElement['IncludeItemNumberInLabels']=='y';
        $text='';
        $stringBuilder=new rednao_string_builder();
        for($i=0;$i<count($values);$i++)
        {
            $row=$values[$i];
            $lineBreakAdded=false;
            foreach($row as $columnName=>$columnValue)
            {
                $fieldName=str_replace('_row_'.$i,'',$columnName);
                $fieldOptions=$this->GetFieldById($formElement['FieldOptions'],$fieldName);
                if($fieldOptions==null)
                    continue;

                $value=$stringBuilder->GetStringFromColumn($fieldOptions,$columnValue,$entryId='');
                if(trim($value)=='')
                    continue;

                if($text!='')
                    $text.="<br/>";

                $label=$fieldOptions['Label'];
                if($IncludeItemNumber)
                    $label.=' #'.($i+1);
                $text.="<strong>".htmlspecialchars($label).":</strong> ".$value;
            }

        }
        return apply_filters('smartforms_render_repeater',$text,$formElement,$entry);
    }

    public function GetPlain($formElement,$entry)
    {
        $values=$entry['value'];
        $IncludeItemNumber=$formElement['IncludeItemNumberInLabels']=='y';
        $text='';
        $stringBuilder=new rednao_string_builder();
        for($i=0;$i<count($values);$i++)
        {
            $row=$values[$i];
            $lineBreakAdded=false;
            foreach($row as $columnName=>$columnValue)
            {
                $fieldName=str_replace('_row_'.$i,'',$columnName);
                $fieldOptions=$this->GetFieldById($formElement['FieldOptions'],$fieldName);
                if($fieldOptions==null)
                    continue;

                $value=$stringBuilder->GetStringFromColumn($fieldOptions,$columnValue);
                if(trim($value)=='')
                    continue;

                if($text!='')
                    $text.=", ";


                $label=$fieldOptions['Label'];
                if($IncludeItemNumber)
                    $label.=' #'.($i+1);
                $text.=htmlspecialchars($label).':'.$value;
            }



        }
        return apply_filters('smartforms_render_repeater_plain',$text);
    }

    public function GetFieldById($fieldList,$fieldId){
        foreach($fieldList as $field)
        {
            if($field['Id']==$fieldId)
            {
                return $field;
            }
        }
        return null;
    }



    public function GetExValues($formElement, $entry)
    {
        return array(
            "exvalue1"=>$this->GetString($formElement,$entry),
            "exvalue2"=>"",
            "exvalue3"=>"",
            "exvalue4"=>"",
            "exvalue5"=>"",
            "exvalue6"=>""
        );
    }
}