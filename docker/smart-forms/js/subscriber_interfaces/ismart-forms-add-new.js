
function ISmartFormsAddNew()
{
    this.FormElements=null;
    ISmartFormsAddNew.prototype.Subscribers.push(this);
}
ISmartFormsAddNew.prototype.Subscribers=[];

/************************************************************************************* Events ***************************************************************************************************/
ISmartFormsAddNew.prototype.OnLoadComplete=function()
{
    return null;
};

ISmartFormsAddNew.prototype.TabActivated=function(tabId)
{
    return null;
};



/************************************************************************************* Save Data ***************************************************************************************************/
ISmartFormsAddNew.prototype.GetSaveDataId=function()
{
    return null;
};

ISmartFormsAddNew.prototype.GetClientDataToSave=function()
{
    return null;
};

ISmartFormsAddNew.prototype.GetServerDataToSave=function()
{
    return null;
};

//noinspection JSUnusedLocalSymbols
ISmartFormsAddNew.prototype.LoadSavedData=function(savedData)
{
    return null;
};
