var Models = {
    getKeys: function(mask, max){
        var regexp = new RegExp('^'+(mask || '*').replace(/\*/g, '.*')+'$'),
            ret = [], _keys = kango.storage.getKeys();
        for(var i in _keys){
            if(regexp.test(_keys[i])){
                ret.push(_keys[i]);
                if(max && ret.length >= max) break; 
            }
        }
        return ret.sort();
    },

    getItems: function(mask, max){
        var ret = [], _keys = Models.getKeys(mask, max);
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
        'get_last': function(type){
            return kango.storage.getItem('last:'+type) || {
                'id': 0,
                'date': new Date(0)
            };
        },

        'set_last': function(type, id, date){
            kango.storage.setItem('last:'+type, {
                'id': id,
                'date': date || new Date()
            }); 
        },

        'update_last': function(type, obj){
            if(obj.id > this.get_last(type).id){
                this.set_last(type, obj.id, obj.date);
            }
        }
    },

    Events: {
        'get_uid': function(params){
            return "log:"+Utils.format_date(params.day)+':'+params.type+":"+
                    (params.id? params.id: "");
        },

        'get': function(id, def){
            return kango.storage.getItem(id) || def || {};
        },

        'list': function(){
            return Models.getItems('log:*', 100);
        },

        'add': function(data){
            obj = this.get(this.get_uid(params), {
                    "class": "Events",
                    "uid": this.get_uid(params),
                    "id": params.id,
                    "day": Utils.strip_time(data.day),
                    "type": params.type,
                    "count": 0,
                    "target": data.target
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
            return "message:"+params.id;
        },

        'count': function(){
            return Models.getKeys('message:*').length;
        },

        'list': function(){
            return Models.getItems('message:*', 100);
        },

        'add': function(data){
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
            return "comment:"+Utils.format_date(params.day)+":"+
                    params.target.id+":"+params.id;
        },

        'count': function(){
            return Models.getKeys('comment:*').length;
        },

        'list': function(){
            return Models.getItems('comment:*', 100);
        },

        'add': function(data){
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
        'get_last': function(params){
            var obj = kango.storage.getItem(this.get_uid(params))
            return obj? obj.last_post: 0;
        },

        'get_uid': function(params){
            return "subscription:"+params.type+":"+params.id;
        },

        'get': function(id, def){
            return kango.storage.getItem(id) || def || {};
        },

        'list': function(){
            return Models.getItems('subscription:*', 100);
        },

        'check': function(url){
            var params = Utils.Tesera.parse_url(url);
            if(!params || !params.id){
                return null;
            }
            item = kango.storage.getItem(this.get_uid(params));
            return item? item.sbtype: 0;
        },

        'change': function(data){
            var params = Utils.Tesera.parse_url(data.url), 
                obj;

            if(!params || !params.id){
                return none;
            }

            obj = {
                "class": "Subscriptions",
                "uid": this.get_uid(params),
                "id": params.id,
                "sbtype": parseInt(data.sbtype),
                "url": data.url.split('#')[0],
                "active": true,
                "title": Utils.Tesera.parse_title(data.title),
                "type": params.type,
                "last_post": data.last_post || 0
            };

            return this.save(obj);
        },

        'delete': function(url){
            var params = Utils.Tesera.parse_url(url);
            kango.storage.removeItem(this.get_uid(params));
        },

        'save': function(obj){
            kango.storage.setItem(obj.uid, obj);
            return obj;
        }
    },

    State: {
        'authorized': null
    },

    Settings: {
        base: {
            //"interval": 60*1000,
            //"default_period": 10*60*1000,
            //"check_messages": 10*60*1000,
            "debug": true
        },

        set: function(key, val){
            var settings = kango.storage.getItem('settings') || this.base;
            settings[key] = val;
            kango.storage.setItem('settings', settings);
        },

        get: function(key, def){
            var settings = kango.storage.getItem('settings');
            return settings && settings[key] || def || null;
        }
    },

}
