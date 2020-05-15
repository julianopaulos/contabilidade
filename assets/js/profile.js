$(document).ready(function () {
    let img;
    $("#user_img").on('change',function () {
        let preview = new FileReader();
        preview.onprogress = function (e) {
            img =e.target.result;
            if(img.length > 4095335)
            {
                img = null;
                alert('Tamanho máximo de imagem ultrapassado');
                $(".div-img").css({'display':'none'});
                $("#user_img").val("");
            }
            else
            {
                $("#image").attr('src',e.target.result);
                $(".div-img").css({'display':'block'});
            }
        };
        preview.readAsDataURL(this.files[0]);
    });
    $("form").submit(function(e){
        if(!window.confirm('Deseja mesmo fazer isso?'))
        {
            e.preventDefault();
        }
        var load_div = $(".ajax_load");
        load_div.fadeIn().css("display","flex");
        if($(this).serialize())
        {

            e.preventDefault();
            let dataUser = $(this).serializeArray();
            $.post(dataUser.action, dataUser, function (data) {
                let parseJson = JSON.parse(data);
                if(parseJson==="Success")
                {
                    setTimeout(function () {
                        load_div.fadeOut();
                        alert('Dados alterados com sucesso!');
                    },1000);
                }
                else
                {
                    setInterval(function () {
                        load_div.fadeOut();
                        alert('Algo deu errado');
                    },1000);
                }
            })
        }
    });

});
