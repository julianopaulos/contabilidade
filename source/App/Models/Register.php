<?php


namespace Source\App\Models;
use Source\App\Models\Helper\StsRead;

class Register
{
    private $data;

    public function insert($data)
    {
        $email = new EmailValidate();
        if($email->index($data["email"]) == "success")
        {
            $senha = sha1(filter_var($data["senha_cadastro"],FILTER_SANITIZE_STRING));
            $conn = new StsRead();
            $conn->fullRead("select * from user where email='{$data["email"]}' and senha='{$senha}'");
            if((count($conn->getResultado())>0))
            {
                $return = "error";
            }
            else
            {
                $name = filter_var($data["nome"],FILTER_SANITIZE_STRING);
                $email = filter_var($data["email"],FILTER_SANITIZE_STRING);
                $cel =  filter_var(preg_replace("/[^0-9]/", "", $data["celular"]),FILTER_SANITIZE_STRING);
                $senha = filter_var($data["senha_cadastro"],FILTER_SANITIZE_STRING);
                $insert = new StsRead();
                $insert->fullRead("insert into user(name,email,celular,senha)values('{$name}','{$email}',{$cel},sha1({$senha}))");
                $return = "Success";
            }
        }
        else
        {
            $return = $email->index($data["email"]);
        }

        return $return;
    }
}