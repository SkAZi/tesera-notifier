var Background = {
    _interval: null,
    _cleanup_interval: null,
    _secure_profile: false,

    init: function(){
        window.DEBUG = Models.Settings.get("debug", false);
        kango.ui.browserButton.setBadgeBackgroundColor([225, 127, 22, 255]);

        kango.browser.addEventListener(kango.browser.event.TAB_CHANGED, this.setIcon);
        kango.browser.addEventListener(kango.browser.event.TAB_CREATED, this.setIcon);
        kango.browser.addEventListener(kango.browser.event.DOCUMENT_COMPLETE, this.setIcon);

        this.setIcon();
        this.checkAuth();
        this.updateBadge();
        this.updateInterval();
    },

    'setIcon': function(event){
        if(!event) return;
        var state = Models.Subscriptions.check(event.url);
        if(state < 1){
            kango.ui.browserButton.setIcon("icons/button.png");
        } else {
            kango.ui.browserButton.setIcon("icons/button-s.png");
        }
    },

    'checkAuth': function(){
        new Core.Job('http://tesera.ru/', 'auth', new Date(0), 0, ['auth']).execute(function(){
            kango.dispatchMessage('syncState', Models.State);
        });
    },

    'syncState': function(data){
        if(data){
            Models.State = data;
            return null;
        } else {
            return Models.State;
        }
    },

    updateInterval: function(){
        this.updateWorld();
        if(this._interval) clearInterval(this._interval);
        this._interval = setInterval(this.update, Models.Settings.get("interval")*1000);
        if(this._cleanup_interval) clearInterval(this._cleanup_interval);
        this._cleanup_interval = setInterval(this.cleanup, 4*3600*1000);
    },

    updateWorld: function(){
        var job_types = {
                'comments': 'http://tesera.ru/comments/', 
                'messages': 'http://tesera.ru/user/messages/', 
                'articles': 'http://tesera.ru/articles/', 
                'diaries': 'http://tesera.ru/diaries/', 
                'news': 'http://tesera.ru/news/'
            },
            previous_dates = Core.Pool.getDates();

        Core.Pool.clear();
        for(var type in job_types){
            if(Models.Settings.get(type + '_interval')){
                Core.Pool.addJob(new Core.Job(
                    job_types[type],
                    type,
                    previous_dates[type] || new Date(Models.Common.get_last(type).date),
                    Models.Settings.get(type + '_interval')*60*1000
                ));
            }
        }

        /* TODO: resort
        Core.Pool.addJob(new Core.Job(
            'http://tesera.ru/games/',
            Models.Common.get_last('games').date,
            'games',
            60*60*1000
        )); */
    },

    update: function(){
        Utils.log("Update fired.");
        Core.Pool.executeNextJob();
    },

    updateBadge: function(){
        var count = 0,
            events = Models.getItems('log:*');
        for(var i in events){
            count += events[i].count;
            if(count >= 100) break;
        }
        kango.ui.browserButton.setBadgeValue(count<100? count: '99+');
    },

    cleanup: function(){
        var keys,
            types = ['message', 'comment', 'log', 'last:item:'],
            cleanup_count = Models.Settings.get("cleanup"),
            subscriptions = Models.getItems('subscription:*'),
            unactive_date = Date.now() - 31*24*60*60*1000;

        if(!cleanup_count) return;
        for(var i in types){
            keys = Models.getKeys(types[i] + ':*');
            while(keys.length > cleanup_count){
                kango.storage.removeItem(keys.pop());
            }
        }

        // TODO: переводить подписки в неактивные
    },

    subscribe: function(data){
        if(data.sbtype){
            Models.Subscriptions.change(data);
            Utils.log("Subscribed: " + JSON.stringify(data));
        } else {
            Models.Subscriptions.delete(data.url);
            Utils.log("Unsubscribed: " + JSON.stringify(data));
        }
        this.setIcon({'url': data.url});
    },

    massSubscribe: function(data){
        for(var i=data.length;i--;){
            this.subscribe({
                'url': data[i].url,
                'title': data[i].topic || data[i].title,
                'sbtype': data[i].sbtype || 2,
                'last_comment': data[i].lastnum || data[i].last_post
            });
        }
        return true;
    }
}; 

Background.init();