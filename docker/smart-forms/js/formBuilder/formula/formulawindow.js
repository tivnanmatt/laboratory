var RedNaoFormulaWindow = /** @class */ (function () {
    function RedNaoFormulaWindow() {
        var _this = this;
        this.elementToShow = 'label';
        this.codeMirror = null;
        this.MethodNames = ['RNFRound', 'RNIf', 'RNDateDiff', 'Math', 'Remote', 'RNPMT', 'RNIPMT', 'RNPPMT', 'RNXNPV', 'RNXIRR', 'RNFV', 'RNMinutesDiff'];
        this.FixedValues = ['RNUserName', 'RNFirstName', 'RNLastName', 'RNEmail'];
        //rnJQuery("#redNaoFormulaAccordion").accordion({clearStyle: true, autoHeight: false});
        this.autoComplete = new SfFormulaAutoComplete();
        this.$Dialog = rnJQuery("<div class=\"modal fade\" data-backdrop=\"static\" data-keyboard=\"false\" id=\"smartFormsFormulaBuilder\" style=\"display: none;z-index:1000088 !important\">\n                                  <div class=\"modal-dialog\" style=\";width:720px;\">\n                                    <div class=\"modal-content\">\n                                      <div class=\"modal-header\">\n                                        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">\u00D7</button>\n                                        <h4 class=\"modal-title\"><span class=\"fa fa-calculator\" style=\"line-height: 18px;vertical-align: middle;font-size: 13px;\"></span> <span style=\"line-height: 18px;vertical-align: middle;\">Formula Builder</span></h4>\n                                      </div>\n                                      <div class=\"modal-body\">\n                                        <table style='width:100%;'>\n                                            <tr>\n                                                <td>                                                    \n                                                    <textarea contenteditable=\"true\" style=\"opacity:0;width:500px;min-height:300px;height: 100%; padding: 5px;\" id=\"redNaoFormulaTextArea\" placeholder=\"Here you can add arithmetical e.g. [field1]+[field2].\"></textarea>\n                                                    <a target=\"_blank\" href=\"https://sfmanual.rednao.com/documentation/calculatedfields/creating-formulas/\">Need help? check out the tutorials!</a>                                                    \n                                                </td>\n                                                <td style=\"vertical-align: top\">\n                                                    <div style=\"height: 300px;overflow: scroll;width:200px;overflow-x:hidden;\">\n                                                        <div style=\"width:100%;position:relative;\">\n                                                            <input type=\"text\" id=\"sfFormulaSearch\" style=\"height:30px;\"/>\n                                                            <span class=\"glyphicon glyphicon-search\" style=\"color:#ccc;position: absolute;top: 10px;left: 10px;\"></span>\n                                                        </div> \n                                                        <div class=\"styleGroup\">\n                                                                <div class=\"sfStyleTitle\">\n                                                                    <h5>\n                                                                        <a data-toggle=\"collapse\" href=\"#fbFormulaFields\" ><span class=\"sfAccordionIcon glyphicon glyphicon-chevron-right\"></span>Form Fields</a>\n                                                                    </h5>\n                                                                </div>\n                                                                <div class=\"sfStyleContainer collapse sfFormFields\" style=\"padding:0;\"  id=\"fbFormulaFields\"><div class=\"list-group\" id=\"fbFormulaFieldsList\"></div><div class=\"clearer\" style=\"clear:both;\"></div></div>                                             \n                                                         </div>\n                                                         <div class=\"styleGroup\">\n                                                                <div class=\"sfStyleTitle\">\n                                                                    <h5>\n                                                                        <a data-toggle=\"collapse\" href=\"#fbCommonActions\" class=\"collapsed\"><span class=\"sfAccordionIcon glyphicon glyphicon-chevron-right\"></span>Common Functions</a>\n                                                                    </h5>\n                                                                </div>\n                                                                <div class=\"sfStyleContainer collapse sfCommonActions in\" style=\"padding:0;\"  id=\"fbCommonActions\"><div class=\"list-group\" id=\"fbCommonActionsList\"></div><div class=\"clearer\" style=\"clear:both;\"></div></div>                                             \n                                                         </div>\n                                                          <div class=\"styleGroup\">\n                                                                <div class=\"sfStyleTitle\">\n                                                                    <h5>\n                                                                        <a data-toggle=\"collapse\" href=\"#fbFixedValues\" class=\"collapsed\"><span class=\"sfAccordionIcon glyphicon glyphicon-chevron-right\"></span>Fixed Values</a>\n                                                                    </h5>\n                                                                </div>\n                                                                <div class=\"sfStyleContainer collapse in sfFixedValues\" style=\"padding:0;\" id=\"fbFixedValues\"><div class=\"list-group\" id=\"fbFixedValuesList\"></div><div class=\"clearer\" style=\"clear:both;\"></div></div>                                             \n                                                         </div>    \n                                                     </div>                                                 \n                                                </td>\n                                            </tr>\n                                            <tr>\n                                                <td>\n                                                    <div> <input class=\"sfFormulaElementToShow\" checked=\"checked\" style=\"margin:0;padding:0\" id=\"showName\" type=\"radio\" value=\"label\"  name=\"elementToShow\"><label style=\"margin:0;padding:0\" for=\"showName\">&nbsp;Show Label</label> <input class=\"sfFormulaElementToShow\"  id=\"showId\" style=\"margin:0;padding:0;margin-left:10px;\" value=\"id\" type=\"radio\" name=\"elementToShow\"> <label style=\"margin:0;padding:0\" for=\"showId\">&nbsp;Show Id</label>\n                                                </td>\n                                                <td style=\"text-align:right;\">\n                                                    <button class=\"btn btn-primary\" onclick=\"RedNaoFormulaWindowVar.Validate();\">Validate</button> \n                                                </td>\n                                            </tr>\n                                        </table>\n                                      </div>                                    \n                                    </div>\n                                  </div>\n                                </div>    \n        ");
        var container = rnJQuery('<div class="bootstrap-wrapper"></div>');
        container.append(this.$Dialog);
        rnJQuery('body').append(container);
        container.find('.sfFormulaElementToShow').change(function () {
            _this.elementToShow = container.find('.sfFormulaElementToShow:checked').val();
            if (_this.codeMirror != null)
                _this.codeMirror.setValue(_this.codeMirror.getValue());
        });
        this.searchField = container.find('#sfFormulaSearch');
        this.searchField.click(function () {
            this.setSelectionRange(0, this.value.length);
        });
        this.searchField.keyup(function () {
            _this.ExecuteSearch();
        });
        container.on('shown.bs.modal', function () {
            _this.CreateCodeMirrorEditor();
        });
        container.on('hidden.bs.modal', function () {
            _this.Closing();
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
    RedNaoFormulaWindow.prototype.GetCompiledData = function (data, formula) {
        var myArray = formula.match(/field ([^\]]+)/g);
        if (myArray == null)
            myArray = [];
        var compiledFormula = '';
        var fieldsUsed = [];
        for (var i = 0; i < myArray.length; i++) {
            var field = myArray[i].replace(' ', '').replace('field', '');
            fieldsUsed.push(field);
            field = this.GetValuePropertiesFromField(field);
            formula = formula.replace('[' + myArray[i] + ']', field);
        }
        var subFieldsUsed = [];
        var reg = /\.GetField\(([^\)]*)/g;
        var match = reg.exec(formula);
        while (match != null) {
            if (match.length > 1) {
                var split = match[1].split(',');
                if (split.length > 1) {
                    subFieldsUsed.push({ Id: split[1].trim().replace(/"/g, '').replace(/'/g, ''), Index: split[0].toLowerCase().replace(/"/g, '').replace(/'/g, '') });
                }
            }
            match = reg.exec(formula);
        }
        reg = /\.GetTotal\(([^\)]*)/g;
        match = reg.exec(formula);
        while (match != null) {
            subFieldsUsed.push({ Id: match[0].trim().replace(/"/g, '').replace(/'/g, ''), Index: '' });
            match = reg.exec(formula);
        }
        /** Check repeater matches **/
        formula = this.ProcessRemoteCalls(formula);
        compiledFormula = formula;
        data.RefreshFormData = (typeof this.AdditionalInformation.RefreshFormData == 'undefined' ? 'n' : 'y');
        data.CompiledFormula = compiledFormula;
        data.FieldsUsed = fieldsUsed;
        data.SubFieldsUsed = subFieldsUsed;
        data.PropertyName = this.PropertyName;
        data.AdditionalInformation = this.AdditionalInformation;
        debugger;
    };
    ;
    RedNaoFormulaWindow.prototype.GetValuePropertiesFromField = function (fieldId) {
        var formulaElement = this.GetFormElementFromFormulaFieldId(fieldId);
        if (formulaElement != null)
            return 'formData.' + formulaElement.Id; // formulaElement.GetValuePath();
        return '';
    };
    ;
    RedNaoFormulaWindow.prototype.GetFormElementFromFormulaFieldId = function (field) {
        for (var i = 0; i < this.FormElements.length; i++) {
            if (this.FormElements[i].Id == field) {
                return this.FormElements[i];
            }
        }
        return null;
    };
    ;
    RedNaoFormulaWindow.prototype.OpenFormulaEditor = function (redNaoFormElements, selectedFormElementOptions, propertyName, additionalInformation, image, closeCallBack) {
        if (closeCallBack === void 0) { closeCallBack = null; }
        this.CloseCallback = closeCallBack;
        this.FormElements = redNaoFormElements;
        this.Image = image;
        var text = selectedFormElementOptions.Formulas[propertyName];
        if (typeof text == 'undefined')
            text = "";
        else
            text = text.Value; //text=this.GetHumanRedeableFormula(text.Value);
        this.formulaText = text;
        rnJQuery('.bootstrap-wrapper .CodeMirror').css('opacity', 0);
        this.SelectedFormElementOptions = selectedFormElementOptions;
        this.AdditionalInformation = additionalInformation;
        this.PropertyName = propertyName;
        this.$Dialog.modal('show');
        var $backdrop = this.$Dialog.data('bs.modal').$backdrop;
        if ($backdrop != null)
            $backdrop.css('z-index', 1000007);
        var formList = rnJQuery('#fbFormulaFieldsList');
        formList.empty();
        for (var i = 0; i < redNaoFormElements.length; i++) {
            if (redNaoFormElements[i].StoresInformation() && !redNaoFormElements[i].IsHandledByAnotherField()) {
                var label = redNaoFormElements[i].Options.Label;
                if (label.trim() == '')
                    label = redNaoFormElements[i].Options.Id;
                var jQueryElement = '<div class="formulaFieldItemContainer" data-fieldid="' + redNaoFormElements[i].Options.Id + '"><a href="#" class="list-group-item" onclick="RedNaoFormulaWindowVar.AddFieldToFormula(\'' + redNaoFormElements[i].Options.Id + '\');return false;"><strong>' + label + '</strong></a></div>';
                formList.append(jQueryElement);
            }
        }
        var customActions = rnJQuery('#fbCommonActionsList');
        customActions.empty();
        for (var i = 0; i < smartFormsFormulaCustomActions.length; i++) {
            customActions.append(this.CreateCustomAction(smartFormsFormulaCustomActions[i]));
        }
        var fixedValues = rnJQuery('#fbFixedValuesList');
        fixedValues.empty();
        for (var i = 0; i < smartFormsFormulaFixedValues.length; i++) {
            fixedValues.append(this.CreateCustomAction(smartFormsFormulaFixedValues[i]));
        }
    };
    ;
    RedNaoFormulaWindow.prototype.CreateCustomAction = function (customAction) {
        var _this = this;
        var jQueryElement = rnJQuery('<a href="#" class="list-group-item"  title="' + customAction.ToolTip + '" ><strong>' + customAction.Label + '</strong></a>');
        jQueryElement.find('button').tooltip();
        jQueryElement.click(function () {
            if (customAction.Type == 'text') {
                _this.codeMirror.replaceSelection(customAction.GetText());
                _this.codeMirror.focus();
            }
        });
        return jQueryElement;
    };
    RedNaoFormulaWindow.prototype.GetHumanRedeableFormula = function (formula) {
        var myArray = formula.match(/field ([^\]]+)/g);
        var humanRedeableFormula = formula;
        for (var i = 0; i < myArray.length; i++) {
            var fieldId = myArray[i].replace(' ', '').replace('field', '');
            var formElement = this.GetFormElementFromFormulaFieldId(fieldId);
            var fieldToUse = '';
            if (formElement == null)
                fieldToUse = fieldId;
            else
                fieldToUse = formElement.Options.Label;
            humanRedeableFormula = humanRedeableFormula.replace(myArray[i], 'field ' + fieldToUse);
        }
        return humanRedeableFormula;
    };
    RedNaoFormulaWindow.prototype.GetWrappedCode = function () {
        var code = this.DecodeFields(this.codeMirror.getValue());
        var hasReturnKeyword = false;
        rnJQuery(this.codeMirror.getWrapperElement()).find('.cm-keyword').each(function () {
            if (rnJQuery(this).text() == 'return')
                hasReturnKeyword = true;
        });
        if (hasReturnKeyword)
            code = '(function(){' + code + '})()';
        return code;
    };
    RedNaoFormulaWindow.prototype.Validate = function () {
        var formula = this.GetWrappedCode();
        var myArray = formula.match(/field ([^\]]+)/g);
        if (myArray != null) {
            for (var i = 0; i < myArray.length; i++)
                formula = formula.replace('[' + myArray[i] + ']', '1');
        }
        try {
            var a = eval(formula);
            alert('Formula validated successfully');
        }
        catch (exception) {
            alert('An error ocurred \n' + exception);
        }
    };
    RedNaoFormulaWindow.prototype.AddFieldToFormula = function (id) {
        for (var _i = 0, _a = this.FormElements; _i < _a.length; _i++) {
            var field = _a[_i];
            if (field.Options.Id == id) {
                this.codeMirror.replaceSelection("$$field_" + id.trim() + "$$");
                this.codeMirror.focus();
            }
        }
        //rnJQuery('#redNaoFormulaTextArea').insertAtCaret("[field " + id.trim() + "]");
    };
    ;
    RedNaoFormulaWindow.prototype.CloseFormulaEditor = function (redNaoFormElements) {
        this.$Dialog.modal('hide');
    };
    RedNaoFormulaWindow.prototype.Closing = function () {
        var formula = this.GetWrappedCode();
        if (formula == "") {
            delete this.SelectedFormElementOptions.Formulas[this.PropertyName];
            if (this.Image != null)
                this.Image.attr('src', smartFormsRootPath + 'images/formula.png');
        }
        else {
            var data = {};
            data.Value = formula;
            this.GetCompiledData(data, formula);
            if (this.Image != null)
                this.Image.attr('src', smartFormsRootPath + 'images/formula_used.png');
            this.SelectedFormElementOptions.Formulas[this.PropertyName] = data;
        }
        if (this.CloseCallback != null)
            this.CloseCallback();
        return true;
    };
    RedNaoFormulaWindow.prototype.CreateCodeMirrorEditor = function () {
        var _this = this;
        if (this.codeMirror == null) {
            this.codeMirror = CodeMirror.fromTextArea(rnJQuery('#redNaoFormulaTextArea')[0], {
                extraKeys: { "Ctrl-Space": "autocomplete" },
                lineNumbers: true,
                mode: 'javascript',
                gutters: ["CodeMirror-lint-markers"],
                lint: true,
                hintOptions: {
                    hint: function (editor, token) { var result = _this.autoComplete.process(editor, token); return result == null ? result : result.data; },
                    completeSingle: false
                }
            });
            this.codeMirror.on('changes', function (instance, change) {
                _this.CodeMirrorChange(instance, change);
            });
            this.codeMirror.setSize(500, 300);
            this.codeMirror.on("keyup", function (cm, event) {
                if (!cm.state.completionActive && /*Enables keyboard navigation in autocomplete list*/
                    event.keyCode != 13) { /*Enter - do not open autocomplete list just after item has been selected in it*/
                    if (event.key == '.')
                        CodeMirror.commands.autocomplete(cm, null, { completeSingle: false });
                }
            });
        }
        this.SetCodeMirror(this.formulaText);
        rnJQuery('.bootstrap-wrapper .CodeMirror').velocity({ opacity: 1 }, 200, "easeInExp");
    };
    RedNaoFormulaWindow.prototype.GetLabel = function (label, id) {
        if (this.elementToShow == 'label') {
            if (label.length > 27)
                return label.substr(0, 27) + '...';
            return label;
        }
        else
            return id;
    };
    RedNaoFormulaWindow.prototype.CreateFieldTag = function (label, id) {
        return "<span class='smartFromsFieldInFormula' data-label=\"" + label + "\" data-id=\"" + id + "\" contentEditable='false'>" + this.GetLabel(label, id) + "</span>";
    };
    RedNaoFormulaWindow.prototype.CodeMirrorChange = function (instance, object) {
        for (var _i = 0, object_1 = object; _i < object_1.length; _i++) {
            var obj = object_1[_i];
            var startLine = obj.from.line;
            var endLine = startLine + object[0].text.length;
            for (var i = startLine; i <= endLine; i++) {
                var lineText = this.codeMirror.getLine(i);
                var re = /\$\$field_([^\$]+)\$\$/g;
                var m = void 0;
                while (m = re.exec(lineText)) {
                    var label = m[1];
                    var id = m[1];
                    for (var h = 0; h < this.FormElements.length; h++) {
                        if (this.FormElements[h].Id == id) {
                            label = this.FormElements[h].Options.Label;
                        }
                    }
                    var $element = rnJQuery("<span class='smartFromsFieldInFormula' data-label=\"" + label + "\" data-id=\"" + id + "\">" + this.GetLabel(label, id) + "</span>")[0];
                    this.codeMirror.markText({ line: i, ch: re.lastIndex - m[0].length }, { line: i, ch: re.lastIndex }, { replacedWith: $element });
                    //text=text.replace(,this.CreateFieldTag(label,id));
                }
                re = /(Math)/g;
                while (m = re.exec(lineText)) {
                    this.codeMirror.markText({ line: i, ch: re.lastIndex - 5 }, { line: i, ch: re.lastIndex }, { className: 'sfFormulaMethod' });
                }
                re = /(Remote)/g;
                while (m = re.exec(lineText)) {
                    this.codeMirror.markText({ line: i, ch: re.lastIndex - 6 }, { line: i, ch: re.lastIndex }, { className: 'sfFormulaMethod' });
                }
                re = /(RN[^\(]+)\(/g;
                while (m = re.exec(lineText)) {
                    var name_1 = m[1];
                    var className = '';
                    if (this.MethodNames.indexOf(name_1) > -1)
                        className = 'sfFormulaMethod';
                    if (this.FixedValues.indexOf(name_1) > -1)
                        className = 'sfFormulaFixedValue';
                    if (className != '') {
                        var element = rnJQuery("<span class=\"" + className + "\">" + m[1] + "</span>")[0];
                        this.codeMirror.markText({ line: i, ch: re.lastIndex - m[0].length }, { line: i, ch: re.lastIndex - 1 }, { replacedWith: element });
                    }
                }
                //this.codeMirror.markText({line: 0, ch: 0}, {line: 0, ch: 10}, {replacedWith: rnJQuery('<button>asfasdf</button>')[0]});
            }
        }
        //console.log(instance);
    };
    RedNaoFormulaWindow.prototype.SetCodeMirror = function (text) {
        var start = text.substring(0, 12);
        var end = text.substring(text.length - 4);
        if (start == '(function(){' && end == '})()')
            text = text.substring(12, text.length - 4);
        this.codeMirror.setValue(this.EncodeFields(text));
    };
    RedNaoFormulaWindow.prototype.ExecuteSearch = function () {
        var textToSearch = this.searchField.val().toLowerCase();
        var $fieldItems = rnJQuery('#fbFormulaFieldsList').find('.formulaFieldItemContainer');
        var _loop_1 = function (i) {
            if (!this_1.FormElements[i].StoresInformation())
                return "continue";
            var $item = rnJQuery('#fbFormulaFieldsList .formulaFieldItemContainer[data-fieldid="' + this_1.FormElements[i].Options.Id + '"]');
            if (this_1.FormElements[i].Options.Label.toLowerCase().indexOf(textToSearch) > -1) {
                if ($item.is(':visible'))
                    return "continue";
                var height = $item.data('original-height');
                $item.css('display', 'block');
                $item.velocity({ height: height }, 200, "easeInExp");
            }
            else {
                if ($item.is(':hidden'))
                    return "continue";
                if ($item.data('original-height') == null)
                    $item.data('original-height', $item.outerHeight());
                $item.velocity({ height: 0 }, 200, "easeOutExp", function () { $item.css('display', 'none'); });
            }
        };
        var this_1 = this;
        for (var i = 0; i < this.FormElements.length; i++) {
            _loop_1(i);
        }
    };
    RedNaoFormulaWindow.prototype.EncodeFields = function (text) {
        var re = /\[field ([^\]]*)\]/g;
        var m;
        while (m = re.exec(text)) {
            text = text.replace(m[0], "$$$$field_" + m[1] + "$$$$");
            re.lastIndex = 0;
            //text=text.replace(,this.CreateFieldTag(label,id));
        }
        return text;
    };
    RedNaoFormulaWindow.prototype.DecodeFields = function (text) {
        var re = /\$\$field_([^\$]+)\$\$/g;
        var m;
        while (m = re.exec(text)) {
            text = text.replace(m[0], "[field " + m[1] + "]");
            re.lastIndex = 0;
            //text=text.replace(,this.CreateFieldTag(label,id));
        }
        return text;
    };
    RedNaoFormulaWindow.prototype.ProcessRemoteCalls = function (formula) {
        var compiler = new FormulaCompiler(formula);
        return compiler.Compile();
    };
    return RedNaoFormulaWindow;
}());
rnJQuery.fn.extend({
    insertAtCaret: function (myValue) {
        return this.each(function (i) {
            if (document.selection) {
                //For browsers like Internet Explorer
                this.focus();
                var sel = document.selection.createRange();
                sel.text = myValue;
                this.focus();
            }
            else if (this.selectionStart || this.selectionStart == '0') {
                //For browsers like Firefox and Webkit based
                var startPos = this.selectionStart;
                var endPos = this.selectionEnd;
                var scrollTop = this.scrollTop;
                this.value = this.value.substring(0, startPos) + myValue + this.value.substring(endPos, this.value.length);
                this.focus();
                this.selectionStart = startPos + myValue.length;
                this.selectionEnd = startPos + myValue.length;
                this.scrollTop = scrollTop;
            }
            else {
                this.value += myValue;
                this.focus();
            }
        });
    }
});
rnJQuery(function () {
    window.RedNaoFormulaWindowVar = new RedNaoFormulaWindow();
});
//# sourceMappingURL=formulawindow.js.map