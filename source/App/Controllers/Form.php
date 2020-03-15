<?php
namespace Source\App\Controllers;
use Source\App\Models\MailConfigure;
use Source\App\Models\Register;
use Source\App\Models\StsLogin;

class Form
{
    public function registerSend($data)
    {
        $insert = new Register();
        $message["message"] = $insert->insert($data);
        echo json_encode($message);

    }
    public function loginSend($data)
    {
        $login = new StsLogin();
        $message["message"] = $login->validateLogin($data);
        if($message["message"] == "Success")
        {
            $_SESSION["Logado"] = $data["email"];
            echo json_encode($message);
        }
        else
        {
            echo json_encode($message);
        }
    }
    public function contactSend($data)
    {
        $sendMail = new MailConfigure();
        $sendMail->index($data);
        $message["message"] = "true";
        echo json_encode($message);
    }
}