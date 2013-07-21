Background = {
    _interval: null,

    init: function(){
        kango.ui.browserButton.setPopup({
            url: 'index.html',
            width: 400,
            height: 500
        });

        this.updateWorld();
        this.updateInterval();
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
        var self = this;
        if(this._interval) clearInterval(this._interval);
        this._interval = setInterval(function(){ self.update() }, 
                            Models.Settings.get("interval", 10*1000));
    },

    updateWorld: function(){
        Utils.Pool.addJob(new Utils.Job(
            'http://tesera.ru/user/messages/',
            Models.Common.get_last('messages').date,
            'messages',
            30*60*1000
        ));
        Utils.Pool.addJob(new Utils.Job(
            'http://tesera.ru/comments/',
            Models.Common.get_last('comments').date,
            'comments',
            15*60*1000
        ));
        Utils.Pool.addJob(new Utils.Job(
            'http://tesera.ru/articles/',
            Models.Common.get_last('articles').date,
            'articles',
            30*60*1000
        ));
        Utils.Pool.addJob(new Utils.Job(
            'http://tesera.ru/diaries/',
            Models.Common.get_last('diaries').date,
            'diaries',
            30*60*1000
        ));
        Utils.Pool.addJob(new Utils.Job(
            'http://tesera.ru/news/',
            Models.Common.get_last('news').date,
            'news',
            60*60*1000
        ));

        /* TODO: resort
        Utils.Pool.addJob(new Utils.Job(
            'http://tesera.ru/games/',
            Models.Common.get_last('games').date,
            'games',
            60*60*1000
        )); */
    },

    update: function(){
        Utils.log("Update fired.");
        Utils.Pool.executeNextJob();
        this.cleanup();
    },

    cleanup: function(){
        Utils.log("Cleanup fired.");
        // Почистить какое-то старое событие, сообщение или комментарий
        // сколько хранить — в настройках
    },

    subscribe: function(data){
        if(data.sbtype){
            var subscription = Models.Subscriptions.change(data);
            Utils.Pool.addJob(subscription);
        } else {
            Models.Subscriptions.delete(data.url);
            Utils.Pool.removeJob(data.url);
        }
    },

    openURL: function(url) {
        kango.browser.tabs.create({url: url});
    }
}; 

window.DEBUG = Models.Settings.get("debug", true);
Background.init();