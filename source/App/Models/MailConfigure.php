<?php


namespace Source\App\Models;


class MailConfigure
{
    public function index($data)
    {
        $mailConfigure = new EmailValidate();
        if($mailConfigure->index($data["email"]) == "success")
        {
            $from_mail = filter_var($data["email"],FILTER_SANITIZE_STRING);
            $from_name = filter_var($data["nome"],FILTER_SANITIZE_STRING);
            $body_text = filter_var($data["corpo"],FILTER_SANITIZE_STRING);

            $sendMail = new SendMail();
            $sendMail->add($body_text,"Juliano Paulo","julisnopaulo.santos@gmail.com");
            $sendMail->send($from_mail,$from_name,$from_mail);
            if($sendMail->error())
            {
                $return = "erro ao enviar email";
            }
            else
            {
                $return = "Success";
            }
        }
        else
        {
            $return = "E-mail inválido";
        }
        return $return;
    }
}