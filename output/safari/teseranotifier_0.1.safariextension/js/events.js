new (function(routes){
    for(var message in routes){
        if(routes[message]){
            (function(message, callback){
                kango.addMessageListener(message, function(event){
                    callback(event.data);
                });
            }(message, routes[message]));
        }
    }
})({

    'openURL': function(data){
        Background.openURL(data.url);
    },

    'syncState': function(data){
        if(data.State){
            Models.State = data.State;
        } else {
            kango.dispatchMessage('popupSyncState', {'State': Models.State});
        }
    },

    'changeSubscription': function(data){
        Background.subscribe(data);
    },

    'log': function(data){
        Utils.log(data.msg, data.type);
    }

});