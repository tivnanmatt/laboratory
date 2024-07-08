rnJQuery(()=>{
    if(rnparams.SmartFormsEnableGDPR=='y')
        rnJQuery('#inputGDPR').attr('checked','checked');
   rnJQuery('#smartFormsSave').click(()=>{
       try{
        rnJQuery('#smartFormsSave').RNWait('start');
       }catch(exception)
       {

       }

        let options:{key:string,value:string}[]=[];
        options.push({
            key:'SmartFormsEnableGDPR',
            value:rnJQuery('#inputGDPR').is(':checked')?'y':'n'
        });


        rnJQuery.post(ajaxurl,{
            action:'rednao_smart_forms_save_settings',
            nonce:rnparams.nonce,
            options:options
        },result=>{
            result=JSON.parse(result);
            rnJQuery('#smartFormsSave').RNWait('stop');
            if(result!=0)
            {

                toastr["error"]('Invalid request, please refresh the screen and try again');
                return;
            }else{
                toastr["success"]("Settings saved successfully")
            }



        });

   })
});

declare let toastr:any;
declare let rnparams:any;