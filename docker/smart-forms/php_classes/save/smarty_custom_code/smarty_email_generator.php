<?php
/**
 * Created by PhpStorm.
 * User: Edgar
 * Date: 8/28/2017
 * Time: 6:44 AM
 */

class smarty_email_generator
{
    public $Smarty;

    function __construct(){
        require_once SMART_FORMS_DIR.'php_classes/smarty/Smarty.class.php';
        $this->Smarty = new Smarty();
        $this->Smarty->left_delimiter="{@";
        $this->Smarty->right_delimiter="@}";

    }

    public function AttemptToProcessEmailString($elementOptions,$EmailText, $matches,$entryData,$useTestData)
    {
        foreach($matches[1] as $match)
        {
            if(strpos(trim($match),'{')===0)
            {
                require_once SMART_FORMS_DIR.'php_classes/save/smarty_custom_code/wrappers/fixed_field_processor.php';
                $fixedFieldParameters=json_decode($match,true);
                $this->Smarty->assign($fixedFieldParameters["Op"],new fixed_field_processor($match,$entryData,$elementOptions,$useTestData));
                $EmailText=str_replace("[field $match]",'{@$'.$fixedFieldParameters["Op"].'@}',$EmailText);
            }else
            {
                $this->Smarty->assign($match, $this->GetFieldWrapper($elementOptions, $match, $entryData,$useTestData));
                $EmailText=str_replace("[field $match]",'{@$'.$match.'@}',$EmailText);
            }

        }

        $fieldPattern="/@}-&gt;RN(.*[^\\\\]'\\));/U";
        preg_match_all($fieldPattern,$EmailText, $arrowMatches, PREG_SET_ORDER);
        foreach($arrowMatches as $arrowMatch)
        {
            $EmailText=str_replace($arrowMatch[0],'->RN'.$arrowMatch[1].'@}',$EmailText);
        }

        $EmailText=str_replace('&nbsp;',' ',$EmailText);
        $processedString=$this->Smarty->fetch('eval:'.$EmailText);
        return $processedString;
    }

    private function GetFieldWrapper($elementOptions, $elementId,$entryData,$useTestData)
    {
        $stringBuilder=new rednao_string_builder();
        foreach($elementOptions as $element)
        {
            if($element["Id"]==$elementId)
            {
                require_once SMART_FORMS_DIR.'php_classes/save/smarty_custom_code/wrappers/basic_field_wrapper.php';

                if($element['ClassName']=='rednaosurveytable')
                {
                    require_once SMART_FORMS_DIR.'php_classes/save/smarty_custom_code/wrappers/summary_list_wrapper.php';
                    return new summary_list_wrapper($stringBuilder,$element,$entryData[$element['Id']],$useTestData);
                }
                if($element['ClassName']=='rednaomultiplecheckboxes'||$element['ClassName']=='rednaosearchablelist'||$element['ClassName']=='rednaoselectbasic'||$element['ClassName']=='rednaomultipleradios'||$element['ClassName']=='rednaoimagepicker')
                {
                    require_once SMART_FORMS_DIR.'php_classes/save/smarty_custom_code/wrappers/selectable_list_wrapper.php';
                    return new selectable_list_wrapper($stringBuilder,$element,$entryData[$element['Id']],$useTestData);
                }
                return new basic_field_wrapper($stringBuilder,$element,$entryData[$element['Id']],$useTestData);

            }
        }
        return '';
    }
}