<style>
    body
    {
        background: #00CCCC;
        margin-top: 0;
        margin-bottom: 80px;
        word-wrap: break-word;
    }
    .container-fluid
    {
        min-height: 500px;
    }

    .logado_home .col-md-3,.col-md-8
    {
        background: whitesmoke;
        border-radius: 5px;
    }
    .logado_home .col-md-3
    {
        min-height: 300px;
        margin-left: 15px;
        margin-right: 20px;
        margin-top: 40px;
        padding: 10px;
    }
    .logado_home .col-md-8
    {
        min-height: 150px;
        margin-top: 40px;
    }
    .value .col-md-3
    {
        margin: 0;
        padding: 0;
        min-height: auto;
    }
    .value
    {
        margin: 30px 0;
    }
    .title
    {
        font-size: 17px;
        font-weight: 600;
    }
    .date,.valor,.descricao,.action
    {
        margin-bottom: 25px;
    }

    .div_img_user
    {
        margin: auto;
        overflow: hidden;
        border-radius: 90%;
        width: 160px;
        height: 150px;
        background: black;
    }
    .date-filter
    {
        margin-top: 20px;
    }
    .date-filter input
    {
        padding: 5px;
        border-radius: 5px;
    }
    @media screen and (max-width: 1024px){
        .container-fluid
        {
            margin-left: 35px;
        }
    }
    @media screen and (max-width: 768px){
        .container-fluid
        {
            margin-left: 0;
        }
        .date,.valor
        {
            padding-bottom: 10px;
        }
        .descricao
        {
            padding-bottom: 35px;
        }
    }
    @media screen and (max-width: 425px){
        .date-filter
        {
            display: flex;
        }
        #account_add label
        {
            width: 100%;
        }
    }
</style>
<div class="logado_home container-fluid text-center">
    <div class="row">
        <div class="col-md-3">
            <?php
            if(isset($this->data["user_account"][0]["id_conta"]))
            {
                $_SESSION["account_id"]=$this->data["user_account"][0]["id_conta"];
            }
            else
            {
                $_SESSION["account_id"]=null;
            }

            $_SESSION["total_despesas_mes"] = 0;
            foreach ($this->data["user"] as $data):
                extract($data);
                $first_name = explode(" ",$name);
                ?>
                <h3>
                    Olá, <?=$first_name[0];?>
                </h3>
                <?php
                if(isset($this->data["user"][0]["image"])):
                    ?>
                    <div class="div_img_user">
                        <img
                            src="<?=$this->data["user"][0]["image"]?>"
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
                        <a href="logado/profile" data-toggle="modal">
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

                ?>
                <div class="renda">
                    <?php
                        if(isset($this->data["user_account"][0]["renda_total_mes"]) and isset($this->data["user_account"][0]["meta_mes"])):
                            ?>
                            <h3>
                                Renda Mensal:
                                R$ <?=number_format($this->data["user_account"][0]["renda_total_mes"],"2",",",".")?>
                            </h3>
                            <h3>
                                Meta Mensal de gastos: <br>
                                R$ <?=number_format($this->data["user_account"][0]["meta_mes"],"2",",",".")?>
                            </h3>

                    <?php
                        else:
                            ?>
                            <h3>Primeiro crie sua conta:</h3>
                            <div id="account_add" >
                                <form action="" method="post">
                                    <label for="addExpend">Adicione sua renda mensal<br>
                                        <input type="text" name="renda_mensal" class="form-control">
                                    </label>
                                    <label for="addExpend">Adicione sua meta mensal de gastos<br>
                                        <input type="text" name="meta_mensal" class="form-control">
                                    </label>
                                    <input type="submit" class="btn btn-warning" value="Cadastrar">
                                </form>
                            </div>
                        <?php
                        endif;
                    ?>
                </div>
            <?php
            endforeach;
            ?>
        </div>
        <div class="col-md-8">
            <div class="text-right"><h2><i class="fas fa-comment-dollar"></i></h2></div>
            <h4>Aqui estarão todos os seus gastos e entradas de dinheiro cadastrados!</h4>
            <?php
            if(isset($this->data["user_account"][0]["renda_total_mes"])):
            ?>

            <form action="" method="post">
                <label for="addExpend">Digite a descrição da despesa <br>
                    <input type="text" name="descricao_despesa" class="form-control">
                </label>
                <label for="">Digite o valor da despesa <br>
                    <input type="number" step="any" name="valor_despesa" class="form-control">
                </label>
                <input type="submit" class="btn btn-warning" value="Cadastrar">
            </form>

            <?php
            endif;
                if(isset($this->data["user_account"][0]["descricao"])):
                    ?>

                    <div style="font-size: 23px" id="total_content">
                        <span id="total_text">Total gasto no mês até agora:</span> <span id="total"></span>
                    </div>
                    <div class="date-filter">
                        <label for="">Filtrar de:
                            <input type="date" name="data_inicial">
                        </label>
                        <label for="">Até:
                            <input type="date" name="data_final">
                        </label>
                    </div>

                    <div class="value">

                        <div class="date"></div>
                        <div class="valor"></div>
                        <div class="descricao"></div>
                    </div>

                <?php
                   /* foreach ($this->data["user_account"] as $data):
                        extract($data);
                    $date = date_create($data_despesa);
                    $date_format=date_format($date,"d-m-Y");
                    $val = number_format($valor,"2",",",".");
                    $_SESSION["total_despesas_mes"] += $valor;

            ?>

                    <div class="topics">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="title">Data</div>
                                <div class="date">
                                    <?=$date_format?>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="title">Valor da Despesa</div>
                                <div class="valor">
                                    R$ <?=$val?>
                                </div>

                            </div>
                            <div class="col-md-4">
                                <div class="title">Descrição da Despesa</div>
                                <div class="descricao">
                                    <?=$descricao?>
                                </div>
                            </div>
                        </div>
                    </div>
            <?php
                    endforeach;
                else:
                    ?>
                <h3>Você ainda não tem contas cadastradas!</h3>
            <?php
                   */
                endif;
            ?>

        </div>
    </div>
</div>

<div class="ajax_load">
    <div class="ajax_load_box">
        <div class="ajax_load_box_circle"></div>
        <div class="ajax_load_box_title">Aguarde, carregando!</div>
    </div>
</div>
<script src="<?=ASSETS_URL?>/js/addConta.js"></script>
<script src="<?=ASSETS_URL?>/js/financas.js"></script>
