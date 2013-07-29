// ==UserScript==
// @name TeseraTweaks
// @include http://tesera.ru/*
// @include https://tesera.ru/*
// @require js/lib/zepto.js
// ==/UserScript==

// ==UserCSS==
$('head').append($('<style type="text/css">@import url("'+kango.io.getResourceUrl("res/inject.css")+'");</style>'));
// ==/UserCSS==

// $('<div id="notifier-toolbar" />').prependTo($('body'));

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

    var get_method, set_method, params, skip = true;

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
});