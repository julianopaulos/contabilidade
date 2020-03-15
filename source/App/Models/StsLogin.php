<?php
namespace Source\App\Models;
use Source\App\Models\Helper\StsRead;

class StsLogin
{
    private $senha;
    public function validateLogin($data)
    {
        $email = new EmailValidate();
        if($email->index($data["email"]) == "success")
        {

            $this->senha = sha1(filter_var($data["senha"],FILTER_SANITIZE_STRING));
            $conn = new StsRead();
            $conn->fullRead("select * from user where email='{$data["email"]}' and senha='{$this->senha}'");
            (count($conn->getResultado())>0)?$return="Success":$return="error";
        }
        else
        {
            $return = $email->index($data["email"]);
        }
        return $return;
    }
}