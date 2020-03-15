<?php


namespace Source\App\Controllers;


class ConfigView
{
    private $nome;
    private $title;
    private $data;
    public function __construct($nome,$data = null, $title)
    {
        $this->nome=$nome;
        $this->data = $data;
        $this->title=$title;
    }
    public function render()
    {
        if($this->nome=="contato/contato" || $this->nome=="login/login" ||
            $this->nome=="cadastro/cadastro" || $this->nome=="home/home" || $this->nome=="erro/erro")
        {
            require URL_VIEWS."/includes/header.php";
            require URL_VIEWS."/includes/menu_inicial.php";
            require URL_VIEWS."/{$this->nome}.php";
            require URL_VIEWS."/includes/footer.php";
        }
        else
        {
            require URL_VIEWS."/includes/header.php";
            require URL_VIEWS."/includes/menu.php";
            require URL_VIEWS."/{$this->nome}.php";
            require URL_VIEWS."/includes/footer.php";
        }
    }
}