KangoAPI.onReady(function() {

    /* Views */
    var Views = {
        'switch_tab': function(){
            $('#tabs li a').removeClass('active');
            $('#tabs-content > div').removeClass('active');
            $($(this).addClass('active').attr('href')).addClass('active');

            var messages_count = Models.Messages.count();
            $('#tabs a[href="#messages-tab"] .badge').html(messages_count)[messages_count? 'removeClass': 'addClass']('hidden');
            var comments_count = Models.Comments.count();
            $('#tabs a[href="#comments-tab"] .badge').html(comments_count)[comments_count? 'removeClass': 'addClass']('hidden');

            var view = $(this).attr('data-view');
            if(view && Views[view]){
                Views[view]();
            }
            return false;
        },

        'open_answer': function(){
            $(this).closest('p').next('form').toggle().find('textarea').focus();
            return false;            
        },

        'log': function(){
            $('#log-tab').html(
                nunjucks.env.render('log.html', { object_list: Models.Events.list() })
            );
            return false;        
        },

        'messages': function(){
            $('#messages-tab').html(
                nunjucks.env.render('messages.html', { object_list: Models.Messages.list() })
            );
            return false;
        },

        'comments': function(){
            $('#comments-tab').html(
                nunjucks.env.render('comments.html', { object_list: Models.Comments.list() })
            );
            return false;
        },

        'subscriptions': function(){
            $('#subscriptions-tab').html(
                nunjucks.env.render('subscriptions.html', { object_list: Models.Subscriptions.list() })
            );
            return false;
        },

        'subscribe': function(){
            var $this = $(this);

            $('#toolbar .local').removeClass('active');
            $this.addClass('active');

            // TODO: вместо этого сразу же разобрать страницу
            kango.browser.tabs.getCurrent(function(tab){
                kango.dispatchMessage('changeSubscription', {
                    'url': tab.getUrl(),
                    'title': tab.getTitle(),
                    'sbtype': parseInt($this.attr('data-sbtype')),
                    'last_comment': 0 // TODO: Вычислить
                });
            });
            return false;
        },

        'remove': function(){
            var type = $(this).attr('data-type'),
                objects = $(this).attr('data-rel');
            
            Models.deleteItems(type + ':' + objects);
            $('#tabs li a.active').click();

            return false;
        },

        'open': function(){
            kango.dispatchMessage('openURL', {'url': $(this).attr('href')});
            return false;
        },

        'login': function(){
            $('#preload-pane').show();
            kango.xhr.send({
                'method': 'POST',
                'async': true,
                'url': 'http://tesera.ru/',
                'params': {
                    'auth_login': $('[name="auth_login"]', this).val(),
                    'auth_password': hex_md5($('[name="auth_password"]', this).val())
                },
                'contentType': 'text'
            }, Views.check_auth);
            return false;
        },

        'check_auth': function(){
            var xmlhttp = kango.xhr.getXMLHttpRequest();
            xmlhttp.open('GET', 'http://tesera.ru/', true);
            xmlhttp.onreadystatechange = function(){
                if(xmlhttp.readyState == 4) {
                    Models.State.authorized = ((xmlhttp.responseText.indexOf('id="open-authorize"') == -1))? 
                                            new Date(): 
                                            false;

                    kango.dispatchMessage('syncState', {'State': Models.State});
                    $('#preload-pane').hide();
                    if(Models.State.authorized){
                        $('#login-pane').hide();
                    }
                }
            }
            xmlhttp.send(null);
            return false;
        }
    }


    /* Routes */
    $('#login-form').on('submit', Views.login);
    $('#tabs').on('click', 'li a', Views.switch_tab);
    $('#tabs-content').on('click', '.list a.answer', Views.open_answer);
    $('#tabs-content').on('click', '.list a.remove', Views.remove);
    $('#tabs-content').on('click', '.list a.open', Views.open);
    $('#toolbar').on('click', '.local', Views.subscribe);


    /* Events */
    kango.addMessageListener('popupSyncState', function(event){
        if(event.data.State){
            Models.State = event.data.State;

            if(!Models.State.authorized || 
                new Date() - Models.State.authorized > 15*60*1000){
                Views.check_auth();
            } else {
                $('#preload-pane').hide();
                $('#login-pane').hide();
            }
        } else {
            kango.dispatchMessage('syncState', {});
        }
    });


    /* Utils */
    nunjucks.env.addFilter('date', function(date, format) {
        return format? moment(date).format(format):
                       moment(date).startOf('day').calendar();
    });

    nunjucks.env.addFilter('humanize_type', function(type) {
        return Utils.Tesera.humanize_type(type);
    });

    nunjucks.env.addFilter('pluralize', function(n, var1, var2, var3, no) {
        return (no? '' :(n + ' ')) + (((n % 10 == 1) && (n % 100 != 11))? var1:
               ((n % 10 >= 2) && (n % 10 <= 4) && (n % 100 < 10 || n % 100 >= 20))? var2:
                var3);
    });


    /* Run!!! */
    kango.browser.tabs.getCurrent(function(tab){
        var subscribe = Models.Subscriptions.check(tab.getUrl());
        if(subscribe === null){
            $('#toolbar').hide();
        } else {
            $('#toolbar').show();
            $('#toolbar .local').removeClass('active');
            $('#toolbar .local').eq(parseInt(subscribe)).addClass('active');
        }
    });

    kango.dispatchMessage('syncState', {});
    $('#tabs li:first-of-type a').click();
});