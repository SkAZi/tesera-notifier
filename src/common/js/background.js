var Background = {
    _interval: null,
    _cleanup_interval: null,

    init: function(){
        window.DEBUG = Models.Settings.get("debug", true);
        kango.ui.browserButton.setBadgeBackgroundColor([225, 127, 22, 255]);

        this.checkAuth();
        this.updateBadge();
        this.updateInterval();
    },

    'checkAuth': function(){
        new Core.Job('http://tesera.ru/', new Date(), 'auth', 0).execute(function(){
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
        var job_types = ['comments', 'articles', 'diaries', 'news'],
            previous_dates = Core.Pool.getDates();

        Core.Pool.clear();
        for(var i in job_types){
            if(Models.Settings.get(job_types[i] + '_interval')){
                Core.Pool.addJob(new Core.Job(
                    'http://tesera.ru/'+ job_types[i] +'/',
                    previous_dates[job_types[i]] || new Date(Models.Common.get_last(job_types[i]).date),
                    job_types[i],
                    Models.Settings.get(job_types[i] + '_interval')*60*1000
                ));
            }
        }

        if(Models.Settings.get('messages_interval')){
            Core.Pool.addJob(new Core.Job(
                'http://tesera.ru/user/messages/',
                previous_dates['messages'] || new Date(Models.Common.get_last('messages').date),
                'messages',
                Models.Settings.get('messages_interval')*60*1000
            ));
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