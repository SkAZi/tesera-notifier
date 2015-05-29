// ==UserScript==
// @name TeseraTweaks
// @include http://tesera.ru/*
// @require js/lib/zepto.js
// @run-at document-start
// ==/UserScript==

// ==UserCSS==
$('head').append($('<style type="text/css">@import url("'+kango.io.getResourceUrl("res/inject.css")+'");</style>'));
// ==/UserCSS==

kango.addMessageListener('subscribe', function(event) {
    var data = event.data,
        comments = $('.item .user');

    data.last_post = comments.length? Math.max.apply(this, comments.map(function(){
        return parseInt(this.getAttribute("forid"));
    })): 0;

    kango.invokeAsync('Background.subscribe', data);
});


$(function(){
    // TODO: Так же подсвечивать другие объекты, не только комментарии
    // TODO: Удалять Comment когда в поле зрения больше X секунд
    // TODO: Учитывать прочтение комментариев поштучно

    var smth = [
        'Зомби приползли', 'Артиллеристы выстрелили', 'На вечеринке играли в Активити',
        'Боссы всех уровней явились', 'Невеселые зайчики из Dixit прыгали', 'Киборги поработили', 
        'Марсиане прилетели за циркачами', 'Поезда прибыли в Эссен', 'Мы строили, строили'
    ];


    function cleanup(){
        var get_method, set_method, params, skip = true,
            commentos = $('.commentos'), right = $('.rightcol').height() + 300;

        kango.invokeAsync('Utils.parse_url', location.href, function(params){
            if(!params.id){
                if(location.pathname == '/user/messages/'){
                    get_method = 'Models.Common.get_last';
                    set_method = 'Models.Common.set_last';
                    params = 'messages';
                    skip = false;
                }
            } else {
                get_method = 'Models.Subscriptions.get_last';
                set_method = 'Models.Subscriptions.set_last';            
                skip = false;
            }

            if(skip) return;

            kango.invokeAsync(get_method, params, function(last){
                if(last.id === null) return;

                var last_post = last.id;
                $('.item .user').each(function(){
                    var $this = $(this), 
                        post_id = parseInt($this.attr("forid"));

                    if(post_id > last.id){
                        $this.closest('.item').addClass('new-item');
                    }

                    if(post_id > last_post){
                        last_post = post_id;
                    }
                });

                kango.invokeAsync(set_method, params, last_post, new Date());
            });
        });

        kango.invokeAsync('Models.Settings.all', function(settings){
            /* Подпишем что кому */
            $('.commentos .item').each(function(){
                var $this = $(this),
                    nick = $this.find('.user > a').eq(0).text(),
                    $parent = $this.parent(),
                    $user = $this.find('.user'),
                    text = $user.html(),
                    to_nick = $parent.prev('.item').find('.user > a').eq(0).text(),
                    link = $parent.prev('.item').find('.user').attr('forid');

                if(settings.blacklist.indexOf(nick) > -1){
                    $('<p style="margin: 1em 0 2em -.7em;" ondblclick="$(this).hide().next(\'div\').show()"><i><a style="color: #000; cursor: pointer;">'+ 
                        smth[((Math.random()*smth.length)|0)] +' и оставили это здесь.</a></i></p>').insertBefore($this);
                    $this.hide();
                }
                if($parent.hasClass('branch')){
                    text = text.replace(/(написал )(.*)( назад)/, "ответил <a href='#post" + link + "'>" + to_nick + "</a> $2$3");
                    $user.html(text);                
                }
            });

            /* Покрасим */
            $('.commentos .item').addClass('style-'+settings.new_item_style);


            /* Развернём комментарии пишире */ 
            if(commentos.length && commentos.offset().top > right){
                commentos.addClass('fullscreen');
            }

            if(commentos && commentos.length){
                $(window).unbind('scroll').scroll(function(){
                    commentos.closest('.leftcol')[$(window).scrollTop() > right? 'addClass': 'removeClass']('fullscreen');
                });
            }

        });
    }

    cleanup();


    /* А давайте-ка попробуем хоть немножко подлатать дыры в безопасности */
    $(['.raw_text_output [onfocus]',
       '.raw_text_output [onmouseover]',
       '.raw_text_output [onmouseout]',
       '.raw_text_output [onmousemove]',
       '.raw_text_output [onclick]',
       '.raw_text_output [onmousedown]',
       '.raw_text_output [onmouseup]',
       '.raw_text_output [ondblclick]',
       '.raw_text_output [oncontextmenu]',
       '.raw_text_output [href^="javascript:"]'].join(',')
    ).attr('onfocus', null)
     .attr('onmouseover', null)
     .attr('onmouseout', null)
     .attr('onmousemove', null)
     .attr('onclick', null)
     .attr('onmousedown', null)
     .attr('ondblclick', null)
     .attr('oncontextmenu', null)
     .attr('href', '#');
});