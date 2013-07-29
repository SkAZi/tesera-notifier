KangoAPI.onReady(function() {
    // TODO: попап с вопросом на удаление 
    // TODO: фейдеры, залипающие заголовки и т.п.

    window.DEBUG = Models.Settings.get("debug");

    /* Views */
    var Views = {
        'switch_tab': function(){
            Utils.log("Switch tab fired.");

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

        'open_form': function(){
            var $this = $(this);
                form = $this.closest('p,li').next('.hidden-form');

            if($this.hasClass('active')){
                $this.removeClass('active');
                form.hide();
                if(form.hasClass('post-comment')){
                    form.html('');
                }
            } else {
                $this.addClass('active');
                if(form.hasClass('post-comment')){
                    form.html(
                        nunjucks.env.render('form_'+$this.attr('data-rel')+'.html', { 
                            object: kango.storage.getItem($this.attr('data-id'))
                        })
                    );
                }
                form.show().find('textarea').focus();
            }

            return false;            
        },

        'events': function(){
            $('#events-tab').html(
                nunjucks.env.render('events.html', { object_list: Models.Events.list() })
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

        'settings': function(){
            var traffic = Models.Settings.traffic();
            $('#settings-tab').html(
                nunjucks.env.render('settings.html', { 
                    settings: Models.Settings.all(),
                    options: Models.Settings.options,
                    hour: Math.round(traffic, 2),
                    day: Math.ceil(traffic*24)
                })
            );
            return false;
        },

        'save_settings': function(){
            if($(this).attr('name') == 'debug'){
                Models.Settings.set('debug', $(this).is(":checked"));
            } else {
                Models.Settings.set($(this).attr('name'), parseInt($(this).val()));
            }

            kango.invokeAsync('Background.updateInterval');
            return Views.settings();
        },

        'reset_settings': function(){
            Models.Settings.reset();
            kango.invokeAsync('Background.updateInterval');
            return Views.settings();
        },

        'subscribe': function(){
            // TODO: Рефрешить если открыта вкладка подписок
            var $this = $(this);

            $('#toolbar .local').removeClass('active');
            $this.addClass('active');

            kango.browser.tabs.getCurrent(function(tab){
                tab.dispatchMessage('subscribe', {
                    'url': Utils.clean_url(tab.getUrl(), true),
                    'title': tab.getTitle(),
                    'sbtype': parseInt($this.attr('data-sbtype'))           
                });
            });
            return false;
        },

        'remove': function(){
            // TODO: Проблема с очисткой «Неделю назад» и подобных
            Models.Events.remove(Models.getItems($(this).attr('data-rel')));
            kango.invokeAsync('Background.updateBadge');
            $('#tabs li a.active').click();
            return false;
        },

        'open': function(){
            kango.invokeAsync('kango.browser.tabs.create', 
                    {'url': $(this).attr('href'), 'focused': true});
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


        'show_login': function(){
            if(Models.State.authorized){
                $('#login').hide();
                return false;
            }

            $('#login-pane').show();
        },

        'hide_login': function(){
            $('#login-pane').hide();
        },

        'check_auth': function(){
            kango.xhr.send({
                'url': 'http://tesera.ru/',
                'method': 'GET',
                'async': true
            }, function(result){
                Models.State.authorized = ((result.response.indexOf('id="open-authorize"') == -1))? 
                                        new Date(): 
                                        false;

                if(Models.State.authorized){
                    Models.State.user = (result.response.match(/<a href="\/user\/" class="name"><span>([^<]*)<\/span>/) || [])[1] || null;
                }

                kango.dispatchMessage('syncState', {'State': Models.State});
                if(Models.State.authorized){
                    $('#login-pane').hide();
                    $('#login').hide();
                    $('a[href="#messages-tab"]').show();
                } else {
                    $('#login').show();
                    $('a[href="#messages-tab"]').hide();
                }
                $('#preload-pane').hide();
            });
            return false;
        },

        'post_comment': function(){
            var $this = $(this), 
                comment = $this.find('textarea'),
                params = {};

            $('#preload-pane').show();
            kango.xhr.send({
                'url': $this.attr('action'),
                'method': 'POST',
                'async': true,
                'params': $this.serialize()
            }, function(status){
                View.remove.apply($this.closest('li').find('a.remove'));
                $('#preload-pane').hide();
            });
            return false;
        },

        'import': function(){
            var textarea = $(this).find('textarea');
            try{
                var data = $.parseJSON(textarea.val());
            } catch (e){
                textarea.addClass('error');
                return false;
            }

            $('#preload-pane').show();
            kango.invokeAsync('Background.massSubscribe', data, function(successfull){
                if(successfull){
                    Views.subscriptions(); 
                } else {
                    textarea.addClass('error');
                }
                $('#preload-pane').hide();
            });

            return false;
        }
    }


    /* Routes */
    $('#toolbar').on('click', '.local', Views.subscribe);
    $('#login-form').on('click', 'a.local', Views.hide_login);
    $('#login').on('click', Views.show_login);
    $('#tabs').on('click', 'li a', Views.switch_tab);

    $('#tabs-content').on('click', '.list a.answer', Views.open_form);
    $('#tabs-content').on('click', '.list a.remove,.list .delete', Views.remove);
    $('#tabs-content').on('click', '.list a.open', Views.open);
    $('#tabs-content').on('click', 'form[action="#save-settings"] button',
                                     Views.reset_settings);

    $('#tabs-content').on('change', ['form[action="#save-settings"] input',
                                     'form[action="#save-settings"] select'].join(','), 
                                     Views.save_settings);

    $('#login-form').on('submit', Views.login);
    $('#tabs-content').on('submit', 'form.import-subscriptions', 
                                     Views.import);
    $('#tabs-content').on('submit', 'form.post-comment', 
                                     Views.post_comment);

    /* Events */


    /* Utils */
    nunjucks.env.addFilter('date', function(date, format) {
        return format? Utils.format_date(new Date(date)):
                       Utils.humanize_time(new Date(date));
    });

    nunjucks.env.addFilter('humanize_type', function(type) {
        return Utils.humanize_type(type);
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
            $('#toolbar > .wrapper').hide();
        } else {
            $('#toolbar > .wrapper').show();
            $('#toolbar .local').removeClass('active');
            $('#toolbar .local').eq(parseInt(subscribe)).addClass('active');
        }
    });

    kango.invokeAsync('Background.syncState', null, function(data){
        if(data){
            Models.State = data;

            if(Models.State.authorized && 
                new Date() - Models.State.authorized <= 15*60*1000){
                $('#login').hide();
                $('a[href="#messages-tab"]').show();
            } else {
                Views.check_auth();
                $('#login').show();
                $('a[href="#messages-tab"]').hide();
            }
        } else {
            kango.invokeAsync('Background.syncState', Models.State);
        }
    });
    $('#tabs li:first-of-type a').click();
});