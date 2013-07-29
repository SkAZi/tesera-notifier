var Core = {

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
                                'day': new Date(), // TODO: Вычислять реальную дату
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
                                'day': message.day,
                                'uid': Models.Messages.get_uid(message)
                            })
                        );
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

            Background.updateBadge();
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
                            'day': new Date(), // TODO: Вычислять реальную дату
                            'type': 'new'
                        });
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

            Background.updateBadge();
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
                            'day': new Date(), // TODO: Вычислять реальную дату
                            'type': 'article'
                        });
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

            Background.updateBadge();
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
                            'day': new Date(), // TODO: Вычислять реальную дату
                            'type': type
                        });
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

            Background.updateBadge();
            return callback();
        },

        'comments': function(job, text){
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
                        if(name.length && name.text() == Models.State.user) return;

                        comment = {
                            'id': id,
                            'day': new Date(), // TODO: Вычислять реальную дату
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
                                'uid': Models.Comments.get_uid(comment),
                                'day': comment.day,
                                'target': comment.target
                            })
                        );
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

            Background.updateBadge();
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
                    split_url.join("/"), new Date(), job.type, null, callback
                ));

                var self = this;
                setTimeout(function(){
                    self.executeNextJob(true);
                }, 500);
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


    Job: (function(){
        var Job = function(url, last_update, type, period, callback){
            this.url = url;
            this.type = type;
            this.parsers = ['auth', type];
            this.last_update = last_update || new Date();
            this.period = period;
            this.date = new Date(this.last_update.valueOf() + this.period);
            this.callback = callback || null;
        }  

        Job.prototype = {
            'execute': function(extra_callback){
                var self = this;
                Utils.log("Start executing job " + this.type);
                Utils.async_lm_get(this.url, this.last_update, function(text, xml){
                    for(var i in self.parsers){
                        if(Core.Parsers[self.parsers[i]]){
                            Core.Parsers[self.parsers[i]](self, text);
                        }
                    }

                    Utils.log("Finished job " + self.type);
                    
                    if(self.period){
                        self.last_update = new Date();
                        self.returnToPool();  
                    }

                    if(self.callback) self.callback(); 
                    if(extra_callback) extra_callback(); 
                }, function(error){
                    self.returnToPool();
                    if(extra_callback) extra_callback(); 
                    Utils.log("Error in job " + self.type + " code " + error);
                });
            },

            'returnToPool': function(){
                this.date = new Date(this.last_update.valueOf() + this.period);
                Core.Pool.addJob(this);
            },

            'removeFromPool': function(){
                Core.Pool.removeJob(this);  
            }
        }

        return Job;
    })()
};