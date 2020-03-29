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
            $conn = new StsRead();
            $conn->fullRead("select * from user where email='{$data["email"]}'");
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
    public function insertUserImg($data)
    {
        $data = $data["user_img"];
        if($data["type"]=="image/jpeg" || $data["type"]=="image/png")
        {
            $name = $data["name"];
            $image = $data["tmp_name"];
            $user = new FindUser();
            $user_data = $user->findBySession();
            $id = $user_data[0]["id"];
            $path = ASSETS_URL.'/user_img/'.$name;
            $insert = new StsRead();
            $insert->fullRead("insert into user_img(id_user,image) values(:user_id,:user_img)",
                "user_id={$id}&user_img={$path}");
            move_uploaded_file($image,"assets/user_img/$name");
        }
        else
        {
            return "<script>alert('Algo deu errado!')</script>";
        }
    }
}