class SFConditionDesigner {
    private Table: JQuery;
    private $Formula:JQuery;
    public Conditions: any[];
    public AllowJavascript:boolean=false;
    public Mode:ConditionDesignerMode="Builder";
    public $Designer:JQuery;



    constructor(private FormElements: sfFormElementBase<FieldOptions>[], public Options: any) {
        this.Table = null;
        this.Options = Options;
        this.Conditions = [];

        if(typeof this.Options.Mode=="undefined")
            this.Options.Mode="Builder";
    }

    public SetAllowJavascript(){
        this.AllowJavascript=true;
        return this;
    }


    public GetDesigner() {
        if (this.$Designer == null) {
            this.$Designer=rnJQuery(
                `<div style="width:100%">
                    <div style="width: 100%;" class="conditionalTab"></div>
                    <div style="width: 100%" class="conditionContainer">
                        <div class="conditionBuilderContainer" style="width;100%"></div>
                        <div class="conditionFormulaContainer" style="width;100%;display:none;">
                            <textarea  style="width: 100%;height:130px;cursor: pointer;" readonly="readonly" class="form-control formulaTextArea"></textarea>
                            <div>
                                <button class="formulaButton btn btn-primary" style="margin-top:1px;"><span class="fa fa-calculator"></span> Open Formula Editor</button>
                            </div>                            
                        </div>
                    </div>
                 </div>`);

            this.Table = rnJQuery("<table><tr>" +
                "<th>(</th>" +
                "<th>Field</th>" +
                "<th>Operation</th>" +
                "<th>Value</th>" +
                "<th>)</th>" +
                "<th>Join</th>" +
                "<th></th>" +
                "<th></th>" +
                "</tr></table>");
            this.$Designer.find('.formulaButton').click((e)=>{this.OpenFormulaEditor();e.preventDefault();});
            this.$Designer.find('.conditionBuilderContainer').append(this.Table);

            if (typeof this.Options.Conditions != 'undefined' && this.Options.Conditions.length > 0)
                this.FillDefaultValues();
            else
                this.CreateConditionalRow(null);

            if (this.AllowJavascript)
            {
                this.$Designer.find('.conditionalTab').append(
                    `<div style="width: 100%;">
                                <div style="width:100%;text-align: center;">
                                    <span class="conditionalMode conditionalBuilder conditionalSelected"  data-value="Builder"><span class="fa fa-wrench"></span> Condition Builder</span>
                                    <span>|</span>
                                    <span  class="conditionalMode conditionalFormula" data-value="Formula"><span class="fa fa-calculator"></span> Formula</span>
                                </div>                                
                            </div>`
                );

                this.$Designer.find('.conditionalMode').click((e)=>{
                    this.SetMode(rnJQuery(e.currentTarget).data('value'));
                });

            }

            this.$Designer.find('.formulaTextArea').click(()=>{this.OpenFormulaEditor()});

        }

        this.SetMode(this.Options.Mode);
        return this.$Designer;


    };


    public FillDefaultValues() {
        let conditions = this.Options.Conditions;
        for (let i = 0; i < conditions.length; i++) {

            let row = this.CreateConditionalRow(conditions[i].Formula);

            let formElements = this.FormElements;
            for (let h = 0; h < formElements.length; h++)
                if (formElements[h].Id == conditions[i].Field)
                    row.find('.rnConditionField').val(h.toString()).change();

            row.find('.rnConditionOper').val(conditions[i].Op);
            row.find('.operType').val(conditions[i].OpType);
            if (typeof conditions[i].SerializationType != 'undefined')
                row.find('.serializationType').val(conditions[i].SerializationType);
            if (conditions[i].OpType == "date")
                row.find('.rnConditionVal').datepicker('setDate', conditions[i].Value);
            if (conditions[i].OpType == "text")
                row.find('.rnConditionVal').val(conditions[i].Value);
            else
                row.find('.rnConditionVal').select2('val', conditions[i].Value);

            if (conditions[i].IsOpeningPar == 'y')
                row.find('.leftPar').attr('checked', 'checked');

            if (conditions[i].IsClosingPar == 'y')
                row.find('.rightPar').attr('checked', 'checked');

            row.find('.conditionJoin').val(conditions[i].Join);

        }
        this.RefreshFormulaText();
    };

    public CreateConditionalRow(formulaOptions:ConditionFormulaOptions) {
        let condition = {};
        this.Conditions.push(condition);
        let row = rnJQuery('<tr class="sfConditionRow">' +
            '   <td><input class="leftPar" type="checkbox" name="condition' + this.Table.find('tr').length + '"/></td>' +
            '   <td><select class="rnConditionField" style="width: 130px;">' + this.GetFieldItems() + '</select></td>' +
            '   <td><select class="rnConditionOper" style="width: 100px;"></select><input type="hidden" class="operType"/><input type="hidden" class="serializationType"/></td>' +
            '   <td class="tdValue"><input class="rnConditionVal" type="text" style="width: 139px;"/></td>' +
            '   <td><input  class="rightPar" type="checkbox" name="condition' + this.Table.find('tr').length + '"/></td>' +
            '   <td><select class="conditionJoin"><option></option><option value="and">And</option><option value="or">Or</option></select></td>' +
            '   <td><button class="conditionAdd" value="+">+</button></td>' +
            (this.Table.find('tr').length > 1 ? '   <td><button class="conditionRemove" value="-">-</button></td>' : '') +
            '</tr>');

        let self = this;
        row.find('.leftPar').change(function () {
            if (rnJQuery(this).is(':checked'))
                row.find('.rightPar').removeAttr('checked');
        });

        row.find('.rightPar').change(function () {
            if (rnJQuery(this).is(':checked'))
                row.find('.leftPar').removeAttr('checked');
        });
        row.find('.conditionAdd').click(function (e) {
            e.preventDefault();
            if (row.find('.conditionJoin').val() == '')
                row.find('.conditionJoin').val('and');
            self.CreateConditionalRow(null)
        });
        row.find('.conditionRemove').click(function (e) {
            e.preventDefault();
            row.remove();
        });
        row.find('.rnConditionField').change(function () {
            self.FieldSelected(row, rnJQuery(this).val(), condition)
        });


        if (typeof formulaOptions == "undefined"||formulaOptions==null)
            formulaOptions={RowMode:"FixedValue"};
        row.data('ConditionFormulaOptions',formulaOptions);
        if(this.AllowJavascript)
        {
            this.AddFormulaButton(row);
        }
        this.Table.append(row);
        return row;
    };

    public FieldSelected(row, selectedField, condition) {
        row.find('.rnConditionOper').empty();
        if (selectedField == -1) {
            condition.Field = "";
            return;
        }

        selectedField = this.FormElements[selectedField];
        condition.Field = selectedField.Id;
        let options = "";
        if (selectedField.Options.ClassName == 'rednaodatepicker') {
            row.find('.operType').val('date');
            row.find('.serializationType').val('date');
            options =
                "<option value='eq'>equal</option>" +
                "<option value='neq'>not equal</option>" +
                "<option value='gt'>Greater than</option>" +
                "<option value='get'>Greater or equal than</option>" +
                "<option value='lt'>Less than</option>" +
                "<option value='let'>Less or equal than</option>";
            let datePicker = rnJQuery('<input class="rnConditionVal" type="text" style="width: 139px;"/>');
            row.find('.tdValue .rnConditionVal').remove();
            row.find('.tdValue').prepend(datePicker);
            datePicker.datepicker({
                dateFormat: 'yy-mm-dd',
                beforeShow: function () {
                    rnJQuery('#ui-datepicker-div').wrap('<div class="smartFormsSlider"></div>');
                },
                onClose: function () {
                    rnJQuery('#ui-datepicker-div').unwrap();
                }
            });
        } else if (typeof selectedField.Options.Options == 'undefined') {
            row.find('.operType').val('text');
            if (selectedField.Options.ClassName == "rednaodatepicker")
                row.find('.serializationType').val('date');
            else
                row.find('.serializationType').val('text');
            options =
                "<option value='eq'>equal</option>" +
                "<option value='neq'>not equal</option>" +
                "<option value='contains'>contains</option>" +
                "<option value='ncontains'>not contains</option>" +
                "<option value='gt'>Greater than</option>" +
                "<option value='get'>Greater or equal than</option>" +
                "<option value='lt'>Less than</option>" +
                "<option value='let'>Less or equal than</option>";
            /*+
                 "<option value='empty'>Is Empty</option>"+
                 "<option value='nempty'>Is Not Empty</option>"*/

            row.find('.tdValue .rnConditionVal').remove();
            row.find('.tdValue').prepend('<input class="rnConditionVal" type="text" style="width: 139px;"/>');
        } else {
            row.find('.operType').val('list');
            row.find('.serializationType').val('list');
            if (selectedField.Options.ClassName == "rednaomultiplecheckboxes")
                row.find('.serializationType').val('list');
            options = "<option value='contains'>contains</option>" +
                "<option value='ncontains'>not contains</option>"/*+
         "<option value='empty'>Is Empty</option>"+
         "<option value='nempty'>Is Not Empty</option>"*/;

            let fieldAvailableOptions = "";
            for (let i = 0; i < selectedField.Options.Options.length; i++) {
                fieldAvailableOptions += "<option value='" + RedNaoEscapeHtml(selectedField.Options.Options[i].label) + "'>" + RedNaoEscapeHtml(selectedField.Options.Options[i].label) + "</option>";
            }

            let select = rnJQuery('<select class="rnConditionVal" multiple="multiple" style="width: 139px;">' + fieldAvailableOptions + '</select>');
            row.find('.tdValue .rnConditionVal').remove();
            row.find('.tdValue').prepend(select);
            select.select2();
        }


        row.find('.rnConditionOper').append(options);
        this.UpdateValueFieldStatus(row);


    };


    public GetFieldItems() {
        let formElements = this.FormElements;
        let options = "<option value='-1'></option>";
        for (let i = 0; i < formElements.length; i++)
            if (formElements[i].StoresInformation()&&!formElements[i].IsHandledByAnotherField()&&!formElements[i].IsFieldContainer)
                options += "<option value='" + i.toString() + "'>" + formElements[i].GetFriendlyName() + "</option>";

        return options;
    };


    public CompileCondition(conditions) {
        conditions = this.GetRowsData();
        let conditionTxt = "";
        let header='';
        let footer='';
        let variableCount=0;
        for (let i = 0; i < conditions.length; i++) {
            let variableName=null;
            if(conditions[i].Formula.RowMode=="Formula")
            {
                variableName='result'+variableCount;
                let formula=conditions[i].Formula.Formula.CompiledFormula;
                if(formula.length>0&&formula[formula.length-1]==';')
                    formula=formula.substring(0,formula.length-1);
                header+=`${formula}.then(function(${variableName}){`;
                variableCount++;
                footer+='})';
            }
            let formElement = null;
            for (let h = 0; h < this.FormElements.length; h++) {
                if (this.FormElements[h].Id == conditions[i].Field)
                    formElement = this.FormElements[h];
            }
            if (formElement == null)
                continue;

            if (conditions[i].IsOpeningPar == 'y')
                conditionTxt += '(';

            if (conditions[i].OpType == 'list') {

                conditionTxt += (conditions[i].Op == "contains" ? "" : "!") + "RedNaoListContainsValue(" + (variableName!=null?variableName: JSON.stringify(conditions[i].Value)) + ",formData." + formElement.Id + ") ";

            } else {
                let amount = parseFloat(conditions[i].Value);
                if (isNaN(amount))
                    amount = 0;
                if (conditions[i].OpType == 'date') {
                    amount = rnJQuery.datepicker.parseDate('yy-mm-dd', conditions[i].Value).getTime();
                    if(variableName!=null)
                        amount=variableName;
                    switch (conditions[i].Op) {
                        case 'eq':
                            conditionTxt += formElement.GetNumericalValuePath() + "==" + amount.toString() + " && " + formElement.GetNumericalValuePath() + "!=0";
                            break;
                        case 'neq':
                            conditionTxt += formElement.GetNumericalValuePath() + "!=" + amount.toString();
                            break;
                        case 'gt':
                            conditionTxt += formElement.GetNumericalValuePath() + ">" + amount.toString() + " && " + formElement.GetNumericalValuePath() + "!=0";
                            break;
                        case 'get':
                            conditionTxt += formElement.GetNumericalValuePath() + ">=" + amount.toString() + " && " + formElement.GetNumericalValuePath() + "!=0";
                            break;
                        case 'lt':
                            conditionTxt += formElement.GetNumericalValuePath() + "<" + amount.toString() + " && " + formElement.GetNumericalValuePath() + "!=0";
                            break;
                        case 'let':
                            conditionTxt += formElement.GetNumericalValuePath() + "<=" + amount.toString() + " && " + formElement.GetNumericalValuePath() + "!=0";
                            break;
                    }
                } else {
                    let stringValue=conditions[i].Value.toLowerCase();
                    if(variableName!=null)
                    {
                        stringValue=variableName;
                        amount=variableName;
                    }else
                    {
                        stringValue="'"+stringValue+"'";
                    }
                    switch (conditions[i].Op) {
                        case 'eq':
                            conditionTxt += formElement.GetLabelPath() + ".toLowerCase()==" + stringValue + " ";
                            break;
                        case 'neq':
                            conditionTxt += formElement.GetLabelPath() + ".toLowerCase()!=" + stringValue + " ";
                            break;
                        case 'contains':
                            conditionTxt += formElement.GetLabelPath() + ".toLowerCase().indexOf(" + stringValue + ")>-1 ";
                            break;
                        case 'ncontains':
                            conditionTxt += formElement.GetLabelPath() + ".toLowerCase().indexOf(" + stringValue + ")==-1 ";
                            break;
                        case 'gt':
                            conditionTxt += formElement.GetNumericalValuePath() + ">" + amount.toString() + " ";
                            break;
                        case 'get':
                            conditionTxt += formElement.GetNumericalValuePath() + ">=" + amount.toString() + " ";
                            break;
                        case 'lt':
                            conditionTxt += formElement.GetNumericalValuePath() + "<" + amount.toString() + " ";
                            break;
                        case 'let':
                            conditionTxt += formElement.GetNumericalValuePath() + "<=" + amount.toString() + " ";
                            break;
                    }
                }
            }

            if (conditions[i].IsClosingPar == 'y')
                conditionTxt += ") ";

            if (conditions.length - 1 > i)
                conditionTxt += ' ' + (conditions[i].Join == 'and' ? '&&' : '||') + ' ';
        }

        return `new Promise(function(sfInternalResolve){
            ${header}
                sfInternalResolve(${conditionTxt});
            ${footer}
        });`;
        // alert(conditionTxt);

    };


    public IsValid() {
        if(this.Mode=="Formula")
            return true;
        let data = this.GetRowsData();

        let openPar = 0;
        let closePar = 0;

        for (let i = 0; i < data.length; i++) {
            if (data[i].Field.trim() == "" || data[i].Op.trim() == "" || data[i].OpType.trim() == "" || (data[i].OpType == "list" && data[i].Value.length <= 0 &&data[i].Formula.RowMode=="FixedValue") ||
                (i < (data[i].length - 1) && data[i].Join.trim() == ""&&data[i].Formula.RowMode=="FixedValue")) {
                alert('Please fill all fields');
                return false;
            }

            if (data[i].IsOpeningPar == 'y')
                openPar++;

            if (data[i].IsClosingPar == 'y') {
                if (closePar >= openPar) {
                    alert('You are closing one parenthesis when there is no open parenthesis');
                    return false;
                }
                closePar++;
            }
        }

        if (openPar != closePar) {
            alert('The open parenthesis count doesn\'t match the close parenthesis count');
            return false;
        }

        return true;


    };

    public GetRowsData() {
        let rows = this.Table.find('.sfConditionRow');

        let data = [];
        for (let i = 0; i < rows.length; i++) {
            let row = rnJQuery(rows[i]);
            data.push(
                {
                    Field: (row.find('.rnConditionField').val() >= 0 ? this.FormElements[row.find('.rnConditionField').val()].Id : ""),
                    Op: row.find('.rnConditionOper').val(),
                    OpType: row.find('.operType').val(),
                    Value: (row.find('.operType').val() == 'list' ? row.find('.rnConditionVal').select2('val') : row.find('.rnConditionVal').val()),
                    IsOpeningPar: (row.find('.leftPar').is(':checked') ? 'y' : 'n'),
                    IsClosingPar: (row.find('.rightPar').is(':checked') ? 'y' : 'n'),
                    Join: row.find('.conditionJoin').val(),
                    SerializationType: row.find('.serializationType').val(),
                    Formula:rnJQuery(rows[i]).data('ConditionFormulaOptions')
                }
            );
        }
        return data;
    };

    public GetData() {
        let rowData = this.GetRowsData();
        return {
            Conditions: rowData,
            CompiledCondition: this.CompileCondition(rowData)
        }
    }

    private AddFormulaButton($row: JQuery) {
        let $img=rnJQuery(`<img style="width: 15px;height: 20px;vertical-align: top;margin:2px 0 0 2px;cursor: pointer;"></img>`);

        $row.find('.tdValue').append($img);

        let conditionOptions:ConditionFormulaOptions=$row.data('ConditionFormulaOptions');
        if(conditionOptions.RowMode=="Formula")
            $img.attr('src',smartFormsRootPath+'images/formula_used.png');
        else
            $img.attr('src',smartFormsRootPath+'images/formula.png');
        $img.click(()=>{
            RedNaoFormulaWindowVar.OpenFormulaEditor(SmartFormsAddNewVar.FormBuilder.RedNaoFormElements,{'Formulas':conditionOptions},'Formula',{},$img,(formula:FormulaData)=>{
                if(typeof conditionOptions.Formula=="undefined")
                    this.SetRowMode($row,"FixedValue");
                else {
                    this.SetRowMode($row, "Formula");
                    this.UpdatePlaceholderWithFormula($row);
                }
            });
        });
    }

    public SetRowMode($row:JQuery,mode:ConditionRowMode){
        let conditionFormulaRowOption:ConditionFormulaOptions=$row.data('ConditionFormulaOptions');
        if(conditionFormulaRowOption.RowMode==mode)
            return;

        conditionFormulaRowOption.RowMode=mode;
        this.UpdateValueFieldStatus($row);
    }


    private UpdateValueFieldStatus($row: JQuery) {
        let conditionRowOption:ConditionFormulaOptions=$row.data('ConditionFormulaOptions');
        if(conditionRowOption.RowMode=="Formula") {
            $row.find('.rnConditionVal ').attr('disabled', 'disabled');
            $row.find('.rnConditionVal ').css('background-color','#eee');
            $row.find('.rnConditionVal ').css('border-color','#ccc');
            $row.find('.rnConditionVal ').val('');

            if($row.find('.rnConditionVal ').is('select')) {
                $row.find('.rnConditionVal ').val('');
            }

        }else{
            $row.find('.rnConditionVal ').removeAttr('disabled');
            $row.find('.rnConditionVal ').css('background-color','');
            $row.find('.rnConditionVal ').css('border-color','');
            $row.find('.rnConditionVal ').val('');
            $row.find('.rnConditionVal ').attr('placeholder','');
            $row.find('.rnConditionVal').data('placeholder','');
            $row.find('select.rnConditionVal').select2();

        }
        this.UpdatePlaceholderWithFormula($row);
    }

    private UpdatePlaceholderWithFormula($row:JQuery) {
        let conditionRowOption:ConditionFormulaOptions=$row.data('ConditionFormulaOptions');
        let formula='';
        if(conditionRowOption.RowMode=="Formula")
            formula=this.GetFriendlyFormula(conditionRowOption.Formula.Value);
        $row.find('.rnConditionVal ').attr('placeholder',formula);
        if($row.find('.rnConditionVal ').is('select')) {
            $row.find('.rnConditionVal').data('placeholder',formula);
            $row.find('select.rnConditionVal').select2();
        }
    }

    private GetFriendlyFormula(formula:string){
        let re=/\[field ([^\]]*)\]/g;
        let m;
        while(m=re.exec(formula))
        {
            let label=m[1];
            for(let formElement of this.FormElements)
            {
                if(formElement.Id==m[1])
                {
                    label=formElement.Options.Label.trim();
                    if(label=='')
                        label=formElement.Id;


                }
            }
            formula=formula.replace(m[0],'['+label+']');
            re.lastIndex=0;
            //text=text.replace(,this.CreateFieldTag(label,id));

        }

        return formula;
    }

    private async SetMode(mode: ConditionDesignerMode) {
        if(this.Mode==mode)
            return;
        this.Options.Mode=mode;
        this.$Designer.find('.conditionalMode.conditionalSelected').removeClass('conditionalSelected');
        this.$Designer.find('.conditional'+mode).addClass('conditionalSelected');
        this.Mode=mode;
        if(this.Mode=="Formula")
        {
            this.SwitchContainer(this.$Designer.find('.conditionFormulaContainer'),this.$Designer.find('.conditionBuilderContainer'));
            if(typeof this.Options.Formula=="undefined"||typeof this.Options.Formula.Value=="undefined"||this.Options.Formula.Value.trim()=='')
                this.OpenFormulaEditor();

        }else{
            this.SwitchContainer(this.$Designer.find('.conditionBuilderContainer'),this.$Designer.find('.conditionFormulaContainer'));
            this.Table.velocityAsync({opacity:1},200,"easeInExp");
        }

    }

    private async SwitchContainer($containerToShow: JQuery, $containerToHide: JQuery) {
        await $containerToHide.velocityAsync({opacity:0},200,"easeOutExp");

        let $conditionContainer=this.$Designer.find('.conditionContainer');
        let previousHeight=$conditionContainer.outerHeight()+'px';
        $containerToHide.css('display','none');

        $containerToShow.css({opacity:0,display:'block'});
        let newHeight=$containerToShow.outerHeight()+'px';
        $containerToShow.height(0);

        (rnJQuery as any).Velocity.hook($containerToShow,'height',0);
        (rnJQuery as any).Velocity.hook($conditionContainer,'height',previousHeight);
        $containerToShow.velocityAsync({height:[0,newHeight],opacity:1},200,"easeInExp");
        await $conditionContainer.velocityAsync({height:[newHeight,previousHeight]},200,"easeInExp")

        $containerToShow.css('height','');
        $conditionContainer.css('height','');
    }

    private OpenFormulaEditor() {
        RedNaoFormulaWindowVar.OpenFormulaEditor(SmartFormsAddNewVar.FormBuilder.RedNaoFormElements,{'Formulas':this.Options},'Formula',{},rnJQuery('<img></img>'),(formula:FormulaData)=>{
            this.RefreshFormulaText();
        });
    }

    private RefreshFormulaText() {
        if(typeof this.Options.Formula=="undefined"||typeof this.Options.Formula.Value=="undefined")
            this.$Designer.find('.formulaTextArea').val('');
        else
            this.$Designer.find('.formulaTextArea').val(this.GetFriendlyFormula(this.Options.Formula.Value));

    }
}

declare let RedNaoFormulaWindowVar;
interface ConditionFormulaOptions{

        RowMode:ConditionRowMode;
        Formula?:FormulaData;

}



type ConditionDesignerMode='Builder'|'Formula';
type ConditionRowMode='Formula'|'FixedValue';