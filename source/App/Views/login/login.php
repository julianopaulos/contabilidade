<style>
    body
    {
        background: url("assets/imagens/fundo_login.jpg");
        background-size: cover;
        margin-top: 50px;
    }
    .cadastro
    {
        max-height: 400px;
        max-width: 350px;
        opacity: 0.9;
    }
    .cadastro_container form
    {
        margin-top: 50px;
    }
    @media screen and (max-width: 425px) {
        .cadastro
        {
            margin-left: 9%;
        }
    }
    @media screen and (max-width: 320px) {
        .cadastro
        {
            margin-left: 3%;
        }
    }
</style>
<div class="cadastro container-fluid">
    <div class="cadastro_container">
        <h3>Bem vindo de volta!</h3>
        <div>
            <form action="login" method="post">
                <label for=""><input type="email" placeholder="Digite seu email" name="email" required></label>
                <label for=""><input type="password" placeholder="Digite sua senha" name="senha" required></label>
                <label for=""><input type="submit" value="Entrar" class="btn-primary"></label>
                <div class="ok">Logado com  sucesso!</div>
                <div class="erro">E-mail ou senha incorretos, verifique seus dados!</div>
            </form>
        </div>
    </div>
</div>
<div class="ajax_load">
    <div class="ajax_load_box">
        <div class="ajax_load_box_circle"></div>
        <div class="ajax_load_box_title">Aguarde, carregando!</div>
    </div>
</div>
<script src="assets/js/validacao.js"></script>
