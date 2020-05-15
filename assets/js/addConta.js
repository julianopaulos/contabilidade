$(document).ready(function () {
    $("form").submit(function (e) {
        e.preventDefault();
        let data = $(this).serializeArray();
        let load = $(".ajax_load");
        load.fadeIn().css("display","flex");
        $.post(data.action,data,function (request) {
            let message = JSON.parse(request);
            if(message.message==="success")
            {
                load.fadeOut();
                window.location.reload();
            }
            else if(message.message==="Success")
            {
                window.location.reload();
            }
            else
            {
                load.css("display","none");
                alert('Algo deu errado!');
            }
        })
    });
});
