<?php

    require __DIR__."/vendor/autoload.php";
    use CoffeeCode\Router\Router;
    $router = new Router(URL_BASE);
    $router->namespace("Source\App\Controllers");
    $router->group(null);
    $router->get("/","Web:home");

    ##HOME
    $router->group("home");
    $router->get("/","Web:home");
    #$router->get("/{filter}","Web:home");
    #$router->get("/{filter}/{page}","Web:home");


    ##CADASTRO
    $router->group("cadastro");
    $router->get("/","Web:register");
    $router->post("/","Form:registerSend");

    ##LOGIN
    $router->group("login");
    $router->get("/","Web:login");
    $router->get("/home","");
    $router->post("/","Form:loginSend");

    #LOGADO
    $router->group("logado");
    $router->get("/","Logged:home");
    $router->get("/logado","Logged:home");
    $router->post("/","LoggedForm:addExpense");
    #PERFIL DE USER
    $router->get("/profile","Logged:profile");
    $router->post("/profile","Logged:changeData");
    #DESLOGAR
    $router->get("/sair","Logged:logout");
    ##CONTATO
    $router->group("contato");
    $router->get("/","Web:contact");
    $router->post("/","Form:contactSend");
    ##ADMIN
    #$router->group("admin");
    #$router->get("/","Admin:home");

    #ERROS
    $router->group("erro");
    $router->get("/{errcode}","Web:error");
    $router->dispatch();
    if($router->error())
    {
        $router->redirect("/erro/{$router->error()}");
    }