rnJQuery(function () {
    if (rnparams.SmartFormsEnableGDPR == 'y')
        rnJQuery('#inputGDPR').attr('checked', 'checked');
    rnJQuery('#smartFormsSave').click(function () {
        try {
            rnJQuery('#smartFormsSave').RNWait('start');
        }
        catch (exception) {
        }
        var options = [];
        options.push({
            key: 'SmartFormsEnableGDPR',
            value: rnJQuery('#inputGDPR').is(':checked') ? 'y' : 'n'
        });
        rnJQuery.post(ajaxurl, {
            action: 'rednao_smart_forms_save_settings',
            nonce: rnparams.nonce,
            options: options
        }, function (result) {
            result = JSON.parse(result);
            rnJQuery('#smartFormsSave').RNWait('stop');
            if (result != 0) {
                toastr["error"]('Invalid request, please refresh the screen and try again');
                return;
            }
            else {
                toastr["success"]("Settings saved successfully");
            }
        });
    });
});
//# sourceMappingURL=settings.js.map