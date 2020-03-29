<?php


namespace Source\App\Models;


use Source\App\Models\Helper\StsRead;

class UpdateData
{
    private $data;
    public function updateDataUser($data)
    {
        $validateEmail = new EmailValidate();

        if($validateEmail->index($data["email"])=="success")
        {
            $user = new FindUser();
            $user_data = $user->findBySession();
            $id = $user_data[0]["id"];
            $name = filter_var($data["nome"],FILTER_SANITIZE_STRING);
            $email = filter_var($data["email"],FILTER_SANITIZE_STRING);
            $celular = filter_var(preg_replace("/[^0-9]/", "", $data["celular"]),FILTER_SANITIZE_STRING);
            $senha = filter_var($data["senha"],FILTER_SANITIZE_STRING);
            $update = new StsRead();
            $update->fullRead("update user set name=:name, email=:email, celular=:celular, senha=sha1(:senha) where id=:id",
                "name={$name}&email={$email}&celular={$celular}&senha={$senha}&id={$id}");
            $msg = "Success";
        }
        else
        {
            $msg = "Error";
        }

        return $msg;
    }
}