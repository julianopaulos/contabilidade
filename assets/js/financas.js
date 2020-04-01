$(document).ready(function () {
    function isJson(data) {
        try
        {
            JSON.parse(data);
        }
        catch (e) {
            return false;
        }
        return  true;
    }
    function getData(values)
    {
        let total = 0;
        if(values!==null)
        {
            document.querySelector(".value").innerHTML="";
            values.map(value => {
                let valor = Number(value.valor).toLocaleString("pt",{minimumFractionDigits: 2, maximumFractionDigits: 2});

                document.querySelector(".value").innerHTML+=`<div class="col-md-3"><div class="title">Data:</div><div class="date">${value.data_despesa}</div></div>`;
                document.querySelector(".value").innerHTML+=`<div class="col-md-3"><div class="title">Valor da despesa:</div><div class="valor">R$ ${valor}</div></div>`;
                document.querySelector(".value").innerHTML+=`<div class="col-md-3"><div class="title">Descrição:</div> <div class="descricao">${value.descricao}</div></div>`;
                document.querySelector(".value").innerHTML+=`<div class="col-md-3"><div class="title">Ação</div><div class="action"><button class="delete" type="button" data-id=${value.id}><i class="fa fa-trash" aria-hidden="true"></i></button><button class="edit"><i class="fas fa-pen"></i></button></div><br><br></div>`;
                total+=Number(value.valor);
            });
            $(".delete").on('click',function () {
                deleteFinance($(this).data("id"));
            });
            $("#total").text("R$ "+total.toLocaleString("pt",{minimumFractionDigits: 2, maximumFractionDigits: 2}));
        }
        else
        {
            document.querySelector(".value").innerHTML="<h3>Você ainda não tem contas cadastradas nesse período!</h3>";
        }

    }
    $.ajax({
        type:'GET',
        url:'/administrador_contabil/logado/all',
        success: function (result) {
            if(isJson(result))
            {
                let values = JSON.parse(result);
                getData(values);
            }
        },
        error:function (request,status,error) {
            console.log(request);
            console.log(status);
            console.log(error);
        }
    });

    $("input[type=date]").on('change',function () {
        let data_inicial = $("input[name=data_inicial]").val();
        let data_final = $("input[name=data_final]").val();
        if(data_inicial!=='' && data_final!=='')
        {
            let load = $(".ajax_load");
            load.fadeIn().css("display","flex");
            let data = {
                "data_inicial":data_inicial,
                "data_final":data_final
            };
            try
            {
                $.ajax({
                    type:'GET',
                    url:'/administrador_contabil/logado/filter',
                    data: data,
                    success: function (result) {
                        if(isJson(result))
                        {
                            let values = JSON.parse(result);
                            getData(values);
                            document.getElementById("total_text").innerHTML="Total gasto no período";
                        }
                        let load = $(".ajax_load");
                        load.fadeOut();
                    },
                    error:function (request,status,error) {
                        console.log(request);
                        console.log(status);
                        console.log(error);
                        load.fadeOut();
                        alert('Desculpe, algo deu errado! Recarregue a página e tente novamente');
                    }
                });
            }
            catch (e) {
                console.log(e);
            }
        }
    });
    function deleteFinance(id) {
        let load = $(".ajax_load");
        load.fadeIn().css("display","flex");
        $.ajax({
            type: 'DELETE',
            headers:{id_delete:id},
            success: function () {
                load.fadeOut();
                setTimeout(function () {
                    $(location).attr("href", "logado");
                },1000);
            },
            error:function (request,status,error) {
                console.log(request);
                console.log(status);
                console.log(error);
                load.fadeOut();
                alert('Desculpe, algo deu errado! Recarregue a página e tente novamente');
            }
        });
    }


});