<?php
namespace Source\App\Models;
use Source\App\Models\Helper\StsRead;

class FindUser
{
    private $data;
    private $select;
    public function findBySession()
    {
        $email = filter_var($_SESSION["Logado"],FILTER_SANITIZE_STRING);
        $senha = filter_var($_SESSION["confirm"],FILTER_SANITIZE_STRING);
        $find = new StsRead();

        $this->select = "select user.*, user_img.image from user inner join user_img on user_img.id_user=user.id";
        $this->select.=" where sha1(email)=:email and senha=:senha";
        $find->fullRead($this->select,"email={$email}&senha={$senha}");
        if(count($find->getResultado())>0)
        {
            $this->data=$find->getResultado();
        }
        else
        {
            $find->exeRead("user","where sha1(email)=:email and senha=:senha",
                "email={$email}&senha={$senha}");
            if($find->getResultado()>0)
            {
                $this->data=$find->getResultado();
            }
            else
            {
                $this->data = "Erro";
                $_SESSION["Logado"] = null;
                $_SESSION["confirm"] = null;
            }
        }
        return $this->data;
    }
}