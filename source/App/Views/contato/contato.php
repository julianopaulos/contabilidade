<style>
    body
    {
        background: url("assets/imagens/fundo_contato.jpg") left no-repeat;
        background-size:cover;
        margin-top: 20px;
    }

</style>
<div class="cadastro contato container-fluid">
    <div class="cadastro_container">
        Entre em contato para esclarecer suas dúvidas!
        <div>
            <form method="post">
                <label for=""><input type="text" placeholder="Seu nome completo" name="nome" required></label>
                <label for=""><input type="email" placeholder="Seu email" name="email" required></label>
                <label for="">
                    <textarea  cols="22" rows="3" class="textarea" name="corpo" placeholder="Escreva aqui sua mensagen"></textarea>
                </label>
                <label for=""><input type="submit" value="Enviar E-mail" class="btn-primary btn-success"></label>
                <div class="ok">E-mail enviado com  sucesso!</div>
                <div class="erro">E-mail incorreto! Digite um válido!</div>
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
<script src="<?=ASSETS_URL?>/js/contato.js"></script>
