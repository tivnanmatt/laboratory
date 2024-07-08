<?php


class rednao_address_renderer extends rednao_base_elements_renderer {


    public function GetString($formElement,$entry,$entryId='')
    {
        $address="";
        if(isset($entry["streetAddress1"]))
            $this->AppendAddressComponent($address,$entry["streetAddress1"]);
        if(isset($entry["streetAddress2"]))
            $this->AppendAddressComponent($address,$entry["streetAddress2"]);
        if(isset($entry["city"]))
            $this->AppendAddressComponent($address,$entry["city"]);
        if(isset($entry["state"]))
            $this->AppendAddressComponent($address,$entry["state"]);
        if(isset($entry["zip"]))
            $this->AppendAddressComponent($address,$entry["zip"]);
        if(isset($entry["country"]))
            $this->AppendAddressComponent($address,$entry["country"]);

        return htmlspecialchars($address);
    }

    public function AppendAddressComponent(&$address, $component)
    {
        if($component=="")
            return $address;

        if($address=="")
            $address=$component;
        else
            $address.=", ".$component;

        return $address;

    }

	public function GetExValues($formElement, $entry)
	{
		return array(
			"exvalue1"=>htmlspecialchars($entry["streetAddress1"]),
			"exvalue2"=>htmlspecialchars($entry["streetAddress2"]),
			"exvalue3"=>htmlspecialchars($entry["city"]),
			"exvalue4"=>htmlspecialchars($entry["state"]),
			"exvalue5"=>htmlspecialchars($entry["zip"]),
			"exvalue6"=>htmlspecialchars($entry["country"])
		);
	}
}