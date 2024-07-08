var SfFormulaAutoComplete = /** @class */ (function () {
    function SfFormulaAutoComplete() {
    }
    SfFormulaAutoComplete.prototype.process = function (editor, token) {
        var cursor = editor.getCursor();
        var line = editor.getLine(cursor.line);
        var start = cursor.ch;
        var end = cursor.ch;
        if ((start > 0 && line.charAt(start - 1) == ' ') || (line.length == 0 || line.charAt(0) == ""))
            return this.GenerateList(editor)
                .AddItem('Math', '', 'Math', 'Here you will find advanced aritmetical operations like sin or pow')
                .AddItem('Remote', '', 'Remote', 'Here you can do Get/Post request to get information from other places');
        if (this.IsRemoteNerby(cursor, line))
            return this.GenerateList(editor)
                .AddItem('Get:', 'Get($$URL$$,$$Args$$)', 'Get(URL,Args)', 'Execute a Get request using the specified $$URL$$ and $$Args$$(optional)')
                .AddItem('Post:', 'Get($$URL$$,$$Args$$)', 'Post(URL,Args)', 'Execute a Post request using the specified $$URL$$ and $$Args$$(optional)');
        if (this.IsMathNerby(cursor, line))
            return this.GenerateList(editor)
                .AddItem('Abs:', 'abs($$x$$)', 'abs(x)', 'Returns the absolute value of $$x$$')
                .AddItem('Acos:', 'acos($$x$$)', 'acos(x)', 'Returns the arccosine of $$x$$, in radians')
                .AddItem('Asin:', 'asin($$x$$)', 'asin(x)', 'Returns the arcsine of $$x$$, in radians')
                .AddItem('Atan:', 'atan($$x$$)', 'atan(x)', 'Returns the arctangent of $$x$$ as a numeric value between -PI/2 and PI/2 radians')
                .AddItem('Ceil:', 'atan2($$y$$,$$x$$)', 'atan2(y,x)', 'Returns the arctangent of the quotient of its arguments')
                .AddItem('Atan2:', 'atan2($$y$$,$$x$$)', 'atan2(y,x)', 'Returns the arctangent of the quotient of its arguments')
                .AddItem('Ceil:', 'ceil($$x$$)', 'ceil(x)', 'Returns the value of $$x$$ rounded up to its nearest integer')
                .AddItem('Cos:', 'cos($$x$$)', 'cos(x)', 'Returns the cosine of $$x$$ ($$x$$ is in radians)')
                .AddItem('Exp:', 'exp($$x$$)', 'exp(x)', 'Returns the value of e<sup style="vertical-align: super;font-size: smaller;">$$x$$</sup>')
                .AddItem('Floor:', 'floor($$x$$)', 'floor(x)', 'Returns the value of $$x$$ rounded down to its nearest integer')
                .AddItem('Log:', 'log($$x$$)', 'log(x)', 'Returns the natural logarithm (base E) of $$x$$')
                .AddItem('Max:', 'max($$x$$, $$y$$, $$z$$, ..., $$n$$)', 'max(x, y)', 'Returns the number with the highest value')
                .AddItem('Min:', 'min($$x$$, $$y$$, $$z$$, ..., $$n$$)', 'min(x, y)', 'Returns the number with the lowest value')
                .AddItem('Pow:', 'pow($$x$$, $$y$$)', 'pow(x, y)', 'Returns the value of $$x$$ to the power of $$y$$')
                .AddItem('Random:', 'random()', 'random()', 'Returns a random number between 0 and 1')
                .AddItem('Sin:', 'sin($$x$$)', 'sin(x)', 'Returns the sine of $$x$$ ($$x$$ is in radians)')
                .AddItem('Sqrt:', 'sqrt($$x$$)', 'sqrt(x)', 'Returns the square root of $$x$$')
                .AddItem('Tan:', 'tan($$x$$)', 'tan(x)', 'Returns the tangent of an angle');
        if (this.IsFieldNerby(cursor, line))
            return this.GetIntellisenceforField(editor, cursor, line);
        return null;
    };
    SfFormulaAutoComplete.prototype.GenerateList = function (editor) {
        return new ListGenerator(editor);
    };
    SfFormulaAutoComplete.prototype.IsFieldNerby = function (cursor, line) {
        return !(cursor.ch < 4 || line.charAt(cursor.ch - 1) != '.' || line.charAt(cursor.ch - 2) != '$' || line.charAt(cursor.ch - 3) != '$');
    };
    SfFormulaAutoComplete.prototype.IsMathNerby = function (cursor, line) {
        return cursor.ch >= 5 && line.substr(cursor.ch - 5, 5) == 'Math.';
    };
    SfFormulaAutoComplete.prototype.IsRemoteNerby = function (cursor, line) {
        return cursor.ch >= 7 && line.substr(cursor.ch - 7, 7) == 'Remote.';
    };
    SfFormulaAutoComplete.prototype.GetFieldById = function (id) {
        for (var _i = 0, _a = SmartFormsAddNewVar.FormBuilder.RedNaoFormElements; _i < _a.length; _i++) {
            var field = _a[_i];
            if (field.Id == id)
                return field;
        }
        return null;
    };
    SfFormulaAutoComplete.prototype.GetIntellisenceforField = function (editor, cursor, line) {
        var index = cursor.ch - 3;
        var currentField = '';
        var fieldId = '';
        while ((currentField = line.charAt(index)) != ' ' && index > 0) {
            fieldId = currentField + fieldId;
            index--;
        }
        if (fieldId.length > 2)
            fieldId = fieldId.substring(7, fieldId.length - 1);
        var field = this.GetFieldById(fieldId);
        if (field == null)
            return;
        var dictionary = SFAutoCompleteFieldDictionary.GetDictionary(field.GetDataStore());
        if (dictionary != null) {
            var list = this.GenerateList(editor);
            for (var _i = 0, _a = dictionary.availableMethods; _i < _a.length; _i++) {
                var method = _a[_i];
                list.AddItem(method.label, method.label2, method.value, method.description);
            }
            return list;
        }
        return null;
    };
    return SfFormulaAutoComplete;
}());
var ListGenerator = /** @class */ (function () {
    function ListGenerator(editor) {
        var cursor = editor.getCursor();
        this.data = {
            type: 'html',
            list: [],
            from: cursor,
            to: cursor
        };
    }
    ListGenerator.prototype.AddItem = function (label, label2, value, description) {
        var colorDictionary = {};
        var labelElement = "<div style=\"line-height: 1.2em;padding:3px 0 3px 0;\"><span class=\"sfFormulaLabel\">" + label + "</span>" + (label2 != '' ? "<span class=\"sfFormulaLabel2\">" + this.StylizeText(colorDictionary, label2) + "</span>" : '') + "<span class=\"sfFormulaDescription\">" + this.StylizeText(colorDictionary, description) + "</span></div>";
        this.data.list.push({ label: labelElement, value: value });
        return this;
    };
    ListGenerator.prototype.StylizeText = function (colorDictionary, label) {
        var reg = /\$\$([^(\$\$)]+)\$\$/g;
        var m;
        var count = -1;
        var colors = ['red', 'blue', '#008000', '#8B008B'];
        while (m = reg.exec(label)) {
            var color = void 0;
            if (typeof colorDictionary[m[1]] != 'undefined')
                color = colorDictionary[m[1]];
            else {
                count++;
                color = colors[count];
                colorDictionary[m[1]] = color;
            }
            label = label.replace(m[0], "<span style=\"color:" + color + "\">" + m[1] + "</span>");
            reg.lastIndex = 0;
        }
        return label;
    };
    return ListGenerator;
}());
//# sourceMappingURL=autoComplete.js.map