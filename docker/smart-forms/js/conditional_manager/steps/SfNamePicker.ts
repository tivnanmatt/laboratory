class SfNamePicker extends SfConditionalStepBase<any> {
    protected Title:JQuery;
    constructor(translations, formBuilder, stepConfiguration,stepList) {
        super(translations, formBuilder, stepConfiguration,stepList);
    }


    public InitializeScreen(container) {
        container.css('text-align', 'left');
        container.css('padding-left', '5px');
        container.css('padding-right', '5px');

        container.append('<h2 style="text-align: left">' + this.Translations[this.StepConfiguration.Label] + '</h2>');

        let name = this.Translations["MyNewCondition"] + " " + this.StepConfiguration.Id;
        if (!this.StepConfiguration.IsNew) {
            name = this.StepConfiguration.Options.Name;
        }
        this.Title = rnJQuery('<input type="text" style="width: 100%;height: 40px;font-size: 20px;padding: 10px;">');
        this.Title.val(name);
        container.append(this.Title);

    };

    public  Exit() {

    };

    public Commit() {
        if (this.Title.val().trim() == "") {
            alert(this.Translations["TheTitleCantBeEmpty"]);
            return false;
        }

        this.StepConfiguration.Options.Name = this.Title.val();
        return true;
    };
}

(window as any).SfNamePicker=SfNamePicker;