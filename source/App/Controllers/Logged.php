<?php
namespace Source\App\Controllers;

use Source\App\Models\FilterByDate;
use Source\App\Models\Finances;
use Source\App\Models\FindUser;
use Source\App\Models\Register;
use Source\App\Models\UpdateData;

class Logged
{
    private $data;
    public function home()
    {
        if(isset($_SESSION['Logado']) and !empty($_SESSION["Logado"]) &&
             isset($_SESSION['confirm']) and !empty($_SESSION["confirm"]))
        {
            $dataAccount = new Finances();
            $this->data["user_account"]=$dataAccount->findUserAccount();
            $data = new FindUser();
            $this->data["user"]=$data->findBySession();
            $render = new ConfigView("Logado/home/home",$this->data,"Página Inicial");
            $render->render();
        }
        else
        {
            $this->logout();
        }
    }
    public function addExpense($data)
    {
        $this->data = $data;
        var_dump($this->data);
    }
    public function logout()
    {
        session_destroy();
        header('location:'.URL_BASE);
    }
    public function profile()
    {
        if(isset($_SESSION['Logado']) and !empty($_SESSION["Logado"]) &&
            isset($_SESSION['confirm']) and !empty($_SESSION["confirm"]))
        {
            $data = new FindUser();
            $this->data=$data->findBySession();
            $render = new ConfigView("Logado/conta/conta",$this->data,"Dados do usuário");
            $render->render();
        }
        else
        {
            $this->logout();
        }
    }
    public function changeData()
    {
        if(isset($_FILES["user_img"]) and !empty($_FILES["user_img"]))
        {
            $insert = new Register();
            $insert->insertUserImg($_FILES);
            header('location:profile');
        }
        else
        {
            $update = new UpdateData();
            echo json_encode($update->updateDataUser($_POST));
        }
    }
    public function filter()
    {
        $filter = new FilterByDate();
         echo json_encode($filter->findByDate($_SERVER["REQUEST_URI"]));
    }
    public function allFinances()
    {
        $all = new FilterByDate();
        echo json_encode($all->all());
    }
}
