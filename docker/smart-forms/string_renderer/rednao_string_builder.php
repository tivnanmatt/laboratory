<?php
/**
 * Created by PhpStorm.
 * User: edseventeen
 * Date: 11/28/13
 * Time: 9:33 PM
 */

class rednao_string_builder {

    public function __construct()
    {
        require_once(SMART_FORMS_DIR."string_renderer/rednao_base_elements_renderer.php");

    }

	public function GetElementRenderer($formElement)
	{

		switch($formElement["ClassName"])
		{
			case "rednaotextinput":
			case "rednaoprependedtext":
			case "rednaoappendedtext":
			case "rednaoemail":
				return $renderer=$this->GetRenderer("rednao_text_input_renderer");
				break;
			case "rednaoprependedcheckbox":
			case "rednaoappendedcheckbox":
			 	return $renderer=$this->GetRenderer("rednao_checkbox_input_renderer");
				break;

			case "rednaotextarea":
				return $renderer=$this->GetRenderer("rednao_text_area_renderer");
				break;

			case "rednaomultipleradios":
				return $renderer=$this->GetRenderer("rednao_radio_renderer");
				break;

			case "rednaomultiplecheckboxes":
				return $renderer=$this->GetRenderer("rednao_checkbox_renderer");
				break;
            case "rednaosearchablelist":
                return $renderer=$this->GetRenderer("rednao_checkbox_renderer");
                break;
            case "rednaoimagepicker":
                return $renderer=$this->GetRenderer("rednao_image_picker_renderer");
                break;
			case "rednaoselectbasic":
				return $renderer=$this->GetRenderer("rednao_select_renderer");
				break;

			case "rednaoname":
				return $renderer=$this->GetRenderer("rednao_name_renderer");
				break;
			case "rednaoaddress":
				return $renderer=$this->GetRenderer("rednao_address_renderer");
				break;
			case "rednaophone":
				return $renderer=$this->GetRenderer("rednao_phone_renderer");
				break;
			case "rednaodonationrecurrence":
				return $renderer=$this->GetRenderer("rednao_donation_recurrence");
				break;
			case "sfFileUpload":
                return $renderer=$this->GetRenderer("rednao_file_upload");
                break;
            case "rednaoimageupload":
                return $renderer=$this->GetRenderer("rednao_image_upload");
				break;
			case "rednaodatepicker":
				return $renderer=$this->GetRenderer("rednao_date_picker_renderer");
				break;
            case "rednaosurveytable":
                return $renderer=$this->GetRenderer("rednao_survey_table_renderer");
                break;
            case "rednaosignature":
                return $renderer=$this->GetRenderer("rednao_signature_renderer");
                break;
            case "rednaorepeater":
                return $renderer=$this->GetRenderer("rednao_repeater_renderer");
                break;
            case "rednaonumber":
            case 'rednaocurrency':
                return $renderer=$this->GetRenderer("rednao_number_renderer");
                break;
			default:
				return $renderer=$this->GetRenderer("rednao_text_input_renderer");
				break;

		}
	}
    public function  GetStringFromColumn($formElement,$entry,$entryId=''){
		$renderer=$this->GetElementRenderer($formElement);
		/** @noinspection PhpUndefinedMethodInspection */
		return $renderer->GetString($formElement,$entry,$entryId);
    }

    public function  GetPlainFromColumn($formElement,$entry){
        $renderer=$this->GetElementRenderer($formElement);
        /** @noinspection PhpUndefinedMethodInspection */
        return $renderer->GetPlain($formElement,$entry);
    }
	public function  GetExValue($formElement,$entry){
		$renderer=$this->GetElementRenderer($formElement);
		/** @noinspection PhpUndefinedMethodInspection */
		return $renderer->GetExValues($formElement,$entry);
	}

    public function GetRenderer($rendererName)
    {
        require_once(SMART_FORMS_DIR."string_renderer/$rendererName.php");

        if(!isset($this->$rendererName))
            $this->$rendererName=new $rendererName();

        return $this->$rendererName;
    }

	public function GetDateValue($formElement,$entry)
	{
		$renderer=$this->GetElementRenderer($formElement);
		return $renderer->GetDateValue($formElement,$entry);
	}
	public function GetListValue($formElement,$entry)
	{
		$renderer=$this->GetElementRenderer($formElement);
		return $renderer->GetListValue($formElement,$entry);
	}



}