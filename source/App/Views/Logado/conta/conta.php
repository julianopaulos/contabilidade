<style>
    body
    {
        background: #00CCCC;
        word-wrap: break-word;
    }
    .container-fluid
    {
        margin-left: 0;
    }

    .profile-container .row
    {
        margin-left: auto;
        margin-right: auto;
    }
    .profile-container .row .col-md-4,.col-md-5
    {
        background: #fff;
        min-height: 50px;
        margin: 10px 5px;
        border-radius: 5px;
        padding: 10px;
    }
    .profile-container .user_icon
    {
        max-width: 200px;
        margin: auto;
    }
    .profile-container .cadastro_container
    {
        padding: 0;
        margin: 0;
    }
    .profile-container .cadastro_container label
    {
       margin: 10px auto;
    }
    .div-img
    {
        display: none;
    }
    .div-img,.div_img_user
    {
        margin: auto;
        overflow: hidden;
        border-radius: 90%;
        width: 160px;
        height: 150px;
        background: black;
    }
    #image
    {
        width: 100%;
        height: 100%;
    }
    .profile-container h3
    {
        font-weight: bold;
    }
    @media screen and (max-width: 425px){
        .profile-container .user_icon img
        {
            width: 100px;
            height: 100px;
        }
    }
</style>
<div class="profile-container container-fluid text-center">
    <div class="row">

        <div class="col-md-1"></div>
        <div class="col-md-4">
            <?php
            if(isset($this->data[0]["image"])):
                ?>
                <div class="div_img_user">
                        <img
                            src="<?=$this->data[0]["image"]?>"
                            alt="ProfileImg"
                            class="img-fluid"
                            style="width:100%;height: 100%"
                            title="Foto de perfil"
                        />
                </div>
            <?php
            else:
                ?>
                <div class="user_icon">
                    <a href="#modalImg" data-toggle="modal">
                        <img
                            src="<?=ASSETS_URL?>/imagens/user_icon.png"
                            alt="Imagem"
                            title="Adicione uma imagem de perfil"
                            class="img-fluid"
                        />
                    </a>
                </div>
            <?php
            endif;
            $data_name = explode(" ",$this->data[0]["name"]);
            ?>
            <h3><?=$data_name[0]?> <?=end($data_name)?></h3>
        </div>
        <div class="col-md-5">
            <div class="container-fluid">
                <div class="cadastro_container">
                    <h3>Dados Registrados:</h3>
                    <div>
                        <form action="" method="post">
                            <label for="">
                                <input
                                    type="text"
                                    placeholder="Seu nome completo"
                                    name="nome"
                                    value="<?=$this->data[0]["name"]?>"
                                    required
                                >
                            </label>
                            <label for="">
                                <input type="email" placeholder="Seu email" name="email" value="<?=$this->data[0]["email"]?>" required>
                            </label>
                            <label for="">
                                <input type="text" placeholder="Celular" name="celular" value="<?=$this->data[0]["celular"]?>" required>
                            </label>
                            <label for="">
                                <input
                                    type="password"
                                    placeholder="Crie uma senha"
                                    name="senha"
                                    value="<?=$this->data[0]["senha"]?>"
                                    required
                                >
                            </label><br>

                            <label for=""><input type="submit" value="Alterar" class="btn-primary btn-success"></label>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="modal fade" id="modalImg" tabindex="-1" role="dialog" aria-labelledby="modalImg" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Imagem de perfil: Tamanho máximo suportado: 2,7 MB</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form action="" enctype="multipart/form-data" method="post">
                    <input type="file" name="user_img" id="user_img" style="margin-bottom: 10px" accept="image/*">
                    <div class="div-img">
                        <img src="#" alt="user_img" id="image">
                    </div>
                    <div class="modal-footer">
                        <input type="submit" class="btn btn-primary" value="Save changes"/>
                        <button class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
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
</div>
<script src="<?=ASSETS_URL?>/js/profile.js"></script>

