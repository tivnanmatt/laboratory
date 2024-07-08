
declare let FormulaCompiler;
declare let smartFormsFormulaCustomActions;
declare let smartFormsFormulaFixedValues;
declare let CodeMirror:any;
class RedNaoFormulaWindow {
    private FormElements: sfFormElementBase<any>[];
    private Image:any;
    private SelectedFormElementOptions: any;
    private AdditionalInformation: any;
    private PropertyName: string;
    private $Dialog:JQuery;
    private elementToShow:string='label';
    private codeMirror:any=null;
    private formulaText:string;
    private searchField:JQuery;
    private autoComplete:SfFormulaAutoComplete;
    private CloseCallback:()=>void;
    private MethodNames=['RNFRound','RNIf','RNDateDiff','Math','Remote','RNPMT','RNIPMT','RNPPMT','RNXNPV','RNXIRR','RNFV','RNMinutesDiff'];
    private FixedValues=['RNUserName','RNFirstName','RNLastName','RNEmail'];

    constructor() {
        //rnJQuery("#redNaoFormulaAccordion").accordion({clearStyle: true, autoHeight: false});
        this.autoComplete=new SfFormulaAutoComplete();
        this.$Dialog=rnJQuery(`<div class="modal fade" data-backdrop="static" data-keyboard="false" id="smartFormsFormulaBuilder" style="display: none;z-index:1000088 !important">
                                  <div class="modal-dialog" style=";width:720px;">
                                    <div class="modal-content">
                                      <div class="modal-header">
                                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                                        <h4 class="modal-title"><span class="fa fa-calculator" style="line-height: 18px;vertical-align: middle;font-size: 13px;"></span> <span style="line-height: 18px;vertical-align: middle;">Formula Builder</span></h4>
                                      </div>
                                      <div class="modal-body">
                                        <table style='width:100%;'>
                                            <tr>
                                                <td>                                                    
                                                    <textarea contenteditable="true" style="opacity:0;width:500px;min-height:300px;height: 100%; padding: 5px;" id="redNaoFormulaTextArea" placeholder="Here you can add arithmetical e.g. [field1]+[field2]."></textarea>
                                                    <a target="_blank" href="https://sfmanual.rednao.com/documentation/calculatedfields/creating-formulas/">Need help? check out the tutorials!</a>                                                    
                                                </td>
                                                <td style="vertical-align: top">
                                                    <div style="height: 300px;overflow: scroll;width:200px;overflow-x:hidden;">
                                                        <div style="width:100%;position:relative;">
                                                            <input type="text" id="sfFormulaSearch" style="height:30px;"/>
                                                            <span class="glyphicon glyphicon-search" style="color:#ccc;position: absolute;top: 10px;left: 10px;"></span>
                                                        </div> 
                                                        <div class="styleGroup">
                                                                <div class="sfStyleTitle">
                                                                    <h5>
                                                                        <a data-toggle="collapse" href="#fbFormulaFields" ><span class="sfAccordionIcon glyphicon glyphicon-chevron-right"></span>Form Fields</a>
                                                                    </h5>
                                                                </div>
                                                                <div class="sfStyleContainer collapse sfFormFields" style="padding:0;"  id="fbFormulaFields"><div class="list-group" id="fbFormulaFieldsList"></div><div class="clearer" style="clear:both;"></div></div>                                             
                                                         </div>
                                                         <div class="styleGroup">
                                                                <div class="sfStyleTitle">
                                                                    <h5>
                                                                        <a data-toggle="collapse" href="#fbCommonActions" class="collapsed"><span class="sfAccordionIcon glyphicon glyphicon-chevron-right"></span>Common Functions</a>
                                                                    </h5>
                                                                </div>
                                                                <div class="sfStyleContainer collapse sfCommonActions in" style="padding:0;"  id="fbCommonActions"><div class="list-group" id="fbCommonActionsList"></div><div class="clearer" style="clear:both;"></div></div>                                             
                                                         </div>
                                                          <div class="styleGroup">
                                                                <div class="sfStyleTitle">
                                                                    <h5>
                                                                        <a data-toggle="collapse" href="#fbFixedValues" class="collapsed"><span class="sfAccordionIcon glyphicon glyphicon-chevron-right"></span>Fixed Values</a>
                                                                    </h5>
                                                                </div>
                                                                <div class="sfStyleContainer collapse in sfFixedValues" style="padding:0;" id="fbFixedValues"><div class="list-group" id="fbFixedValuesList"></div><div class="clearer" style="clear:both;"></div></div>                                             
                                                         </div>    
                                                     </div>                                                 
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div> <input class="sfFormulaElementToShow" checked="checked" style="margin:0;padding:0" id="showName" type="radio" value="label"  name="elementToShow"><label style="margin:0;padding:0" for="showName">&nbsp;Show Label</label> <input class="sfFormulaElementToShow"  id="showId" style="margin:0;padding:0;margin-left:10px;" value="id" type="radio" name="elementToShow"> <label style="margin:0;padding:0" for="showId">&nbsp;Show Id</label>
                                                </td>
                                                <td style="text-align:right;">
                                                    <button class="btn btn-primary" onclick="RedNaoFormulaWindowVar.Validate();">Validate</button> 
                                                </td>
                                            </tr>
                                        </table>
                                      </div>                                    
                                    </div>
                                  </div>
                                </div>    
        `);
        let container=rnJQuery('<div class="bootstrap-wrapper"></div>');
        container.append(this.$Dialog);
        rnJQuery('body').append(container);
        container.find('.sfFormulaElementToShow').change(()=>{
           this.elementToShow= container.find('.sfFormulaElementToShow:checked').val();
           if(this.codeMirror!=null)
               this.codeMirror.setValue(this.codeMirror.getValue());
        });

        this.searchField=container.find('#sfFormulaSearch');
        this.searchField.click(function(){
            this.setSelectionRange(0, this.value.length);
        });
        this.searchField.keyup(()=>{
           this.ExecuteSearch();
        });


        container.on('shown.bs.modal',()=>{
            this.CreateCodeMirrorEditor();
        });
        container.on('hidden.bs.modal',()=>{
            this.Closing();
        });
        this.$Dialog.find('.sfStyleContainer').collapse();

        /*
        this.Dialog = rnJQuery("#redNaoFormulaComponent").dialog(
            {
                width: "720",
                resizable: false,
                height: "400",
                modal: true,
                autoOpen: false,
                create: function (event, ui) {
                    rnJQuery(event.target).closest('.ui-dialog').wrap('<div class="smartFormsSlider" />');
                },
                open: function (event, ui) {
                    rnJQuery('.ui-widget-overlay').wrap('<div class="smartFormsSlider" />');

                },
                beforeClose: function () {
                    var formula = rnJQuery('#redNaoFormulaTextArea').val();
                    if (formula == "") {
                        delete self.SelectedFormElementOptions.Formulas[self.PropertyName];
                        if (self.Image != null)
                            self.Image.attr('src', smartFormsRootPath + 'images/formula.png')
                    }
                    else {
                        var data = {};
                        data.Value = formula;
                        self.GetCompiledData(data, formula);
                        if (self.Image != null)
                            self.Image.attr('src', smartFormsRootPath + 'images/formula_used.png')
                        self.SelectedFormElementOptions.Formulas[self.PropertyName] = data;

                        if (data.FieldsUsed.length > 3 && !RedNaoLicensingManagerVar.LicenseIsValid('Sorry, in this version you can add up to three fields in a formula'))
                            return false;
                    }


                    return true;

                }


            });*/
    }



    public GetCompiledData(data:FormulaData, formula) {
        let myArray = formula.match(/field ([^\]]+)/g);
        if (myArray == null)
            myArray = [];
        let compiledFormula = '';
        let fieldsUsed = [];
        for (let i = 0; i < myArray.length; i++) {
            let field = myArray[i].replace(' ', '').replace('field', '');
            fieldsUsed.push(field);
            field = this.GetValuePropertiesFromField(field);
            formula = formula.replace('[' + myArray[i] + ']', field);
        }

        let subFieldsUsed=[];
        let reg=/\.GetField\(([^\)]*)/g;
        let match=reg.exec(formula);
        while(match!=null)
        {
            if(match.length>1)
            {
                let split=match[1].split(',');
                if(split.length>1)
                {
                    subFieldsUsed.push({Id: split[1].trim().replace(/"/g,'').replace(/'/g,''),Index:split[0].toLowerCase().replace(/"/g,'').replace(/'/g,'')});
                }
            }
            match=reg.exec(formula);
        }


        reg=/\.GetTotal\(([^\)]*)/g;
        match=reg.exec(formula);
        while(match!=null)
        {
            subFieldsUsed.push({Id:match[0].trim().replace(/"/g,'').replace(/'/g,''),Index:''});
            match=reg.exec(formula);
        }




        /** Check repeater matches **/


        formula=this.ProcessRemoteCalls(formula);
        compiledFormula = formula;
        data.RefreshFormData = (typeof this.AdditionalInformation.RefreshFormData == 'undefined' ? 'n' : 'y');
        data.CompiledFormula = compiledFormula;
        data.FieldsUsed = fieldsUsed;
        data.SubFieldsUsed=subFieldsUsed;
        data.PropertyName = this.PropertyName;
        data.AdditionalInformation = this.AdditionalInformation;
        debugger;

    };

    public GetValuePropertiesFromField(fieldId) {
        let formulaElement = this.GetFormElementFromFormulaFieldId(fieldId);
        if (formulaElement != null)
            return 'formData.' + formulaElement.Id;// formulaElement.GetValuePath();

        return '';
    };

    public GetFormElementFromFormulaFieldId(field) {
        for (let i = 0; i < this.FormElements.length; i++) {
            if (this.FormElements[i].Id == field) {
                return this.FormElements[i];
            }
        }

        return null;
    };

    public OpenFormulaEditor(redNaoFormElements:sfFormElementBase<any>[], selectedFormElementOptions:any, propertyName:string, additionalInformation:any, image,closeCallBack:()=>void=null) {

        this.CloseCallback=closeCallBack;
        this.FormElements = redNaoFormElements;
        this.Image = image;

        let text = selectedFormElementOptions.Formulas[propertyName];
        if (typeof text == 'undefined')
            text = "";
        else
            text = text.Value;//text=this.GetHumanRedeableFormula(text.Value);

        this.formulaText=text;




        rnJQuery('.bootstrap-wrapper .CodeMirror').css('opacity',0);
        this.SelectedFormElementOptions = selectedFormElementOptions;
        this.AdditionalInformation = additionalInformation;
        this.PropertyName = propertyName;
        this.$Dialog.modal('show');

        let $backdrop:JQuery=this.$Dialog.data('bs.modal').$backdrop;
        if($backdrop!=null)
            $backdrop.css('z-index',1000007);

        let formList = rnJQuery('#fbFormulaFieldsList');
        formList.empty();
        for (let i = 0; i < redNaoFormElements.length; i++) {
            if (redNaoFormElements[i].StoresInformation()&&!redNaoFormElements[i].IsHandledByAnotherField()) {
                let label:string=redNaoFormElements[i].Options.Label;
                if(label.trim()=='')
                    label=redNaoFormElements[i].Options.Id;
                let jQueryElement = '<div class="formulaFieldItemContainer" data-fieldid="'+redNaoFormElements[i].Options.Id+'"><a href="#" class="list-group-item" onclick="RedNaoFormulaWindowVar.AddFieldToFormula(\'' + redNaoFormElements[i].Options.Id + '\');return false;"><strong>' + label+ '</strong></a></div>';
                formList.append(jQueryElement);

            }
        }


        let customActions = rnJQuery('#fbCommonActionsList');
        customActions.empty();
        for (let i = 0; i < smartFormsFormulaCustomActions.length; i++) {
            customActions.append(this.CreateCustomAction(smartFormsFormulaCustomActions[i]));
        }

        let fixedValues = rnJQuery('#fbFixedValuesList');
        fixedValues.empty();
        for (let i = 0; i < smartFormsFormulaFixedValues.length; i++) {
            fixedValues.append(this.CreateCustomAction(smartFormsFormulaFixedValues[i]));
        }

    };

    public CreateCustomAction(customAction) {
        let jQueryElement = rnJQuery('<a href="#" class="list-group-item"  title="'+ customAction.ToolTip + '" ><strong>' + customAction.Label + '</strong></a>');
        jQueryElement.find('button').tooltip();
        jQueryElement.click( ()=> {
            if (customAction.Type == 'text') {
                this.codeMirror.replaceSelection(customAction.GetText());
                this.codeMirror.focus();
            }
        });
        return jQueryElement;
    }

    public GetHumanRedeableFormula(formula) {
        let myArray = formula.match(/field ([^\]]+)/g);
        let humanRedeableFormula = formula;
        for (let i = 0; i < myArray.length; i++) {
            let fieldId = myArray[i].replace(' ', '').replace('field', '');
            let formElement = this.GetFormElementFromFormulaFieldId(fieldId);
            let fieldToUse='';
            if (formElement == null)
                fieldToUse = fieldId;
            else
                fieldToUse = formElement.Options.Label;
            humanRedeableFormula = humanRedeableFormula.replace(myArray[i], 'field ' + fieldToUse);
        }

        return humanRedeableFormula;

    }

    public GetWrappedCode(){
        let code= this.DecodeFields(this.codeMirror.getValue());
        let hasReturnKeyword:boolean=false;
        rnJQuery(this.codeMirror.getWrapperElement()).find('.cm-keyword').each(function(){
           if(rnJQuery(this).text()=='return')
               hasReturnKeyword=true;
        });

        if(hasReturnKeyword)
            code='(function(){'+code+'})()';
        return code;
    }

    public Validate() {
        let formula = this.GetWrappedCode();
        let myArray = formula.match(/field ([^\]]+)/g);

        if(myArray!=null)
        {
            for (let i = 0; i < myArray.length; i++)
                formula = formula.replace('[' + myArray[i] + ']', '1');
        }

        try {
            let a = eval(formula);
            alert('Formula validated successfully');
        } catch (exception) {
            alert('An error ocurred \n' + exception);
        }

    }


    public AddFieldToFormula(id) {
        for(let field of this.FormElements)
        {
            if(field.Options.Id==id)
            {
                this.codeMirror.replaceSelection("$$field_" + id.trim() + "$$");
                this.codeMirror.focus();
            }
        }

        //rnJQuery('#redNaoFormulaTextArea').insertAtCaret("[field " + id.trim() + "]");

    };


    public CloseFormulaEditor(redNaoFormElements) {
        this.$Dialog.modal('hide');
    }

    private Closing() {
        let formula=this.GetWrappedCode();
        if(formula=="")
        {
            delete this.SelectedFormElementOptions.Formulas[this.PropertyName];
            if(this.Image!=null)
                this.Image.attr('src',smartFormsRootPath+'images/formula.png')
        }
        else{
            let data:any={};
            data.Value=formula;
            this.GetCompiledData(data,formula);
            if(this.Image!=null)
                this.Image.attr('src',smartFormsRootPath+'images/formula_used.png');


            this.SelectedFormElementOptions.Formulas[this.PropertyName]=data;


        }
        if(this.CloseCallback!=null)
            this.CloseCallback();
        return true;
    }

    private CreateCodeMirrorEditor() {
        if(this.codeMirror==null) {
            this.codeMirror = CodeMirror.fromTextArea(<any>rnJQuery('#redNaoFormulaTextArea')[0], {
                extraKeys: {"Ctrl-Space": "autocomplete"},
                lineNumbers: true,
                mode: 'javascript',
                gutters: ["CodeMirror-lint-markers"],
                lint:true,
                hintOptions: {
                    hint: (editor,token)=>{let result= this.autoComplete.process(editor,token); return result==null?result:result.data;},
                    completeSingle:false
                }});

            this.codeMirror.on('changes', (instance, change) => {
                this.CodeMirrorChange(instance, change)
            });
            this.codeMirror.setSize(500,300);
            this.codeMirror.on("keyup", function (cm, event) {
                if (!cm.state.completionActive && /*Enables keyboard navigation in autocomplete list*/
                    event.keyCode != 13) {        /*Enter - do not open autocomplete list just after item has been selected in it*/
                    if(event.key=='.')
                        CodeMirror.commands.autocomplete(cm, null, {completeSingle: false});
                }
            });
        }
        this.SetCodeMirror(this.formulaText);
        rnJQuery('.bootstrap-wrapper .CodeMirror').velocity({opacity:1},200,"easeInExp");

    }

    private GetLabel(label:string,id:string) {
        if(this.elementToShow=='label')
        {
            if(label.length>27)
                return label.substr(0,27)+'...';
            return label;
        }

        else
            return id;
    }




    private CreateFieldTag(label:string,id:string) {
        return `<span class='smartFromsFieldInFormula' data-label="${label}" data-id="${id}" contentEditable='false'>${this.GetLabel(label,id)}</span>`
    }


    private CodeMirrorChange(instance: any, object: any[]) {
        for(let obj of object)
        {
            let startLine=obj.from.line;
            let endLine=startLine+object[0].text.length;
            for(let i=startLine;i<=endLine;i++)
            {
                let lineText=this.codeMirror.getLine(i);
                let re=/\$\$field_([^\$]+)\$\$/g;
                let m;
                while(m=re.exec(lineText))
                {
                    let label=m[1];
                    let id=m[1];
                    for (let h = 0; h < this.FormElements.length; h++) {
                        if (this.FormElements[h].Id == id) {
                            label=this.FormElements[h].Options.Label;
                        }
                    }
                    let $element=rnJQuery(`<span class='smartFromsFieldInFormula' data-label="${label}" data-id="${id}">${this.GetLabel(label,id)}</span>`)[0];
                    this.codeMirror.markText({line: i, ch: re.lastIndex-m[0].length}, {line: i, ch: re.lastIndex},{replacedWith:$element});
                    //text=text.replace(,this.CreateFieldTag(label,id));

                }

                re=/(Math)/g;
                while(m=re.exec(lineText))
                {
                    this.codeMirror.markText({line: i, ch: re.lastIndex - 5}, {line: i, ch: re.lastIndex }, {className: 'sfFormulaMethod'});
                }

                re=/(Remote)/g;
                while(m=re.exec(lineText))
                {
                    this.codeMirror.markText({line: i, ch: re.lastIndex - 6}, {line: i, ch: re.lastIndex }, {className: 'sfFormulaMethod'});
                }



                re=/(RN[^\(]+)\(/g;
                while(m=re.exec(lineText))
                {
                    let name=m[1];
                    let className='';
                    if(this.MethodNames.indexOf(name)>-1)
                        className='sfFormulaMethod';
                    if(this.FixedValues.indexOf(name)>-1)
                        className='sfFormulaFixedValue';

                    if(className!='') {
                        let element=rnJQuery(`<span class="${className}">${m[1]}</span>`)[0];
                        this.codeMirror.markText({line: i, ch: re.lastIndex - m[0].length}, {line: i, ch: re.lastIndex - 1}, {replacedWith: element});
                    }


                }
                //this.codeMirror.markText({line: 0, ch: 0}, {line: 0, ch: 10}, {replacedWith: rnJQuery('<button>asfasdf</button>')[0]});
            }
        }


        //console.log(instance);
    }

    private SetCodeMirror(text: string) {
        let start=text.substring(0,12);
        let end=text.substring(text.length-4);
        if(start=='(function(){'&&end=='})()')
            text=text.substring(12,text.length-4);


        this.codeMirror.setValue(this.EncodeFields(text));
    }

    private ExecuteSearch() {
        let textToSearch=this.searchField.val().toLowerCase();
        let $fieldItems=rnJQuery('#fbFormulaFieldsList').find('.formulaFieldItemContainer');
        for(let i=0;i<this.FormElements.length;i++)
        {
            if (!this.FormElements[i].StoresInformation())
                continue;

            let $item=rnJQuery('#fbFormulaFieldsList .formulaFieldItemContainer[data-fieldid="'+this.FormElements[i].Options.Id+'"]');
            if(this.FormElements[i].Options.Label.toLowerCase().indexOf(textToSearch)>-1)
            {
                if($item.is(':visible'))
                    continue;
                let height= $item.data('original-height');
                $item.css('display','block');
                $item.velocity({height:height},200,"easeInExp");
            }else{

                if($item.is(':hidden'))
                    continue;
                if($item.data('original-height')==null)
                    $item.data('original-height',$item.outerHeight());
                $item.velocity({height:0},200,"easeOutExp",()=>{$item.css('display','none')});
            }

        }
    }

    private EncodeFields(text: string) {
        let re=/\[field ([^\]]*)\]/g;
        let m;
        while(m=re.exec(text))
        {
            text=text.replace(m[0],"$$$$field_"+m[1]+"$$$$");
            re.lastIndex=0;
            //text=text.replace(,this.CreateFieldTag(label,id));

        }

        return text;
    }

    private DecodeFields(text: string) {
        let re=/\$\$field_([^\$]+)\$\$/g;
        let m;
        while(m=re.exec(text))
        {
            text=text.replace(m[0],"[field "+m[1]+"]");
            re.lastIndex=0;
            //text=text.replace(,this.CreateFieldTag(label,id));

        }

        return text;
    }

    private ProcessRemoteCalls(formula: any) {
       let compiler=new FormulaCompiler(formula);
       return compiler.Compile();
    }
}



rnJQuery.fn.extend({
    insertAtCaret: function(myValue){
        return this.each(function(i) {
            if ((<any>document).selection) {
                //For browsers like Internet Explorer
                this.focus();
                let sel = (<any>document).selection.createRange();
                sel.text = myValue;
                this.focus();
            }
            else if (this.selectionStart || this.selectionStart == '0') {
                //For browsers like Firefox and Webkit based
                let startPos = this.selectionStart;
                let endPos = this.selectionEnd;
                let scrollTop = this.scrollTop;
                this.value = this.value.substring(0, startPos)+myValue+this.value.substring(endPos,this.value.length);
                this.focus();
                this.selectionStart = startPos + myValue.length;
                this.selectionEnd = startPos + myValue.length;
                this.scrollTop = scrollTop;
            } else {
                this.value += myValue;
                this.focus();
            }
        });
    }
});


rnJQuery(function(){
    (<any>window).RedNaoFormulaWindowVar=new RedNaoFormulaWindow();
});




