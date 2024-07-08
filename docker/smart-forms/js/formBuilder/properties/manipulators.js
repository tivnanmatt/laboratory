/************************************************************************************* Manipulstors ***************************************************************************************************/
function RedNaoBasicManipulator()
{

}

//noinspection JSUnusedLocalSymbols
RedNaoBasicManipulator.prototype.GetValue=function(propertiesObject,propertyName,additionalInformation)
{
    return propertiesObject[propertyName];
};

RedNaoBasicManipulator.prototype.SetValue=function(propertiesObject,propertyName,value,additionalInformation)
{
    var oldValue= propertiesObject[propertyName];
    propertiesObject[propertyName]=value;
    if (typeof additionalInformation != 'undefined' && typeof additionalInformation.ChangeCallBack != 'undefined')
        additionalInformation.ChangeCallBack(value,oldValue);
};





var RedNaoBasicManipulatorInstance=new RedNaoBasicManipulator();
