var Utils = {
    Tesera: {
        parse_url: function(url){
            var ret = {type: "", id: 0};
            if(url.indexOf('//tesera.ru/') < 0){
                return ret;
            }

            var parts = url.replace(/https?:\/\/tesera\.ru\/(.*)\//, '$1').split('/');
            if(parts[0] == 'user' && Utils.Tesera.humanize_type(parts[2])){
                ret = {type: parts[2], id: parts[3]}
            } else if(parts.length == 2 && Utils.Tesera.humanize_type(parts[0])){
                ret = {type: parts[0], id: parts[1]}
            }

            return ret  
        },

        parse_title: function(title){
            return title.split('|')[0].replace(/^ +| +$/g, '')

        },

        humanize_type: function(type){
            return {
                'message': "Сообщения",
                'new': "Новости",
                'article': "Статьи",
                'journal': "Записи в дневниках",
                'thought': "Мысли",
                'game': "Игры",
                'comment': "Комментарии"
            }[type];
        }
    },

    XHR: {
        get: function(url, last_modified, success, error){
            var xmlhttp = kango.xhr.getXMLHttpRequest(),
                headersChecked = false;

            xmlhttp.open('GET', url, true);
            xmlhttp.onreadystatechange = function() {
                if (!headersChecked && xmlhttp.readyState == 3) {
                    var response_date = xmlhttp.getResponseHeader('Date') || 
                                        xmlhttp.getResponseHeader('Last-Modified');
                    if(response_date){
                        headersChecked = true;
                        if(new Date(response_date) <= last_modified){
                            xmlhttp.abort();    
                            if(error) error(null);
                        }
                    }
                } else if (xmlhttp.readyState == 4){
                    if(xmlhttp.status == 200){
                        if(success) success(xmlhttp.responseText, xmlhttp.responseXML);
                    } else {
                        if(error) error(xmlhttp.status);
                    }
                }
            };
            xmlhttp.send(null);
        }
    },


    Parsers: {
        'auth': function(obj, text, xml){
            if(result.response.indexOf('id="open-authorize"') == -1){
                Models.State.authorized = new Date();    
            } else {
                Models.State.authorized = false;
            }

            kango.dispatchMessage('syncStatePopup', {'State': Models.State});
        },

        'messages': function(obj, text, xml){

        },

        'news': function(obj, text, xml){

        },

        'articles': function(obj, text, xml){

        },

        'diaries': function(obj, text, xml){

        },

        'games': function(obj, text, xml){

        },

        'subscription': function(obj, text, xml){
            obj.update_counter = 1;
            obj.last_update = new Date();
            // TODO time inc
            obj.planned_update = obj.last_update + obj.update_counter * 60 * 1000;
            Models.saveObject(obj);
        }
    },


    Pool: (function(){
        var Pool = function(){
            this._pool = [];
        }

        // TODO: можно добавлять и считать просроченные половинным делением
        Pool.prototype = {
            'addJob': function(job){
                for(var i=this._pool.length;i--;){
                    if(this._pool[i].date >= job.date){
                        this._pool.splice(i+1, 0, job);
                        return;
                    }
                }
                this._pool.unshift(job);  
            },

            'removeJob': function(job){
                for(var i=this._pool.length;i--;){
                    if(this._pool[i].url == job || this._pool[i].url == job.url){
                        this._pool.splice(i, 1);
                        return;
                    }
                }
            },

            'expiredCount': function(){
                var count = 0,
                    now = Date.now();
                for(var i=0,l=this._pool.length;i<l;i++){
                    if(this._pool[i].date < now){
                        count++;
                    } else {
                        break;
                    }
                }
                return count;
            },

            'nextJob': function(expired_only){
                if(!expired_only){
                    return this._pool.shift();
                }
                var now = Date.now();
                if(this._pool.length && this._pool[0].date < now){
                    return this._pool.shift();
                }
                return {'execute': function(){}};
            },

            'clear': function(){
                this._pool = [];
            }
        }

        return new Pool();
    })(),


    Job: (function(){
        var Job = function(obj, type, parsers){
            this.obj = obj;
            this.parsers = type;
            this.parsers.unshift('auth');
            this.parsers.unshift('subscription');
        }  

        Job.prototype = {
            'execute': function(cb){
                var self = this;
                Utils.XHR.get(this.obj.url, this.obj.last_update, function(text, xml){
                    for(var i in self.parsers){
                        if(Utils.Parsers[self.parsers[i]]){
                            Utils.Parsers[self.parsers[i]](self.obj, text, xml);
                        }
                    }
                    if(cb) cb();
                }, function(error){
                    self.returnToPool();
                });
            },

            'returnToPool': function(){
                // Задачи без подписок не имеют id
                if(this.obj.id){
                    this.obj.update_counter += 1;
                    if(this.obj.update_counter > 24){
                        this.obj.update_counter = 24;
                        this.obj.active = false;
                    }
                    this.obj.planned_update += this.obj.update_counter * 60 * 1000;
                    Models.saveObject(this.obj);
                } else {
                    this.obj.planned_update += this.obj.update_counter * 60 * 1000;
                }

                Utils.Pool.addJob(this);
            },

            'removeFromPool': function(){
                Utils.Pool.removeJob(this);  
            }
        }

        return Job;
    }),

    'uuid': function(){
        return Math.random().toString(36).substring(2, 15) +
                Date.now().toString(36);
    },

    'format_date': function(date, format){
        var format = format || "%Y%M%D";
        return format.replace(/%[dDmMY]/g, function(param){
            if(param == '%d'){ return date.getDate(); }
            if(param == '%D'){ return (date.getDate()<10?'0':'')+date.getDate(); }
            if(param == '%m'){ return date.getMonth(); }
            if(param == '%M'){ return (date.getMonth()<10?'0':'')+date.getMonth(); }
            if(param == '%Y'){ return date.getFullYear(); }
        });
    },

    'strip_time': function(date){
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date;
    }
}