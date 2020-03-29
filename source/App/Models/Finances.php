<?php
namespace Source\App\Models;
use Source\App\Models\Helper\StsRead;
class Finances
{
    private $data;
    private $select;
    public function findUserAccount()
    {
        $email = filter_var($_SESSION["Logado"],FILTER_SANITIZE_STRING);
        $senha = filter_var($_SESSION["confirm"],FILTER_SANITIZE_STRING);
        $find = new StsRead();
        $this->select = "select user.*, user_conta_principal.*, user_despesas.* from user ";
        $this->select.="inner join user_conta_principal on user_conta_principal.id_user = user.id ";
        $this->select.="inner join user_despesas on user_despesas.id_conta = user_conta_principal.id ";
        $this->select.="where sha1(user.email) = '{$email}' and user.senha = '{$senha}' order by user_despesas.id desc";
        $find->fullRead($this->select);
        if(count($find->getResultado())>0)
        {
            $this->data=$find->getResultado();
        }
        else
        {
            $this->select = "select user.*, user_conta_principal.* from user ";
            $this->select.="inner join user_conta_principal on user_conta_principal.id_user = user.id ";
            $this->select.="where sha1(user.email) = '{$email}' and user.senha = '{$senha}'";
            $find->fullRead($this->select);
            $this->data = $find->getResultado();
        }
        return $find->getResultado();
    }
    public function addAccount($id,$renda,$meta)
    {
        $email = filter_var($_SESSION["Logado"],FILTER_SANITIZE_STRING);
        $senha = filter_var($_SESSION["confirm"]);
        $this->select = "select * from user_conta_principal where id_user=(select id from user";
        $this->select.=" where sha1(email)=:email and senha=:senha)";
        $insert = new StsRead();
        $insert->fullRead($this->select,
            "email={$email}&senha={$senha}");
        if(count($insert->getResultado())>0)
        {
            $return = "Error";
        }
        else
        {
            $this->select = "insert into user_conta_principal(id,id_user,renda_total_mes,meta_mes)";
            $this->select.="values(null,:id_user,:renda_total_mes,:meta_mes)";
            $insert->fullRead($this->select,"id_user={$id}&renda_total_mes={$renda}&meta_mes={$meta}");
            $return = "success";
        }
        return $return;
    }
    public function addExpend($data)
    {

        $userData = new FindUser();
        $this->data=$userData->findBySession();
        $id = filter_var($this->data[0]["id"],FILTER_SANITIZE_NUMBER_INT);
        $descricao = filter_var($data["descricao_despesa"],FILTER_SANITIZE_STRING);
        $valor = filter_var($data["valor_despesa"],FILTER_SANITIZE_STRING);
        $this->select = "insert into user_despesas(id_conta,valor,descricao,data_despesa) ";
        $this->select.="values((select id from user_conta_principal where id_user=:id_user),";
        $this->select.=":valor,:descricao,now())";
        if(!empty($id) and !empty($descricao) and !empty($valor) and $valor>0)
        {
            $add = new StsRead();
            $add->fullRead($this->select,"id_user={$id}&valor={$valor}&descricao={$descricao}");
            $return = "Success";
        }
        else
        {
            $return = "Erro";
        }
        return $return;
    }
}