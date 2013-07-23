// TODO: разложить на Core и Utils
var Core = {
    Tesera: {
        clean_url: function(url, full){
            return url.replace(/^(https?:\/\/tesera\.ru\/)(.*)(\/)[^\/]*/, full? '$1$2$3': '$2');
        },

        // TODO: Улучшить разбор url (?)
        parse_url: function(url){
            var ret = {type: "", id: 0};
            if(url.indexOf('//tesera.ru/') < 0){
                return ret;
            }

            var parts = this.clean_url(url).split('/');
            if(parts[0] == 'user' && Core.Tesera.humanize_type(parts[2])){
                ret = {type: parts[2], id: parts[3]}
            } else if(parts.length > 2 && parts[parts.length-2] == 'photo' || parts[parts.length-2] == 'video'){
                ret = {type: parts[parts.length-2], id: parts[parts.length-1]}
            } else if(parts.length > 1 && parts.length < 4 && Core.Tesera.humanize_type(parts[0])){
                ret = {type: parts[0], id: parts[1]}
            }

            return ret  
        },

        parse_title: function(title){
            // TODO: Быть может парсить аккуратнее
            return title.split('|')[0].replace(/^ +| +$/g, '')

        },

        humanize_type: function(type){
            return {
                'message': "Сообщения",
                'new': "Новости",
                'article': "Статьи",
                'journal': "Записи в дневниках",
                'thought': "Мысли",
                'thoughtus': "Мысли",
                'game': "Игры",
                'comment': "Комментарии",
                'club': "Клубы",
                'company': "Компании",
                'persons': "Персоны",
                'project': "Проекты",
                'event': "События",
                'video': "Видео",
                'photo': "Фото"
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
                    Core.log('Page updated at ' + response_date);
                    if(response_date){
                        headersChecked = true;
                        if(new Date(response_date) <= last_modified){
                            Core.log('Skipping...');
                            xmlhttp.abort();    
                            if(error) error(304);
                        }
                    }
                } else if (xmlhttp.readyState == 4){
                    if(xmlhttp.status == 200){
                        if(success) success(xmlhttp.responseText);
                    } else {
                        if(error) error(xmlhttp.status);
                    }
                }
            };
            xmlhttp.send(null);
        }
    },


    // TODO: ПодDRYить
    Parsers: {
        '_buildDOM': function(text){
            var text = text.replace(/src(=['"][^'"]+['"])/g, 'data-src=$1'),
                m = text.match(/<body[\s\S]*body>/m),
                mdta = m? 
                       m[0].replace('<body', '<div').replace('/body>', '/div>')
                       : text;

            return $('<div id="super-wrapper">'+mdta+'</div>');
        },

        'auth': function(job, text){
            if(text.indexOf('id="open-authorize"') == -1){
                Models.State.authorized = new Date();
                Models.State.user = (text.match(/<a href="\/user\/" class="name"><span>([^<]*)<\/span>/) || [])[1] || null;
            } else {
                Models.State.authorized = false;
                Models.State.user = null;
            }

            kango.dispatchMessage('syncStatePopup', {'State': Models.State});
        },

        'messages': function(job, text){
            var id = 0,
                html = this._buildDOM(text),
                last_id = 0,
                last_message = Models.Common.get_last('messages'),
                items = html.find('.commentos .item'),
                callback = job.callback || function(){
                        return Models.Common.set_last('messages', {
                            'id': last_id,
                            'date': new Date()
                        });                    
                    };

            if(last_message.id){
                items.each(function(){
                    var $this = $(this);

                    id = parseInt($this.find('.user').attr('forid'));
                    if(id > last_message.id){
                        var name = $this.find('.user a:not(.add)'),
                            title = $this.find('b.title'),
                            message = {
                                'id': id,
                                'date': new Date(), // TODO: Вычислять реальную дату
                                'from': {
                                    'id': parseInt($this.find('img.pic').attr('data-src').replace(/^.*\/items\/(\d+),22\/.*$/, '$1')),
                                    'name': name.length? name.text(): null
                                },
                                'title': title.length? title.text(): "",
                                'body': $this.find('div.body > p').html()
                            };

                        Models.Messages.add(message,
                            Models.Events.add({
                                'type': 'message',
                                'day': message.date,
                                'ids': message.id
                            })
                        );
                        Background.update_badge();
                    }

                    if(id > last_id) last_id = id;
                });

                if(id > last_message.id){
                    Core.Pool.addHelper(job, callback)
                    return null;
                }
            } else if(items.length){
                last_id = parseInt(items.eq(0).find('.user').attr('forid'));
            }

            return callback();
        },

        'news': function(job, text){
            var id = 0,
                html = this._buildDOM(text),
                last_id = 0,
                last_news = Models.Common.get_last('news'),
                items = html.find('#news_news .game'),
                callback = job.callback || function(){
                    return Models.Common.set_last('news', {
                        'id': last_id,
                        'date': new Date()
                    }); 
                };

            if(last_news.id){
                items.each(function(){
                    var $this = $(this);

                    id = parseInt($this.find('h3 a').attr('href').replace('/new/', ''));
                    if(id > last_news.id){
                        Models.Events.add({
                            'day': new Date(),
                            'type': 'new'
                        });
                        Background.update_badge();
                    }

                    if(id > last_id) last_id = id;
                });

                if(id > last_news.id){
                    Core.Pool.addHelper(job, callback)
                    return null;
                }
            } else if(items.length){
                last_id = parseInt(items.eq(0).find('h3 a').attr('href').replace('/new/', ''));
            }

            return callback();
        },

        'articles': function(job, text){
            var id = 0,
                html = this._buildDOM(text),
                last_id = 0,
                last_article = Models.Common.get_last('articles'),
                items = html.find('#articles_articles .game'),
                callback = job.callback || function(){
                    return Models.Common.set_last('articles', {
                        'id': last_id,
                        'date': new Date()
                    });
                };

            if(last_article.id){
                items.each(function(){
                    var $this = $(this);
                    
                    id = parseInt($this.find('.game-photo img').attr('data-src').replace(/^.*\/items\/(\d+),18\/.*$/, '$1'));
                    if(id > last_article.id){
                        Models.Events.add({
                            'day': new Date(),
                            'type': 'article'
                        });
                        Background.update_badge();
                    }

                    if(id > last_id) last_id = id;
                });

                if(id > last_article.id){
                    Core.Pool.addHelper(job, callback)
                    return null;
                }
            } else if(items.length){
                last_id = parseInt(items.eq(0).find('.game-photo img').attr('data-src').replace(/^.*\/items\/(\d+),18\/.*$/, '$1'));
            }

            return callback();
        },

        'diaries': function(job, text){
            var id = 0,
                html = this._buildDOM(text),
                last_id = 0,
                last_article = Models.Common.get_last('diaries'),
                items = html.find('.main .usertimes'),
                callback = job.callback || function(){
                    return Models.Common.set_last('diaries', {
                        'id': last_id,
                        'date': new Date()
                    });
                };

            if(last_article.id){
                items.each(function(){
                    var $this = $(this),
                        type = $this.find('.breadcrumbs span a').attr('href').split('/')[2];
                    
                    id = parseInt($this.find('.game-about a').attr('href').split('/')[4] || 0);
                    if(id > last_article.id){
                        Models.Events.add({
                            'day': new Date(),
                            'type': type
                        });
                        Background.update_badge();
                    }

                    if(id > last_id) last_id = id;
                });

                if(id > last_article.id){
                    Core.Pool.addHelper(job, callback)
                    return null;
                }
            } else if(items.length){
                last_id = parseInt(items.eq(0).find('.game-about a').attr('href').split('/')[4] || 0);
            }

            return callback();
        },

        'comments': function(job, text){
            // TODO: Игнорировать собственные
            var id = 0,
                html = this._buildDOM(text),
                last_id = 0,
                last_comment = Models.Common.get_last('comments'),
                items = html.find('.commentos .item'),
                callback = job.callback || function(){
                        return Models.Common.set_last('comments', {
                            'id': last_id,
                            'date': new Date()
                        });                    
                    };

            if(last_comment.id){
                items.each(function(){
                    var $this = $(this);

                    id = parseInt($this.find('.user').attr('forid'));
                    if(id > last_comment.id){
                        var name = $this.find('.user a').eq(0),
                            title = $this.find('b.title'),
                            subscription = Models.Subscriptions.get('http://tesera.ru' + $this.find('.user a').eq(1).attr('href')),
                            comment;

                        if(!subscription.id) return; 

                        comment = {
                            'id': id,
                            'date': new Date(), // TODO: Вычислять реальную дату
                            'from': {
                                'id': parseInt($this.find('img.pic').attr('data-src').replace(/^.*\/items\/(\d+),22\/.*$/, '$1')),
                                'name': name.length? name.text(): null
                            },
                            'target': {
                                'id': subscription.id,
                                'type': subscription.type,
                                'url': subscription.url,
                                'title': subscription.title
                            },
                            'title': title.length? title.text(): "",
                            'body': $this.find('div.body > p').html()
                        };
                        
                        Models.Comments.add(comment, 
                            Models.Events.add({
                                'type': 'comment',
                                'id': comment.target.id,
                                'ids': comment.id,
                                'day': comment.date,
                                'target': comment.target
                            })
                        );
                        

                        Background.update_badge();
                    }

                    if(id > last_id) last_id = id;
                });

                if(id > last_comment.id){
                    Core.Pool.addHelper(job, callback)
                    return null;
                }
            } else if(items.length){
                last_id = parseInt(items.eq(0).find('.user').attr('forid'));
            }

            return callback();
        },

        'games': function(job, text){
            // TODO: Следить за новыми играми

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

            'addHelper': function(job, callback){
                // TODO: Быть может лучше стартовать задачу сразу
                var split_url = job.url.split('/'),
                    page = parseInt(split_url[split_url.length-1] || 0) + 1;

                if(page > Models.Settings.get("max_pages", 3)){
                    return callback? callback(): null;
                }

                split_url[split_url.length-1] = page;
                this._pool.unshift(new Core.Job(
                    split_url.join("/"), new Date(), job.type, null, callback
                ));            
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
                    Core.log("Pool is empty"); 
                }
            },

            'updateIntervals': function(){
                var settings = Models.Settings.all();
                for(var i in this._pool){
                    this._pool[i].period = settings[this._pool[i].type+'_interval']*60*1000;
                }
            },

            'clear': function(){
                this._pool = [];
            }
        }

        return new Pool();  // Singleton
    })(),


    Job: (function(){
        var Job = function(url, last_update, type, period, callback){
            this.url = url;
            this.last_update = last_update;
            this.type = type;
            this.date = new Date();
            this.parsers = ['auth', type];
            this.period = period;
            this.callback = callback || null;
        }  

        Job.prototype = {
            'execute': function(){
                var self = this;
                Core.log("Start executing job " + this.type);
                Core.XHR.get(this.url, this.last_update, function(text, xml){
                    for(var i in self.parsers){
                        if(Core.Parsers[self.parsers[i]]){
                            Core.Parsers[self.parsers[i]](self, text);
                        }
                    }

                    Core.log("Finished job " + self.type);
                    
                    if(self.period){
                        self.last_update = new Date();
                        self.returnToPool();  
                    }

                    if(self.callback){ 
                        self.callback(); 
                    } 
                }, function(error){
                    self.returnToPool();
                    Core.log("Error in job " + self.type + " code " + error);
                });
            },

            'returnToPool': function(){
                this.date = new Date(this.date.valueOf() + this.period);
                Core.Pool.addJob(this);
            },

            'removeFromPool': function(){
                Core.Pool.removeJob(this);  
            }
        }

        return Job;
    })(),

    'format_date': function(date, format){
        var format = format || "%Y%M%D";
        return format.replace(/%\w/g, function(param){
            if(param == '%d'){ return date.getDate(); }
            if(param == '%D'){ return (date.getDate()<10?'0':'')+date.getDate(); }
            if(param == '%m'){ return date.getMonth()+1; }
            if(param == '%M'){ return (date.getMonth()<10?'0':'')+(date.getMonth()+1); }
            if(param == '%Y'){ return date.getFullYear(); }
            if(param == '%h'){ return date.getHours(); }
            if(param == '%H'){ return (date.getHours()<10?'0':'')+date.getHours(); }
            if(param == '%j'){ return date.getMinutes(); }
            if(param == '%J'){ return (date.getMinutes()<10?'0':'')+date.getMinutes(); }
            if(param == '%s'){ return date.getSeconds(); }
            if(param == '%S'){ return (date.getSeconds()<10?'0':'')+date.getSeconds(); }
            if(param == '%%'){ return "%"; }
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
        if(!window.Background){
            kango.invokeAsync('Core.log', msg, type);
        }
        kango.console.log(['[', this.format_date(new Date(), "%D.%M.%Y %H:%J:%S"), '] ', 
                            type, ': ', msg].join(""));
    }
}