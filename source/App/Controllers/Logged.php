<?php
namespace Source\App\Controllers;

class Logged
{
    public function home()
    {
        if(isset($_SESSION['Logado']))
        {
            $render = new ConfigView("Logado/home/home",null,"Página Inicial");
            $render->render();
        }
        else
        {
            header('location:http://localhost/administrador_contabil/login');
        }
    }
    public function logout()
    {
        session_destroy();
        header('location:http://localhost/administrador_contabil/home');
    }
}
