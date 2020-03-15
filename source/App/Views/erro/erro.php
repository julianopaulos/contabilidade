<meta http-equiv="refresh" content="1; URL='http://localhost/administrador_contabil'">
<style>
    body {
        margin-bottom: 30px;
        margin-top: 30px;
        background: #00CCCC;
    }
    header{
        margin-bottom: 20px !important;
    }
    html {
        position: relative;
        min-height: 100%;
    }
    head
    {
        display: block;
    }
    .navbar-inverse
    {
        background:black;
    }
    .navbar-inverse .text-right
    {
        margin-left: 60em;
    }
    .navbar-inverse .navbar-brand:hover, .navbar-inverse .navbar-nav li a:hover
    {
        color: lightblue;
        font-style: italic;
        font-weight: 700;
    }
    .container
    {
        color:black;
        margin-top: 100px;
    }

    .footer{
        position: absolute;
        bottom: 0;
        width: 100%;
        height:50px;
        line-height: 50px;
        color: #FFF;
        background:black;
    }
    @media screen and (max-width: 768px){
        body
        {
            margin-top: 100px;
            margin-bottom: 0;
        }
        .container
        {
            margin-left: 0;
        }
        .navbar-inverse .text-right
        {
            margin-left: 24em;
        }
    }
    @media screen and (max-width: 425px){
        .navbar-inverse .text-right
        {
            margin-left: 0;
        }
    }
</style>

<div class="container text-center"><h1>Ops, ocorreu um erro inesperado [<?=$this->data['errcode']?>], Você
    já está sendo redirecionado de volta a página inicial!</h1>
</div>

