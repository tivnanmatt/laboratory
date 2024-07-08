var smartFormsFormulaFixedValues=[];

function sfFixedValuesBase(options)
{
    this.Label=options.Label;
    this.Type=options.Type;
    this.ToolTip=options.ToolTip;

}


/*-----------------------------------------------------------------------------------------------------Fixed Field-----------------------------------------------------------------------------------------------------------------------------------------*/
function sfLoggedInUser()
{
    var options={};
    options.Label="User Name";
    options.Type="text";
    options.ToolTip="The logged in user";

    sfFixedValuesBase.call(this,options);
}
sfLoggedInUser.prototype=Object.create(sfFixedValuesBase.prototype);

sfLoggedInUser.prototype.GetText=function()
{
    return 'RNUserName()';
};

/*-----------------------------------------------------------------------------------------------------Fixed Field First Name-----------------------------------------------------------------------------------------------------------------------------------------*/
function sfFirstName()
{
    var options={};
    options.Label="First Name";
    options.Type="text";
    options.ToolTip="The first name of the logged in user";

    sfFixedValuesBase.call(this,options);
}
sfFirstName.prototype=Object.create(sfFixedValuesBase.prototype);

sfFirstName.prototype.GetText=function()
{
    return 'RNFirstName()';
};


/*-----------------------------------------------------------------------------------------------------Last Name Field-----------------------------------------------------------------------------------------------------------------------------------------*/
function sfLastName()
{
    var options={};
    options.Label="Last Name";
    options.Type="text";
    options.ToolTip="The last name of the logged in user";

    sfFixedValuesBase.call(this,options);
}
sfLastName.prototype=Object.create(sfFixedValuesBase.prototype);

sfLastName.prototype.GetText=function()
{
    return 'RNLastName()';
};


/*-----------------------------------------------------------------------------------------------------Fixed Field-----------------------------------------------------------------------------------------------------------------------------------------*/
function sfEmail()
{
    var options={};
    options.Label="Email";
    options.Type="text";
    options.ToolTip="The email of the logged in user";

    sfFixedValuesBase.call(this,options);
}
sfEmail.prototype=Object.create(sfFixedValuesBase.prototype);

sfEmail.prototype.GetText=function()
{
    return 'RNEmail()';
};



smartFormsFormulaFixedValues.push(new sfLoggedInUser());
smartFormsFormulaFixedValues.push(new sfFirstName());
smartFormsFormulaFixedValues.push(new sfLastName());
smartFormsFormulaFixedValues.push(new sfEmail());
