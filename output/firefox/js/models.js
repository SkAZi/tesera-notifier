var Models = {
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
            ret.push(kango.storage.getItem(_keys[i]));
        }
        return ret;
    },

    deleteItems: function(mask, max){
        var _keys = Models.getKeys(mask, max);
        for(var i in _keys){
            kango.storage.removeItem(_keys[i]);
        }
    },    

    saveObject: function(obj){
        return Models[obj["class"]]? 
                Models[obj["class"]].save(obj): null;
    },

    Common: {
        'get_uid': function(){
            return Array.prototype.join.call(arguments, ':').replace(/:+$/, '');
        },

        'get_last': function(type){
            var type = typeof type == 'string'? type
                        : 'item:' + $.map(type, function(k,v){return k+'-'+v}).join(':');
            return kango.storage.getItem('last:'+type) || {
                'id': 0,
                'date': new Date(0)
            };
        },

        'set_last': function(type, id, date){
            var type = typeof type == 'string'? type
                        : 'item:' + $.map(type, function(k,v){return k+'-'+v}).join(':');
            if(typeof id === 'number'){
                kango.storage.setItem('last:'+type, {
                    'id': id,
                    'date': date || new Date()
                });                 
            } else {
                kango.storage.setItem('last:'+type, id);
            }
        },

        'update_last': function(type, obj){
            if(obj.id > this.get_last(type).id){
                this.set_last(type, obj.id, obj.date);
            }
        }
    },

    Events: {
        'get_uid': function(params){
            return Models.Common.get_uid("log", Core.format_date(params.day), 
                    params.type, (params.id? params.id: null));
        },

        'get': function(id, def){
            return kango.storage.getItem(id) || def || {};
        },

        'list': function(){
            return Models.getItems('log:*', 100, true);
        },

        'add': function(params){
            obj = this.get(this.get_uid(params), {
                    "class": "Events",
                    "uid": this.get_uid(params),
                    "id": params.id,
                    "day": Core.strip_time(params.day),
                    "type": params.type,
                    "count": 0,
                    "target": params.target || null
                });

            obj.count++;
            return this.save(obj);
        },

        'save': function(obj){
            kango.storage.setItem(obj.uid, obj);
            return obj;
        }

    },

    Messages: {
        'get_uid': function(params){
            return Models.Common.get_uid("message", params.id);
        },

        'count': function(){
            return Models.getKeys('message:*').length;
        },

        'list': function(){
            return Models.getItems('message:*', 100, true);
        },

        'add': function(params){
            return this.save({
                    "class": "Messages",
                    "uid": this.get_uid(params),
                    "id": params.id,
                    "date": params.date, //?
                    "unread": true,
                    "from": params.from,
                    "title": params.title,
                    "body": params.body
                });
        },

        'save': function(obj){
            kango.storage.setItem(obj.uid, obj);
            return obj;
        }
    },

    Comments: {
        'get_uid': function(params){
            return Models.Common.get_uid("comment", Core.format_date(params.date, "%Y%M%D%H"),
                    params.target.id, params.id);
        },

        'count': function(){
            return Models.getKeys('comment:*').length;
        },

        'list': function(){
            return Models.getItems('comment:*', 100, true);
        },

        'add': function(params){
            return this.save({
                    "class": "Comments",
                    "uid": this.get_uid(params),
                    "id": params.id,
                    "date": params.date, //?
                    "target": params.target,
                    "from": params.from,
                    "title": params.title,
                    "body": params.body
                });
        },

        'save': function(obj){
            kango.storage.setItem(obj.uid, obj);
            return obj;
        }
    },

    Subscriptions: {
        'get_uid': function(params){
            return Models.Common.get_uid("subscription", params.type, params.id);
        },

        'get_last': function(params){
            var params = (typeof params === "string" && params.indexOf('//tesera.ru/') > -1)?
                     Core.Tesera.parse_url(params)
                     : params,
                id = this.get_uid(params),
                obj = kango.storage.getItem(id);
            return obj? obj.last_post: Models.Common.get_last(params);
        },

        'set_last': function(params, last_post){
            var params = (typeof params === "string" && params.indexOf('//tesera.ru/') > -1)?
                     Core.Tesera.parse_url(params)
                     : params,
                id = this.get_uid(params),
                obj = kango.storage.getItem(id);
            
            if(obj){
                obj.last_post = last_post;
                return this.save(obj);
            } else if(params.id && params.type){
                Models.Common.set_last(params, 
                    {'id': last_post, 'date': new Date()});
            }
        },

        'get': function(id, def){
            if(id.indexOf('//tesera.ru/') > -1){
                id = this.get_uid(Core.Tesera.parse_url(id));
            }
            return kango.storage.getItem(id) || def || {};
        },

        'list': function(){
            return Models.getItems('subscription:*', 100);
        },

        'check': function(url){
            var params = Core.Tesera.parse_url(url);
            if(!params || !params.id){
                return null;
            }
            item = kango.storage.getItem(this.get_uid(params));
            return item? item.sbtype: 0;
        },

        'change': function(data){
            var params = Core.Tesera.parse_url(data.url), 
                obj;

            if(!params || !params.id){
                return none;
            }

            obj = {
                "class": "Subscriptions",
                "uid": this.get_uid(params),
                "id": params.id,
                "sbtype": parseInt(data.sbtype),
                "url": Core.Tesera.clean_url(data.url, true),
                "active": true,
                "title": Core.Tesera.parse_title(data.title),
                "type": params.type,
                "last_post": data.last_post || 0
            };

            return this.save(obj);
        },

        'delete': function(url){
            var params = Core.Tesera.parse_url(url);
            kango.storage.removeItem(this.get_uid(params));
        },

        'save': function(obj){
            kango.storage.setItem(obj.uid, obj);
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
            return kango.storage.getItem('settings') || this.defaults;
        },

        set: function(key, val){
            var settings = this.all();
            settings[key] = val;
            kango.storage.setItem('settings', settings);
        },

        get: function(key){
            var settings = this.all();
            return settings && settings[key] || Settings.defaults[key] || null;
        },

        reset: function(){
            kango.storage.setItem('settings', this.defaults);
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
