var Models = {
    getItem: function(key, def){
        return kango.storage.getItem(key) || def || null;
    },

    setItem: function(key, val){
        try{
            kango.storage.setItem(key, val);
        } catch(e){
            Utils.log('Can`t write to DB', 'Error');
        }
    },

    getKeys: function(mask, max, reversed){
        var regexp = new RegExp('^'+(mask || '*').replace(/\*/g, '.*').replace(/\?/g, '.')+'$'),
            ret = [], _keys = kango.storage.getKeys();
        for(var i in _keys){
            if(regexp.test(_keys[i])){
                ret.push(_keys[i]);
                if(max && ret.length >= max) break; 
            }
        }
        ret = ret.sort()
        return reversed? ret.reverse(): ret;
    },

    getItems: function(mask, max, reversed){
        var ret = [], _keys = Models.getKeys(mask, max, reversed);
        for(var i in _keys){
            ret.push(Models.getItem(_keys[i]));
        }
        return ret;
    },

    deleteItems: function(mask, max){
        var _keys = Models.getKeys(mask, max);
        for(var i in _keys){
            kango.storage.removeItem(_keys[i]);
        }
    },    

    Common: {
        'get_uid': function(){
            return Array.prototype.join.call(arguments, ':').replace(/:+$/, '');
        },

        'get_last': function(type){
            var type = typeof type == 'string'? type
                        : 'item:' + $.map(type, function(k,v){return k+'-'+v}).join(':');

            Utils.log('Get last type of last:'+type);
            return Models.getItem('last:'+type) || {
                'id': null,
                'date': new Date(0)
            };
        },

        'set_last': function(type, id, date){
            var type = typeof type == 'string'? type
                        : 'item:' + $.map(type, function(k,v){return k+'-'+v}).join(':');

            Utils.log('Set last type of last:'+type);
            if(typeof id === 'number'){
                Models.setItem('last:'+type, {
                    'id': id,
                    'date': date || new Date()
                });                 
            } else {
                Models.setItem('last:'+type, id);
            }
        },

        'update_last': function(type, obj){
            if(obj.id > this.get_last(type).id){
                this.set_last(type, obj.id, obj.date);
            }
        }
    },

    Events: {
        '_class': "log",

        'get_uid': function(params){
            return Models.Common.get_uid(this._class, Utils.format_date(params.day), 
                    params.type, params.target? params.target.id: null);
        },

        'get': function(id, def){
            return Models.getItem(id) || def || {};
        },

        'list': function(){
            return Models.getItems(this._class + ':*', 100, true);
        },

        'add': function(params){
            obj = this.get(this.get_uid(params), {
                    "class": this._class,
                    "uid": this.get_uid(params),
                    "id": params.id,
                    "related": [],
                    "day": Utils.strip_time(params.day),
                    "type": params.type,
                    "count": 0,
                    "target": params.target || null
                });

            obj.related.push(params.uid);
            obj.count = obj.related.length;
            return this.save(obj);
        },

        'remove': function(targets){
            Utils.log(JSON.stringify(targets));
            for(var i in targets){
                if(targets[i].event){
                    var target = targets[i],
                        obj = this.get(target.event);

                    if(obj.uid){
                        if(obj.related && obj.related.length > 1 && obj.related.indexOf(target.uid) > -1){
                            obj.related.splice(obj.related.indexOf(target.uid), 1);
                            obj.count--;
                            this.save(obj);
                        } else {
                            kango.storage.removeItem(obj.uid);
                        }
                    }
                } else if(targets[i].related){
                    for(var j in targets[i].related){
                        if(typeof targets[i].related[j] === 'string'){
                            kango.storage.removeItem(targets[i].related[j]);
                        }
                    }
                }

                kango.storage.removeItem(targets[i].uid);
            }
        },

        'save': function(obj){
            Models.setItem(obj.uid, obj);
            return obj;
        }

    },

    Messages: {
        '_class': "message",

        'get_uid': function(params){
            return Models.Common.get_uid(this._class, params.id);
        },

        'count': function(){
            return Models.getKeys(this._class + ':*').length;
        },

        'list': function(){
            return Models.getItems(this._class + ':*', 100, true);
        },

        'add': function(params, event){
            return this.save({
                    "class": this._class,
                    "uid": this.get_uid(params),
                    "id": params.id,
                    "day": params.day || new Date(), //?
                    "unread": true,
                    "from": params.from,
                    "title": params.title,
                    "body": params.body,
                    "event": event.uid
                });
        },

        'save': function(obj){
            Models.setItem(obj.uid, obj);
            return obj;
        }
    },

    Comments: {
        '_class': "comment",

        'get_uid': function(params){
            return Models.Common.get_uid(this._class, Utils.format_date(params.day, "%Y%M%D"),
                    params.target.id, params.id);
        },

        'count': function(){
            return Models.getKeys(this._class+':*').length;
        },

        'list': function(){
            return Models.getItems(this._class+':*', 100, true);
        },

        'add': function(params, event){
            return this.save({
                    "class": this._class,
                    "uid": this.get_uid(params),
                    "id": params.id,
                    "day": params.day || new Date(),
                    "target": params.target,
                    "from": params.from,
                    "title": params.title,
                    "body": params.body,
                    "event": event.uid
                });
        },

        'save': function(obj){
            Models.setItem(obj.uid, obj);
            return obj;
        }
    },

    Subscriptions: {
        '_class': "subscription",

        'get_uid': function(params){
            return Models.Common.get_uid(this._class, params.type, params.id);
        },

        'get_last': function(params){
            var params = (typeof params === "string" && params.indexOf('//tesera.ru/') > -1)?
                     Utils.parse_url(params)
                     : params,
                id = this.get_uid(params),
                obj = Models.getItem(id);
            return obj? {'id':obj.last_post, 'date':obj.last_date}
                      : Models.Common.get_last(params);
        },

        'set_last': function(params, last_post, date){
            var params = (typeof params === "string" && params.indexOf('//tesera.ru/') > -1)?
                     Utils.parse_url(params)
                     : params,
                id = this.get_uid(params),
                obj = Models.getItem(id);
            
            if(obj){
                obj.last_post = last_post;
                obj.last_date = date || new Date();
                return this.save(obj);
            } else if(params.id && params.type){
                Models.Common.set_last(params, 
                    {'id': last_post, 'date': date || new Date()});
            }
        },

        'get': function(id, def){
            if(id.indexOf('//tesera.ru/') > -1){
                id = this.get_uid(Utils.parse_url(id));
            }
            return Models.getItem(id) || def || {};
        },

        'list': function(){
            return Models.getItems(this._class + ':*', 100);
        },

        'check': function(url){
            var params = Utils.parse_url(url);
            if(!params || !params.id){
                return -1;
            }
            item = kango.storage.getItem(this.get_uid(params));
            return item? item.sbtype: 0;
        },

        'change': function(data){
            var params = Utils.parse_url(data.url), 
                obj;

            if(!params || !params.id){
                Utils.log('Subscribe failed, unsupported url: ' + JSON.stringify(data));
                return null;
            }

            obj = {
                "class": this._class,
                "uid": this.get_uid(params),
                "id": params.id,
                "sbtype": parseInt(data.sbtype),
                "url": Utils.clean_url(data.url, true),
                "active": true,
                "title": Utils.parse_title(data.title),
                "type": params.type,
                "last_post": data.last_post || 0,
                "last_date": data.last_date || new Date()
            };

            return this.save(obj);
        },

        'delete': function(url){
            var params = Utils.parse_url(url);
            kango.storage.removeItem(this.get_uid(params));
        },

        'save': function(obj){
            Models.setItem(obj.uid, obj);
            return obj;
        }
    },

    State: {
        'authorized': null,
        'user': null
    },

    Settings: {
        defaults: {
            "interval": 60,
            "messages_interval": 15,
            "comments_interval": 15,
            "diaries_interval": 30,
            "articles_interval": 60,
            "news_interval": 60,
            "max_pages": 3,
            "cleanup": 100,
            "debug": true
        },

        options: {
            "interval": [15, 30, 60, 120, 300],
            "messages_interval": [5, 10, 15, 20, 30, 60, 120, 240, null],
            "comments_interval": [5, 10, 15, 20, 30, 60, 120, 240, null],
            "diaries_interval": [5, 10, 15, 20, 30, 60, 120, 240, null],
            "articles_interval": [5, 10, 15, 20, 30, 60, 120, 240, null],
            "news_interval": [5, 10, 15, 20, 30, 60, 120, 240, null],
            "max_pages": [1, 3, 5, 10, 0],
            "cleanup": [10, 50, 100, 300, 500, null]
        },

        all: function(){
            return Models.getItem('settings') || this.defaults;
        },

        set: function(key, val){
            var settings = this.all();
            settings[key] = val;
            Models.setItem('settings', settings);
        },

        get: function(key){
            var settings = this.all();
            return (settings && typeof settings[key] != 'undefined')?
                        settings[key]
                        : this.defaults[key] || null;
        },

        reset: function(){
            Models.setItem('settings', this.defaults);
        },

        traffic: function(){
            var s = this.all();
            return (s["messages_interval"]?(60 / s["messages_interval"]):0 + 
                    s["diaries_interval"]?(60 / s["diaries_interval"]):0 + 
                    s["articles_interval"]?(60 / s["articles_interval"]):0 + 
                    s["news_interval"]?(60 / s["news_interval"]):0) * 0.1 * 
                    (1 + s["max_pages"]/10);

        }
    },

}
