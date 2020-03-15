<?php
namespace Source\App\Models;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;
class SendMail
{
    private $mail;
    private $data;
    private $error;
    public function __construct()
    {
        $this->mail = new PHPMailer(true);

        $this->mail->SMTPDebug = SMTP::DEBUG_SERVER;
        $this->mail->isSMTP();
        $this->mail->setLanguage("br");
        $this->mail->SMTPAuth = true;
        $this->mail->CharSet = PHPMailer::CHARSET_UTF8;

        $this->mail->SMTPSecure = "tls";
        $this->mail->Host = "smtp.live.com";
        $this->mail->Username = "julianopaulo.santos@hotmail.com";
        $this->mail->Password = "24759383Jl2932";
        $this->mail->Port = 587;
        $this->mail->isHTML(true);
    }
    public function add( string $body, string $recipient_name, string $recipient_mail)
    {
        @$this->data->body = $body;
        $this->data->recipient_name = $recipient_name;
        $this->data->recipient_mail = $recipient_mail;
        return "success";
    }
    public function send(string $from_mail, string $from_name, $reply_to)
    {
        try {
            $this->mail->Subject = "Contato Site de Contabilidade";#Assunto
            $this->mail->msgHTML($this->data->body);#Corpo do E-mail
            $this->mail->AltBody = "";#Corpo do E-mail simples para E-mail sem html
            $this->mail->addAddress($this->data->recipient_mail,$this->data->recipient_name);
            $this->mail->setFrom($from_mail,$from_name);
            $this->mail->addReplyTo($reply_to,$from_name);
            $this->mail->send();
            $return = "Success";
        }
        catch (Exception $e)
        {
            #$return = $this->mail->ErrorInfo = $e;
            $return = "error";
        }
        return $return;
    }
    public function error()
    {
        return "error";
        #return $this->error;
    }
}