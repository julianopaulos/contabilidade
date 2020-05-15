<?php
namespace Source\App\Controllers;
use Source\App\Controllers\ConfigView;
class Web
{
    public function home()
    {
        $renderizar = new ConfigView("home/home",null,"Home");
        $renderizar->render();
    }
    public function register()
    {
        $renderizar = new ConfigView("cadastro/cadastro",null,"Página de cadastro");
        $renderizar->render();
    }
    public function login()
    {
        $renderizar = new ConfigView("login/login",null,"Login de usuário");
        $renderizar->render();
    }


    public function contact()
    {
        $url = URL_BASE;
        $renderizar = new ConfigView("contato/contato",$url,"Contato");
        $renderizar->render();
    }

    public function error($data)
    {
        $renderizar = new ConfigView("erro/erro",$data,"Erro inesperado");
        $renderizar->render();
    }
}