<?php
if(!defined('ABSPATH'))
	die('Forbidden');

if(!current_user_can('manage_options'))
	die('Forbidden');

class SmartFormsDetailGenerator
{
	private $EntrySaver=null;

	public function __construct()
	{
		include_once(SMART_FORMS_DIR.'php_classes/save/php_entry_saver_base.php');
		$this->EntrySaver=new php_entry_saver_base("","","");
	}

	private function SendError($message)
	{
		echo json_encode(array(
			"success"=>"n",
			"error"=>$message
		));

	}


	public function Process()
	{
		$formsDictionary=null;
		$entries=null;
		try{
			$this->ClearDetailTable();
			$formsDictionary=$this->GetFormsDictionary();
			$entries=$this->GetEntriesData();

		}catch(Exception $ex)
		{
			$this->SendError($ex->getMessage());
			return;
		}

		foreach($entries as $row)
		{
			$entryFields=null;
			$entryFields=json_decode($row->data,true);
			if($entryFields==null)
			{
				$this->SendError("Could not decode json:".$entries->data);
				return;
			}

			if(!isset($formsDictionary[$row->form_id]))
				continue;
			$formElementsDictionary=$formsDictionary[$row->form_id];
			if(!$this->EntrySaver->ParseAndInsertDetail($row->entry_id,$entryFields,$formElementsDictionary))
			{
				$this->SendError("Couldn't insert detail record");
				return;
			}
		}

        update_site_option('SMART_FORMS_REQUIRE_DB_DETAIL_GENERATION','n');

		echo json_encode(array(
			"success"=>"y",
			"error"=>""
		));

	}

	private function GetFormsDictionary()
	{
		global $wpdb;
		/** @noinspection PhpUndefinedMethodInspection */
		$results=$wpdb->get_results("select form_id,element_options from ".SMART_FORMS_TABLE_NAME);
		if(is_wp_error($results))
			throw new Exception("Error getting form information");

		$formDictionary=array();
		foreach($results as $formData)
		{
			$decodedForm=json_decode($formData->element_options,true);
			$indexedFormArray=array();
			foreach($decodedForm as $formElement)
				$indexedFormArray[$formElement["Id"]]=$formElement;

			if($decodedForm==null)
				throw new Exception("Couldn't parse form ".$formData->form_id);
			$formDictionary[$formData->form_id]=$indexedFormArray;
		}

		return $formDictionary;

	}

	private function ClearDetailTable()
	{
		global $wpdb;
		/** @noinspection PhpUndefinedMethodInspection */
		if(!$wpdb->query("TRUNCATE TABLE ".SMART_FORMS_ENTRY_DETAIL))
			throw new Exception("Error truncating index table");

	}

	private function GetEntriesData()
	{
		global $wpdb;
		/** @noinspection PhpUndefinedMethodInspection */
		$result=$wpdb->get_results("select entry_id,form_id, data from ".SMART_FORMS_ENTRY. " order by form_id");
		if(is_wp_error($result))
			throw new Exception("Error getting entries information");
		return $result;
	}


}


$generator=new SmartFormsDetailGenerator();
$generator->Process();
die();