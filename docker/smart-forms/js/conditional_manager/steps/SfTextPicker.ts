class SfTextPicker extends SfConditionalStepBase<any> {
    protected Title:JQuery;
    constructor(translations, formBuilder, stepConfiguration,stepList) {
        super(translations, formBuilder, stepConfiguration,stepList);

    }


    public InitializeScreen(container) {
        container.css('text-align', 'left');
        container.css('padding-left', '5px');
        container.css('padding-right', '5px');

        container.append('<h2 style="text-align: left">' + this.Translations[this.StepConfiguration.Label] + '</h2>');

        let name = 'Invalid value';
        if(typeof this.StepConfiguration.Options!='undefined'&& typeof this.StepConfiguration.Options.Text!="undefined")
            name=this.StepConfiguration.Options.Text;
        this.Title = rnJQuery('<input type="text" style="width: 100%;height: 40px;font-size: 20px;padding: 10px;">');
        this.Title.val(name);
        container.append(this.Title);

    };

    public Exit() {

    };

    public Commit() {

        this.StepConfiguration.Options.Text = this.Title.val();
        return true;
    }

}

(window as any).SfTextPicker=SfTextPicker;