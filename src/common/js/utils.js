var Utils = {
    async_lm_get: function(url, last_modified, success, error){
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
                    if(success) success(xmlhttp.responseText);
                } else {
                    if(error) error(xmlhttp.status);
                }
            }
        };
        xmlhttp.send(null);
    },

    clean_url: function(url, full){
        return url.split('#')[0].split('?')[0]
                  .replace(/^(https?:\/\/)(www\.)?(tesera\.ru\/)(.*?)(\/)?$/, 
                    full? '$1$3$4/': '$4');
    },

    parse_url: function(url){
        var ret = {type: "", id: 0};
        if(!url || url.indexOf('//tesera.ru/') < 0){
            return ret;
        }

        var parts = this.clean_url(url).split('/');
        if(parts[0] == 'user' && Utils.humanize_type(parts[2])){
            ret = {type: parts[2], id: parts[3]}
        } else if(parts.length > 2 && parts[parts.length-2] == 'photo' || parts[parts.length-2] == 'video'){
            ret = {type: parts[parts.length-2], id: parts[parts.length-1]}
        } else if(parts.length > 1 && parts.length < 4 && Utils.humanize_type(parts[0])){
            ret = {type: parts[0], id: parts[1]}
        }

        return ret  
    },

    parse_title: function(title){
        return title.split('|')[0].trim()
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
    },

    'format_date': function(date, format){
        var format = format || "%Y%M%D";
        return format.replace(/%\w/g, function(param){
            if(param == '%d'){ return date.getDate(); }
            if(param == '%D'){ return (date.getDate()<10?'0':'')+date.getDate(); }
            if(param == '%m'){ return date.getMonth()+1; }
            if(param == '%M'){ return (date.getMonth()<10?'0':'')+(date.getMonth()+1); }
            if(param == '%U'){ return ['января','февраля','марта','апреля','мая',
                'июня','июля','августа','сентября','октября','ноября','декабря']
                [date.getMonth()]; }
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
        var date = new Date(date);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date;
    },

    'humanize_time': function(date){
        if(date >= Utils.strip_time()){
            return 'сегодня';
        } else if(date >= Utils.strip_time(Date.now() - 24*60*60*1000)){
            return 'вчера';
        } else if(date >= Utils.strip_time(Date.now() - 48*60*60*1000)){
            return 'позавчера';
        }
        return Utils.format_date(date, "%D %U");
    },

    'log': function(msg, type){
        if(!window.DEBUG) return;
        var type = type || 'Notice';
        if(!window.Background){
            kango.invokeAsync('Utils.log', msg, type);
        }
        kango.console.log(['[', this.format_date(new Date(), "%D.%M.%Y %H:%J:%S"), '] ', 
                            type, ': ', msg].join(""));
    }
};