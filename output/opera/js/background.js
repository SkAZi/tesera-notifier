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

    updateInterval: function(){
        var self = this;
        if(this._interval) clearInterval(this._interval);
        this._interval = setInterval(function(){ self.update() }, 
                            Models.Settings.get("interval", 15*1000));
    },

    updateWorld: function(){
        // Рассувать все задачи в Pool проверить авторизацию
    },

    update: function(){
        // Вынуть задачу из пула и запустить
    },

    cleanup: function(){
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