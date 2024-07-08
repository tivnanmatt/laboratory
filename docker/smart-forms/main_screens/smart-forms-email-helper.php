<?php



wp_enqueue_script('jquery');
wp_enqueue_script('isolated-slider',SMART_FORMS_DIR_URL.'js/rednao-isolated-jq.js',array('jquery'),SMART_FORMS_FILE_VERSION);
wp_enqueue_script('smart-forms-email-helper',SMART_FORMS_DIR_URL.'js/main_screens/smart-forms-email-helper.js','isolated-slider',SMART_FORMS_FILE_VERSION);

wp_localize_script('smart-forms-email-helper', 'smartFormsEmailHelper', array(
    'nonce' =>wp_create_nonce('save_nonce'),
    'save_nonce' =>wp_create_nonce('save_nonce')
));
require_once(SMART_FORMS_DIR.'smart-forms-bootstrap.php');
?>

<style type="text/css">
    .sfPanelEmail{
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        border-radius: 10px;
        -webkit-box-shadow: -12px 17px 10px -10px rgba(87,87,87,1);
        -moz-box-shadow: -12px 17px 10px -10px rgba(87,87,87,1);
        box-shadow: -12px 17px 10px -10px rgba(87,87,87,1);
        background-color:#efefef;
        border-color:#cfcfcf;
        border-width: 1px;;
        border-style: solid;;

    }

    .sfExplanation p{
        font-size: 20px;
    }

    .alert
    {
        margin-bottom:3px !important;;
    }
</style>


<?php
$formId='';
$emailIndex='';

if(isset($_GET["form_id"]))
    $formId=intval($_GET["form_id"]);

if(isset($_GET["email_index"]))
    $emailIndex=intval($_GET['email_index'])

?>
<script type="application/javascript"  language="JavaScript">
    var formId=<?php echo intval($formId)?> ;
    var emailIndex=<?php echo intval($emailIndex) ?>;

</script>

<div class="bootstrap-wrapper" style="width: 100%;height: 100%; ">
    <h1>Email Doctor</h1>
    <h2>Please follow the instructions bellow to check what is going on</h2>
    <table style="width: 100%;height: 100%;">
        <tr>
            <td style="width: 50%;">
                <div style="min-height: 400px; margin:10px 5px 0 10px;padding:5px;font-size: 20px;display: none; " class="sfPanelEmail sfExplanation">
                    <div id="sfAskEmailText" style="display: none;" class="alert alert-warning">

                    </div>
                    <div style="margin-top: 40px;">
                        <p><span style="color:red;">To which email address should we send this email?</span><br/> <strong>Important:</strong> it is recommended to send the email to a popular provider like gmail or hotmail. Also please make sure to check the spam folder</p>
                        <div id="sfEmailComponents">
                            <input class="form-control sfEmail" type="email" value="" placeholder="Email Address" style="padding: 30px;text-align: center;font-size: 30px;" />
                        </div>
                        <button class="btn btn-primary sfSend" style="margin-top:2px;  padding: 20px 30px 20px 30px" ><span class="glyphicon glyphicon-send"></span> Send Email</button>
                    </div>

                    <div class="sfPanelDidYouReceivedIt" style="display: none;">
                        <h2>Did you received the email?, it can take a few minutes depending on your email provider (you can try again with another email address if you want)</h2>
                        <button class="btn btn-success sfTextPassed" style="margin-top:2px;  padding: 20px 30px 20px 30px" ><span class="glyphicon glyphicon-ok"></span>Yes</button>
                        <button class="btn btn-danger sfTextFailed" style="margin-top:2px;  padding: 20px 30px 20px 30px" ><span class="glyphicon glyphicon-remove"></span> No</button>
                    </div>
                </div>
            </td>
            <td style="vertical-align: top;">
                <div style="min-height: 400px;margin:10px 10px 0 5px; padding: 5px;display: none;" class="sfPanelEmail sfPanelBadge">
                </div>

            </td>
        </tr>
    </table>
</div>