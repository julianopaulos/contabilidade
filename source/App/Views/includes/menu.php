<header>
    <div class="container">
        <nav class="navbar-fixed-top navbar-inverse">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#barraBasica">
                    <span class="sr-only">Toggle navigation</span><!--Dica para tecnologias assistivas. Notar a classe sr-only
                     mostrar este conteúdo somente para aquelas tecnologias--->
                    <span class="icon-bar"></span><!--Classe icon-bar para criar as três linhas do ícone hamburger. -->
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <div class="collapse navbar-collapse" id="barraBasica">
                    <a class="navbar-brand" href="<?=URL_BASE?>/logado">Home</a>
                    <ul class="nav navbar-nav text-right">
                        <li>
                            <a href="<?=URL_BASE?>/logado/profile" class="navbar-brand">Perfil</a>
                        </li>
                        <li>
                            <a href="<?=URL_BASE?>/logado" class="navbar-brand">Contato</a>
                        </li>
                        <li>
                            <a href="<?=URL_BASE?>/logado/sair" class="navbar-brand">Sair</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </div>
</header>
<noscript>Esse site precisa de JavaScript para funcionar corretamente, ative seguindo essas instruções:
    <a href="https://www.hostnet.com.br/info/ativar-o-javascript-no-navegador/" target="_blank">Aqui</a>
</noscript>