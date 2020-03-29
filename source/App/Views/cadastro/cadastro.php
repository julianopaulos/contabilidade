<style>
    body
    {
        background: url("assets/imagens/fundo_cadastro.jpg");
        background-size: cover;
        margin-top: 20px;
    }
    .cadastro_container
    {
        margin-top: 20px;
    }
    @media screen and (max-width: 320px) {
        .cadastro
        {
            margin-top: 60px;
        }

    }

</style>
<div class="cadastro container-fluid">
    <div class="cadastro_container">
        Comece agora mesmo a administrar seu dinheiro!
        <div>
            <form action="cadastro" method="post">
                <label for=""><input type="text" placeholder="Seu nome completo" name="nome" required></label>
                <label for=""><input type="email" placeholder="Seu email" name="email" required></label>
                <label for=""><input type="text" placeholder="Celular" name="celular" required></label>
                <label for=""><input type="password" placeholder="Crie uma senha" name="senha_cadastro" required></label>
                <label for=""><input type="submit" value="Cadastrar" class="btn-primary btn-success"></label>
                <div class="ok">Usuário cadastrado  com  sucesso!</div>
                <div class="erro">Dados inválidos ou e-mail já cadastrado! Verifique os dados e tente novamente</div>
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
<script src="<?=ASSETS_URL?>/js/cadastro.js"></script>
