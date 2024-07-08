<?php
class PreInsertEntry extends InsertEntryBase{

    Public $ContinueInsertion=true;

    public function __construct(&$formId,&$formEntryData,&$formOptions,&$elementOptions,&$additionalData)
    {
        parent::__construct($formId,$formEntryData,$formOptions,$elementOptions,$additionalData);
    }






}