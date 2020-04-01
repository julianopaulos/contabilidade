<?php
namespace Source\App\Controllers;
use Source\App\Models\Finances;
use Source\App\Models\FindUser;

class LoggedForm
{
    private $data;
    public function addExpense($data)
    {
        $expense = new Finances();
        if(isset($data["renda_mensal"]) and !empty($data["renda_mensal"]))
        {
            $idUser = new FindUser();
            $dataUser = $idUser->findBySession();
            $id = filter_var($dataUser[0]["id"],FILTER_SANITIZE_STRING);
            $renda = filter_var($data["renda_mensal"],FILTER_SANITIZE_NUMBER_FLOAT);
            $meta = filter_var($data["meta_mensal"],FILTER_SANITIZE_NUMBER_FLOAT);
            $this->data["message"] = $expense->addAccount($id,$renda,$meta);
        }
        else
        {
            $this->data["message"] = $expense->addExpend($data);
        }
        echo json_encode($this->data);
    }
    public function removeExpense()
    {
        $id = apache_request_headers();
        $delete = new Finances();
        $delete->deleteExpend((int)$id["id_delete"]);
    }
}