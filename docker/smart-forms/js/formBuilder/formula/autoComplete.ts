class SfFormulaAutoComplete
{

    public process(editor,token):ListGenerator
    {
        let cursor:CodeMirrorCursor = editor.getCursor();
        let line:string = editor.getLine(cursor.line);
        let start = cursor.ch;
        let end = cursor.ch;

        if((start>0&&line.charAt(start-1)==' ')||(line.length==0||line.charAt(0)==""))
            return this.GenerateList(editor)
                .AddItem('Math','','Math','Here you will find advanced aritmetical operations like sin or pow')
                .AddItem('Remote','','Remote','Here you can do Get/Post request to get information from other places');
         if(this.IsRemoteNerby(cursor,line))
             return this.GenerateList(editor)
                 .AddItem('Get:','Get($$URL$$,$$Args$$)','Get(URL,Args)','Execute a Get request using the specified $$URL$$ and $$Args$$(optional)')
                 .AddItem('Post:','Get($$URL$$,$$Args$$)','Post(URL,Args)','Execute a Post request using the specified $$URL$$ and $$Args$$(optional)');

        if(this.IsMathNerby(cursor,line))
            return this.GenerateList(editor)
                .AddItem('Abs:','abs($$x$$)','abs(x)','Returns the absolute value of $$x$$')
                .AddItem('Acos:','acos($$x$$)','acos(x)','Returns the arccosine of $$x$$, in radians')
                .AddItem('Asin:','asin($$x$$)','asin(x)','Returns the arcsine of $$x$$, in radians')
                .AddItem('Atan:','atan($$x$$)','atan(x)','Returns the arctangent of $$x$$ as a numeric value between -PI/2 and PI/2 radians')
                .AddItem('Ceil:','atan2($$y$$,$$x$$)','atan2(y,x)','Returns the arctangent of the quotient of its arguments')
                .AddItem('Atan2:','atan2($$y$$,$$x$$)','atan2(y,x)','Returns the arctangent of the quotient of its arguments')
                .AddItem('Ceil:','ceil($$x$$)','ceil(x)','Returns the value of $$x$$ rounded up to its nearest integer')
                .AddItem('Cos:','cos($$x$$)','cos(x)','Returns the cosine of $$x$$ ($$x$$ is in radians)')
                .AddItem('Exp:','exp($$x$$)','exp(x)','Returns the value of e<sup style="vertical-align: super;font-size: smaller;">$$x$$</sup>')
                .AddItem('Floor:','floor($$x$$)','floor(x)','Returns the value of $$x$$ rounded down to its nearest integer')
                .AddItem('Log:','log($$x$$)','log(x)','Returns the natural logarithm (base E) of $$x$$')
                .AddItem('Max:','max($$x$$, $$y$$, $$z$$, ..., $$n$$)','max(x, y)','Returns the number with the highest value')
                .AddItem('Min:','min($$x$$, $$y$$, $$z$$, ..., $$n$$)','min(x, y)','Returns the number with the lowest value')
                .AddItem('Pow:','pow($$x$$, $$y$$)','pow(x, y)','Returns the value of $$x$$ to the power of $$y$$')
                .AddItem('Random:','random()','random()','Returns a random number between 0 and 1')
                .AddItem('Sin:','sin($$x$$)','sin(x)','Returns the sine of $$x$$ ($$x$$ is in radians)')
                .AddItem('Sqrt:','sqrt($$x$$)','sqrt(x)','Returns the square root of $$x$$')
                .AddItem('Tan:','tan($$x$$)','tan(x)','Returns the tangent of an angle');


        if(this.IsFieldNerby(cursor,line))
            return this.GetIntellisenceforField(editor,cursor,line);

        return null;



    }




    private GenerateList(editor:any):ListGenerator
    {
        return new ListGenerator(editor);
    }

    private IsFieldNerby(cursor: CodeMirrorCursor, line: string) {
        return !(cursor.ch < 4 || line.charAt(cursor.ch - 1) != '.' || line.charAt(cursor.ch - 2) != '$'||line.charAt(cursor.ch - 3) != '$');

    }

    private IsMathNerby(cursor: CodeMirrorCursor, line: string) {
        return cursor.ch >= 5 && line.substr(cursor.ch - 5,5) =='Math.';

    }

    private IsRemoteNerby(cursor: CodeMirrorCursor, line: string) {
        return cursor.ch >= 7 && line.substr(cursor.ch - 7,7) =='Remote.';

    }

    private GetFieldById(id:string):sfFormElementBase<any>{
        for(let field of SmartFormsAddNewVar.FormBuilder.RedNaoFormElements)
            if(field.Id==id)
                return field;
        return null;
    }

    private GetIntellisenceforField(editor:any ,cursor: CodeMirrorCursor, line: string) {
        let index = cursor.ch - 3;
        let currentField = '';
        let fieldId='';
        while ((currentField = line.charAt(index)) != ' '&&index>0)
        {
            fieldId=currentField+fieldId;
            index--;
        }
        if(fieldId.length>2)
            fieldId=fieldId.substring(7,fieldId.length-1);
        let field=this.GetFieldById(fieldId);
        if(field==null)
            return;
        let dictionary=SFAutoCompleteFieldDictionary.GetDictionary(field.GetDataStore());
        if(dictionary!=null)
        {
            let list =this.GenerateList(editor);
            for(let method of dictionary.availableMethods)
                list.AddItem(method.label,method.label2,method.value,method.description);
            return list;
        }
        return null;


    }
}

class ListGenerator{
    public data:any;
    constructor(editor:any){
        let cursor=editor.getCursor();
        this.data={
            type:'html',
            list:[],
            from:cursor,
            to:cursor
        }
    }

    AddItem(label:string,label2:string,value:string,description:string):ListGenerator{
        let colorDictionary={};
        let labelElement=`<div style="line-height: 1.2em;padding:3px 0 3px 0;"><span class="sfFormulaLabel">${label}</span>${label2!=''?`<span class="sfFormulaLabel2">${this.StylizeText(colorDictionary,label2)}</span>`:''}<span class="sfFormulaDescription">${this.StylizeText(colorDictionary,description)}</span></div>`;
        this.data.list.push({label:labelElement,value:value});
        return this;
    }


    private StylizeText(colorDictionary:any,label: string) {
        let reg=/\$\$([^(\$\$)]+)\$\$/g
        let m;
        let count=-1;
        let colors=['red','blue','#008000','#8B008B'];
        while(m=reg.exec(label))
        {
            let color;
            if(typeof colorDictionary[m[1]]!='undefined')
                color=colorDictionary[m[1]];
            else{
                count++;
                color=colors[count];
                colorDictionary[m[1]]=color;
            }



            label=label.replace(m[0],`<span style="color:${color}">${m[1]}</span>`);
            reg.lastIndex=0;
        }
        return label;
    }
}

interface CodeMirrorCursor{
    ch:number;
    line:number;
}

declare let SFAutoCompleteFieldDictionary:any;