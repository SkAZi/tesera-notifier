var Utils = {
    Tesera: {
        parse_url: function(url){
            var ret = {type: "", id: 0};
            if(url.indexOf('//tesera.ru/') < 0){
                return ret;
            }

            var parts = url.replace(/^https?:\/\/tesera\.ru\/(.*)\/[^\/]*/, '$1').split('/');
            if(parts[0] == 'user' && Utils.Tesera.humanize_type(parts[2])){
                ret = {type: parts[2], id: parts[3]}
            } else if(parts.length > 1 && parts.length < 4 && Utils.Tesera.humanize_type(parts[0])){
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
            xmlhttp.setRequestHeader("If-Modified-Since", last_modified);
            xmlhttp.onreadystatechange = function() {
                if (!headersChecked && xmlhttp.readyState == 3) {
                    var response_date = xmlhttp.getResponseHeader('Date') || 
                                        xmlhttp.getResponseHeader('Last-Modified');
                    Utils.log('Page updated at ' + response_date);
                    if(response_date){
                        headersChecked = true;
                        if(new Date(response_date) <= last_modified){
                            Utils.log('Skipping...');
                            xmlhttp.abort();    
                            if(error) error(304);
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
        'auth': function(job, text, xml){
            if(text.indexOf('id="open-authorize"') == -1){
                Models.State.authorized = new Date();    
            } else {
                Models.State.authorized = false;
            }

            kango.dispatchMessage('syncStatePopup', {'State': Models.State});
        },

        'messages': function(job, text, xml){
            // http://tesera.ru/user/messages/
            //Utils.log(text);
        },

        'news': function(job, text, xml){
            // http://tesera.ru/news/
            //Utils.log(text);
        },

        'articles': function(job, text, xml){
            // http://tesera.ru/articles/
            //Utils.log(text);
        },

        'diaries': function(job, text, xml){
            // http://tesera.ru/diaries/
            //Utils.log(text);
        },

        'comments': function(){
            // http://tesera.ru/comments/
        },

        'games': function(job, text, xml){
            // update_filter/
            /*name:game_filter
            key:sort
            action:update
            value:show_time desc*/

            // http://tesera.ru/games/
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
                    if(this._pool[i].date <= job.date){
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

            'nextJob': function(any){
                if(any){
                    return this._pool.shift();
                }
                var now = Date.now();
                if(this._pool.length && this._pool[0].date < now){
                    return this._pool.shift();
                }
                return null;
            },

            'executeNextJob': function(any){
                var job = this.nextJob(any);
                if(job){
                    job.execute();
                } else {
                    Utils.log("Pool is empty"); 
                }
            },

            'clear': function(){
                this._pool = [];
            }
        }

        return new Pool();  // Singleton
    })(),


    Job: (function(){
        var Job = function(url, last_update, type, period, helper){
            this.url = url;
            this.last_update = last_update;
            this.type = type;
            this.date = new Date();
            this.parsers = ['auth', type];
            this.period = period || Models.Settings.get('default_period', 15*60*1000);
            this.helper = helper;
        }  

        Job.prototype = {
            'execute': function(){
                var self = this;
                Utils.log("Start executing job " + this.type);
                Utils.XHR.get(this.url, this.last_update, function(text, xml){
                    for(var i in self.parsers){
                        if(Utils.Parsers[self.parsers[i]]){
                            Utils.Parsers[self.parsers[i]](self, text, xml);
                        }
                    }
                    Utils.log("Finished executing job " + self.type);
                    this.last_update = new Date();
                    if(!self.helper){
                        self.returnToPool();  
                    } 
                }, function(error){
                    self.returnToPool();
                    Utils.log("Error executing job " + self.type + " code " + error);
                });
            },

            'returnToPool': function(){
                this.date = new Date(this.date.valueOf() + this.period);
                Utils.Pool.addJob(this);
            },

            'removeFromPool': function(){
                Utils.Pool.removeJob(this);  
            }
        }

        return Job;
    })(),

    'uuid': function(){
        return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    },

    'format_date': function(date, format){
        var format = format || "%Y%M%D";
        return format.replace(/%[dDmMYHhJjSs]/g, function(param){
            if(param == '%d'){ return date.getDate(); }
            if(param == '%D'){ return (date.getDate()<10?'0':'')+date.getDate(); }
            if(param == '%m'){ return date.getMonth(); }
            if(param == '%M'){ return (date.getMonth()<10?'0':'')+date.getMonth(); }
            if(param == '%Y'){ return date.getFullYear(); }
            if(param == '%h'){ return date.getHours(); }
            if(param == '%H'){ return (date.getHours()<10?'0':'')+date.getHours(); }
            if(param == '%j'){ return date.getMinutes(); }
            if(param == '%J'){ return (date.getMinutes()<10?'0':'')+date.getMinutes(); }
            if(param == '%s'){ return date.getSeconds(); }
            if(param == '%S'){ return (date.getSeconds()<10?'0':'')+date.getSeconds(); }
        });
    },

    'strip_time': function(date){
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date;
    },

    'log': function(msg, type){
        if(!window.DEBUG) return;
        var type = type || 'Notice';

        if(!Background){
            kango.invokeAsync('Background.log', msg, type);
        }
        kango.console.log(['[', this.format_date(new Date(), "%D.%M.%Y %H:%J:%S"), '] ', 
                            type, ': ', msg].join(""));
    }
}