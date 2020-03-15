$(".erro").css("display","none");
$(".ok").css("display","none");
$(document).ready(function () {
    $("input[name=celular]").mask("(00)0 0000-0000");
    $("form").submit(function (event){
        event.preventDefault();
        var load_div = $(".ajax_load");
        load_div.fadeIn().css("display","flex");
        let dataUser = $(this).serializeArray();
        $.post(dataUser.action, dataUser, function (data) {
            let val = data.indexOf(" Service closing transmission channel");
            if(val===-1)
            {
                //console.log(data);
                let parse = JSON.parse(data);
                if(parse.message)
                {
                    if(parse.message === "Success")
                    {
                        load_div.fadeOut();
                        $(".erro").css("display","none");
                        $("input").val("");
                       
                        $("input[type=submit]").val("Cadastrar");
                        $(".ok").css("display","block");
                        $(".cadastro").css("height","495px");
                        setTimeout(function () {
                            $(".ok").css("display","none");
                            $(".cadastro").css("height","450px");
                            $(location).attr("href","logado");
                        },1000);
                    }
                    else
                    {
                        load_div.fadeOut();
                        //console.log(parse);
                        $(".cadastro").css("height","495px");
                        $(".erro").css("display","block");
                        $(".ok").css("display","none");
                    }
                }
            }
            else
            {
		$("input").val("");
                $("textarea").val("");
                load_div.fadeOut();
                $(".ok").css("display","block");
                $(".cadastro").css("height","495px");
                setTimeout(function () {
                    $(".ok").css("display","none");
                    $(".cadastro").css("height","450px");
                },2000);
            }
        });
    });
});
//eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('$(".e").2("3","4");$(".5").2("3","4");$(t).u(6(){$("f[v=w]").x("(y)0 m-m");$("z").n(6(b){b.A();B c=$(".C");c.D().2("3","E");g h=$(F).G();$.H(h.I,h,6(a){g d=a.J(" K L M N");i(d===-1){g 7=O.7(a);i(7.o){i(7.o==="P"){c.j();$(".e").2("3","4");$("f").d("");$("f[Q=n]").d("R");$(".5").2("3","k");$(".8").2("9","l");p(6(){$(".5").2("3","4");$(".8").2("9","q");$(S).T("U","V")},r)}s{c.j();W.X(7);$(".8").2("9","l");$(".e").2("3","k");$(".5").2("3","4")}}}s{c.j();$(".5").2("3","k");$(".8").2("9","l");p(6(){$(".5").2("3","4");$(".8").2("9","q")},r)}})})});',60,60,'||css|display|none|ok|function|parse|cadastro|height||||val|erro|input|let|dataUser|if|fadeOut|block|495px|0000|submit|message|setTimeout|450px|2000|else|document|ready|name|celular|mask|00|form|preventDefault|var|ajax_load|fadeIn|flex|this|serializeArray|post|action|indexOf|Service|closing|transmission|channel|JSON|Success|type|Cadastrar|location|attr|href|home|console|log'.split('|'),0,{}))