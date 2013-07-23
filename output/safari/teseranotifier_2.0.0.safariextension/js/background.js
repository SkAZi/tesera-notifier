Background = {
    _interval: null,

    init: function(){
        window.DEBUG = Models.Settings.get("debug", true);
        kango.ui.browserButton.setBadgeBackgroundColor([225, 127, 22, 255]);

        this.updateWorld();
        this.updateInterval();
        this.update_badge();
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
        if(this._interval) clearInterval(this._interval);
        this._interval = setInterval(this.update, Models.Settings.get("interval")*1000);
        Core.Pool.updateIntervals();
    },

    updateWorld: function(){
        Core.Pool.addJob(new Core.Job(
            'http://tesera.ru/comments/',
            Models.Common.get_last('comments').date,
            'comments',
            Models.Settings.get("comments_interval")*60*1000
        ));  
        Core.Pool.addJob(new Core.Job(
            'http://tesera.ru/user/messages/',
            Models.Common.get_last('messages').date,
            'messages',
            Models.Settings.get("messages_interval")*60*1000
        ));
        Core.Pool.addJob(new Core.Job(
            'http://tesera.ru/articles/',
            Models.Common.get_last('articles').date,
            'articles',
            Models.Settings.get("articles_interval")*60*1000
        ));
        Core.Pool.addJob(new Core.Job(
            'http://tesera.ru/diaries/',
            Models.Common.get_last('diaries').date,
            'diaries',
            Models.Settings.get("diaries_interval")*60*1000
        ));
        Core.Pool.addJob(new Core.Job(
            'http://tesera.ru/news/',
            Models.Common.get_last('news').date,
            'news',
            Models.Settings.get("news_interval")*60*1000
        ));

        /* TODO: resort
        Core.Pool.addJob(new Core.Job(
            'http://tesera.ru/games/',
            Models.Common.get_last('games').date,
            'games',
            60*60*1000
        )); */

        setInterval(this.cleanup, 4*3600*1000);
    },

    update: function(){
        Core.log("Update fired.");
        Core.Pool.executeNextJob();
    },

    update_badge: function(){
        var count = Models.getKeys('log:*').length;
        kango.ui.browserButton.setBadgeValue(count<100? count: '99+');
    },

    cleanup: function(){
        var keys,
            types = ['message', 'comment', 'log', 'last:item:'],
            cleanup_count = Models.Settings.get("cleanup");

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
        if(data.sbtype !== null){
            Models.Subscriptions.change(data);
            Core.log("Subscribed: " + JSON.stringify(data));
        } else {
            Models.Subscriptions.delete(data.url);
            Core.log("Unsubscribed: " + JSON.stringify(data));
        }
    },

    mass_subscribe: function(data){
        for(var i=data.length;i--;){
            try{
                this.subscribe({
                    'url': data[i].url,
                    'title': data[i].topic || data[i].title,
                    'sbtype': data[i].sbtype || 2,
                    'last_comment': data[i].lastnum || data[i].last_comment
                });
            } catch(e) {
                Core.log('Import failed: ' + JSON.stringify(data[i]), 'Error');
            }
        }
        return true;
    }
}; 

Background.init();