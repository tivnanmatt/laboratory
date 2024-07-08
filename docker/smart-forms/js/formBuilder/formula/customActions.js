var smartFormsFormulaCustomActions=[];

function sfCustomActionBase(options)
{
    this.Label=options.Label;
    this.Type=options.Type;
    this.ToolTip=options.ToolTip;

}


/*-----------------------------------------------------------------------------------------------------Fixed Field-----------------------------------------------------------------------------------------------------------------------------------------*/
function sfCustomActionFixedField()
{
    var options={};
    options.Label="Round Amount";
    options.Type="text";
    options.ToolTip="Round an amount by a defined number of decimals \r\nExample: RNFRound( [rnfield1] + [rnfield2] , 2 )";

    sfCustomActionBase.call(this,options);
}
sfCustomActionFixedField.prototype=Object.create(sfCustomActionBase.prototype);

sfCustomActionFixedField.prototype.GetText=function()
{
    return 'RNFRound(your_formula,number_of_decimals)';
};


smartFormsFormulaCustomActions.push(new sfCustomActionFixedField());

/*-----------------------------------------------------------------------------------------------------If Condition-----------------------------------------------------------------------------------------------------------------------------------------*/
function sfCustomActionCondition()
{
    var options={};
    options.Label="Condition";
    options.Type="text";
    options.ToolTip="Create a condition, if the condition is true the 'trueValue' is shown otherwise the 'falseValue' is shown\r\nExample: RNIf([rnField1]>1 , 'rnfield1 is greater than 1' , 'rnfield1 is smaller than 1')'";

    sfCustomActionBase.call(this,options);
}
sfCustomActionCondition.prototype=Object.create(sfCustomActionBase.prototype);

sfCustomActionCondition.prototype.GetText=function()
{
    return 'RNIf(condition,trueValue,falseValue)';
};


smartFormsFormulaCustomActions.push(new sfCustomActionCondition());


/*-----------------------------------------------------------------------------------------------------If Condition-----------------------------------------------------------------------------------------------------------------------------------------*/
function sfCustomActionDateDiff()
{
    var options={};
    options.Label="Date difference";
    options.Type="text";
    options.ToolTip="Return the number of days between two dates";

    sfCustomActionBase.call(this,options);
}
sfCustomActionDateDiff.prototype=Object.create(sfCustomActionBase.prototype);

sfCustomActionDateDiff.prototype.GetText=function()
{
    return 'RNDateDiff(date1,date2)';
};


smartFormsFormulaCustomActions.push(new sfCustomActionDateDiff());


/*-----------------------------------------------------------------------------------------------------If Condition-----------------------------------------------------------------------------------------------------------------------------------------*/
function sfCustomActionMinutesDiff()
{
    var options={};
    options.Label="Minutes difference";
    options.Type="text";
    options.ToolTip="Return the number of minutes between two time pickers";

    sfCustomActionBase.call(this,options);
}
sfCustomActionMinutesDiff.prototype=Object.create(sfCustomActionMinutesDiff.prototype);

sfCustomActionMinutesDiff.prototype.GetText=function()
{
    return 'RNMinutesDiff(timePicker1,timePicker2)';
};


smartFormsFormulaCustomActions.push(new sfCustomActionMinutesDiff());







function sfCustomActionPMT()
{
    var options={};
    options.Label="PMT";
    options.Type="text";
    options.ToolTip="Similar to the excel function PMT";

    sfCustomActionBase.call(this,options);
}
sfCustomActionPMT.prototype=Object.create(sfCustomActionBase.prototype);

sfCustomActionPMT.prototype.GetText=function()
{
    return 'RNPMT(rate, nper, pv, fv, type)';
};


smartFormsFormulaCustomActions.push(new sfCustomActionPMT());





function sfCustomActionFV()
{
    var options={};
    options.Label="FV";
    options.Type="text";
    options.ToolTip="Similar to the excel function FV";

    sfCustomActionBase.call(this,options);
}
sfCustomActionFV.prototype=Object.create(sfCustomActionBase.prototype);

sfCustomActionFV.prototype.GetText=function()
{
    return 'RNFV(rate, nper, pmt, pv, type)';
};


smartFormsFormulaCustomActions.push(new sfCustomActionFV());





function sfCustomActionIPMT()
{
    var options={};
    options.Label="IPMT";
    options.Type="text";
    options.ToolTip="Similar to the excel function IPMT";

    sfCustomActionBase.call(this,options);
}
sfCustomActionIPMT.prototype=Object.create(sfCustomActionBase.prototype);

sfCustomActionIPMT.prototype.GetText=function()
{
    return 'RNIPMT(pv, pmt, rate, per)';
};


smartFormsFormulaCustomActions.push(new sfCustomActionIPMT());




function sfCustomActionPPMT()
{
    var options={};
    options.Label="PPMT";
    options.Type="text";
    options.ToolTip="Similar to the excel function PPMT";

    sfCustomActionBase.call(this,options);
}
sfCustomActionPPMT.prototype=Object.create(sfCustomActionBase.prototype);

sfCustomActionPPMT.prototype.GetText=function()
{
    return 'RNPPMT(rate, per, nper, pv, fv, type)';
};


smartFormsFormulaCustomActions.push(new sfCustomActionPPMT());




function sfCustomActionXNPV()
{
    var options={};
    options.Label="XNPV";
    options.Type="text";
    options.ToolTip="Similar to the excel function XNPV";

    sfCustomActionBase.call(this,options);
}
sfCustomActionXNPV.prototype=Object.create(sfCustomActionBase.prototype);

sfCustomActionXNPV.prototype.GetText=function()
{
    return 'RNXNPV(rate, values, dates)';
};


smartFormsFormulaCustomActions.push(new sfCustomActionXNPV());




function sfCustomActionXIRR()
{
    var options={};
    options.Label="XIRR";
    options.Type="text";
    options.ToolTip="Similar to the excel function XIRR";

    sfCustomActionBase.call(this,options);
}
sfCustomActionXIRR.prototype=Object.create(sfCustomActionBase.prototype);

sfCustomActionXIRR.prototype.GetText=function()
{
    return 'RNXIRR(values, guess)';
};


smartFormsFormulaCustomActions.push(new sfCustomActionXIRR());