var Core = {

    /* Парсеры данных */
    Parsers: {
        '_buildDOM': function(text){
            var text = text.replace(/src(=['"][^'"]+['"])/g, 'data-src=$1'),
                m = text.match(/<body[\s\S]*body>/m),
                mdta = m? 
                       m[0].replace('<body', '<div').replace('/body>', '/div>')
                       : text;

            return $('<div id="super-wrapper">'+mdta+'</div>');
        },

        'common': function(job, text, items_selector, parser, last_id_getter){
            var id = 0,
                html = this._buildDOM(text),
                last_id = 0,
                last_object = Models.Common.get_last(job.type),
                items = html.find(items_selector),
                callback = job.callback || function(){
                        Utils.log('Last id for '+ job.type +' is ' + last_id);
                        return Models.Common.set_last(job.type, {
                            'id': last_id || last_object.id || 0,
                            'date': new Date()
                        });
                    };

            if(last_object.id && parseInt(last_object.id) > 0){
                items.each(function(){
                    var $this = $(this);
                    id = parser.call($this, last_object);
                    if(id > last_id) last_id = id;
                });

                if(id > last_object.id){
                    Core.Pool.addHelper(job, callback)
                    return null;
                }
            } else if(items.length){
                last_id = last_id_getter(items);
            }

            Background.updateBadge();
            return callback();
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
            return Core.Parsers.common(job, text, 
                '.commentos .item', 
                function(last_object){
                    var id = parseInt(this.find('.user').attr('forid'));
                    if(id > last_object.id){
                        var name = this.find('.user a:not(.add)'),
                            title = this.find('b.title'),
                            message = {
                                'id': id,
                                'day': new Date(),
                                'from': {
                                    'id': parseInt(this.find('img.pic').attr('data-src').replace(/^.*\/items\/(\d+),22\/.*$/, '$1')),
                                    'name': name.length? name.text(): null
                                },
                                'title': title.length? title.text(): "",
                                'body': this.find('div.body > p').html().replace('<a +href="', '<a class="open" href="http://tesera.ru')
                            };

                        Models.Messages.add(message,
                            Models.Events.add({
                                'type': 'message',
                                'day': message.day,
                                'related': Models.Messages.get_uid(message)
                            })
                        );
                    }
                    return id;
                }, function(items){
                    return parseInt(items.eq(0).find('.user').attr('forid'));
                });
        },

        'comments': function(job, text){
            return Core.Parsers.common(job, text, 
                '.commentos .item', 
                function(last_object){
                    var id = parseInt(this.find('.user').attr('forid'));
                    if(id > last_object.id){
                        var name = this.find('.user a').eq(0),
                            title = this.find('b.title'),
                            subscription = Models.Subscriptions.get('http://tesera.ru' + this.find('.user a').eq(1).attr('href')),
                            comment;

                        if(!subscription.id) return; 
                        if(name.length && name.text() == Models.State.user) return;
                        if(name.length && Models.Settings.get('blacklist').indexOf(name.text()) > -1) return;

                        comment = {
                            'id': id,
                            'day': new Date(),
                            'from': {
                                'id': parseInt(this.find('img.pic').attr('data-src').replace(/^.*\/items\/(\d+),22\/.*$/, '$1')),
                                'name': name.length? name.text(): null
                            },
                            'target': {
                                'id': subscription.id,
                                'type': subscription.type,
                                'url': subscription.url,
                                'title': subscription.title
                            },
                            'title': title.length? title.text(): "",
                            'body': this.find('div.body > p').html()
                        };
                        
                        Models.Comments.add(comment, 
                            Models.Events.add({
                                'type': 'comment',
                                'id': comment.target.id,
                                'related': Models.Comments.get_uid(comment),
                                'day': comment.day,
                                'target': comment.target
                            })
                        );
                    }
                    return id;
                }, function(items){
                    return parseInt(items.eq(0).find('.user').attr('forid'));
                });
        },

        'news': function(job, text){
            return Core.Parsers.common(job, text, '#news_news .game', 
                function(last_object){
                    var id = parseInt(this.find('h3 a').attr('href').replace('/new/', ''));
                    if(id > last_object.id){
                        Models.Events.add({
                            'day': new Date(),
                            'type': 'new',
                            'related': {
                                'title': this.find('h3 a b').text(),
                                'url': 'http://tesera.ru' + this.find('h3 a').attr('href')
                            }
                        });
                    }
                    return id;
                }, function(items){
                    return parseInt(items.eq(0).find('h3 a').attr('href').replace('/new/', ''));
                });
        },

        'articles': function(job, text){
            return Core.Parsers.common(job, text, 
                '#articles_articles .game', 
                function(last_object){
                    var id = parseInt(this.find('.game-photo img').attr('data-src').replace(/^.*\/items\/(\d+),18\/.*$/, '$1'));
                    if(id > last_object.id){
                        Models.Events.add({
                            'day': new Date(),
                            'type': 'article',
                            'related': {
                                'title': this.find('h3 a b').text(),
                                'url': 'http://tesera.ru' + this.find('h3 a').attr('href')
                            }
                        });
                    }
                    return id;
                }, function(items){
                    return parseInt(items.eq(0).find('.game-photo img').attr('data-src').replace(/^.*\/items\/(\d+),18\/.*$/, '$1'));
                });
        },

        'diaries': function(job, text){
            return Core.Parsers.common(job, text, 
                '.main .usertimes', 
                function(last_object){
                    var type = this.find('.breadcrumbs span a').attr('href').split('/')[2];
                    var id = parseInt(this.find('.game-about a').attr('href').split('/')[4] || 0);
                    if(id > last_object.id){
                        Models.Events.add({
                            'day': new Date(),
                            'type': type,
                            'related': {
                                'title': this.find('.game-about .data a').text(),
                                'url': 'http://tesera.ru' + this.find('.game-about .data a').attr('href')
                            }
                        });
                    }
                    return id;
                }, function(items){
                    return parseInt(items.eq(0).find('.game-about a').attr('href').split('/')[4] || 0);
                });
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


    /* Пул задач */
    Pool: (function(){
        var Pool = function(){
            this._pool = [];
        }

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
                var split_url = job.url.split('/'),
                    page = parseInt(split_url[split_url.length-1] || 0) + 1;

                if(page > Models.Settings.get("max_pages", 3)){
                    return callback? callback(): null;
                }

                split_url[split_url.length-1] = page;
                this._pool.unshift(new Core.Job(
                    split_url.join("/"), job.type, new Date(), null, null, callback
                ));

                var self = this;
                setTimeout(function(){
                    self.executeNextJob(true);
                }, 2000);
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

            'getDates': function(){
                var dates = {};
                for(var i in this._pool){
                    dates[this._pool[i].type] = this._pool[i].last_update;
                }
                return dates;
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

            'executeNextJob': function(any, extra_callback){
                var job = this.nextJob(any);
                if(job){
                    job.execute(extra_callback);
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


    /* Задача */
    Job: (function(){
        var Job = function(url, type, last_update, period, parsers, callback){
            this.url = url;
            this.type = type;
            this.parsers = parsers || ['auth', type];
            this.last_update = last_update || new Date();
            this.period = period;
            this.date = new Date((this.last_update.valueOf() + this.period) || 0);
            this.callback = callback;
        }  

        Job.prototype = {
            'execute': function(callback){
                var self = this;
                Utils.log("Start executing job " + this.type);
                Utils.async_lm_get(this.url, this.last_update, function(text, xml){
                    for(var i in self.parsers){
                        if(Core.Parsers[self.parsers[i]]){
                            Core.Parsers[self.parsers[i]](self, text);
                        }
                    }
                    
                    self.returnToPool(false);  
                    if(this.callback) this.callback();
                    if(callback) callback();
                    Utils.log("Finished job " + self.type);
                }, function(error){
                    if(error >= 500){
                        Background.slowDown();
                        self.returnToPool(true);
                    } else {
                        self.returnToPool(false);
                    }
                    if(this.callback) this.callback();
                    if(callback) callback();
                    Utils.log("Error in job " + self.type + " code " + error);
                });
            },

            'returnToPool': function(previous){
                if(!this.period) return;
                this.last_update = new Date();
                if(!previous){
                    this.date = new Date(this.last_update.valueOf() + this.period);
                }
                Core.Pool.addJob(this);
            },

            'removeFromPool': function(){
                Core.Pool.removeJob(this);  
            }
        }

        return Job;
    })()
};