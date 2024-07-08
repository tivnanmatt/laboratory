<?php
/**
 * Created by PhpStorm.
 * User: Edgar
 * Date: 6/19/2015
 * Time: 10:26 AM
 */

abstract class smart_forms_email_troubleshoot_base {

    public $LatestError="";
    public function __construct()
    {

    }

    public abstract function Start();

}


/*-------------------------------------------------------------------basic-------------------------------------------------------------------------*/
class smart_forms_email_troubleshoot_basic extends smart_forms_email_troubleshoot_base {
    public function __construct()
    {

    }

    public function Start()
    {
        $to=$this->GetPostValue("To");
        global $current_user;
        $headers = "MIME-Version: 1.0\r\n" .
            "From: " . $current_user->user_email . "\r\n" .
            "Content-Type: text/plain; charset=\"" . get_option('blog_charset') . "\"\r\n";
        if(wp_mail( $to,"Smart Forms Test Email", "Test successful!, so your site can accept emails, lets continuing checking what is going wrong.", $headers ))
            return true;
        return false;
    }


    function GetPostValue($parameterName)
    {
        if(isset($_POST[$parameterName]))
            if(is_array(($_POST[$parameterName])))
                return sanitize_text_field($_POST[$parameterName]);
            else
                return sanitize_text_field(stripslashes($_POST[$parameterName]));

        return "";
    }
}

/*-------------------------------------------------------------------basic-------------------------------------------------------------------------*/
class smart_forms_email_troubleshoot_custom_smtp extends smart_forms_email_troubleshoot_base {
    public function __construct()
    {

    }

    function GetPostValue($parameterName)
    {
        if(isset($_POST[$parameterName]))
            if(is_array(($_POST[$parameterName])))
                return sanitize_text_field($_POST[$parameterName]);
            else
                return sanitize_text_field(stripslashes($_POST[$parameterName]));

        return "";
    }

    public function Start()
    {

        $errors = '';
        require_once( ABSPATH . WPINC . '/class-phpmailer.php' );
        $mail = new PHPMailer();

        $from_name  = sanitize_email($this->GetPostValue("FromEmailAddress"));
        $from_email = sanitize_email($this->GetPostValue("FromEmailAddress"));
        $mail->IsSMTP();
        $mail->SMTPAuth = true;
        $mail->Username =$this->GetPostValue("FromEmailAddress");
        $mail->Password = $this->GetPostValue("FromEmailPassword");
        $mail->SMTPSecure="ssl";



        $mail->Host = 'smtp.mail.yahoo.com';
        $mail->Port = '465';
        $mail->SetFrom( $from_email, $from_name );
        $mail->isHTML( true );
        $mail->Subject = utf8_decode($this->GetPostValue("EmailSubject"));
        $mail->MsgHTML($this->GetPostValue("EmailText"));
        $mail->AddAddress( sanitize_email($this->GetPostValue("ToEmail")));
        $mail->SMTPDebug = true;
        ob_start();

        if ( ! $mail->Send() )
            $errors = $mail->ErrorInfo;
        $smtp_debug = ob_get_clean();
        $mail->ClearAddresses();
        $mail->ClearAllRecipients();

        if ( ! empty( $errors ) ) {
            $this->LatestError='Error:'.$errors.'\r\n Detail:'.$smtp_debug;

            return false;
        }
        else{
            return true;
        }
    }


}

