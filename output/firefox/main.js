﻿this.toast=function(){var e=document,t=e.getElementsByTagName("head")[0],n=this.setTimeout,r="createElement",i="appendChild",s="addEventListener",o="onreadystatechange",u="styleSheet",a=10,f=0,l=function(){--f},c,h=function(e,r,i,s){if(!t)n(function(){h(e)},a);else if(e.length){c=-1;while(i=e[++c]){if((s=typeof i)=="function"){r=function(){return i(),!0};break}if(s=="string")p(i);else if(i.pop){p(i[0]),r=i[1];break}}d(r,Array.prototype.slice.call(e,c+1))}},p=function(n,s){++f,/\.css$/.test(n)?(s=e[r]("link"),s.rel=u,s.href=n,t[i](s),v(s)):(s=e[r]("script"),s.src=n,t[i](s),s[o]===null?s[o]=m:s.onload=l)},d=function(e,t){if(!f)if(!e||e()){h(t);return}n(function(){d(e,t)},a)},v=function(e){if(e.sheet||e[u]){l();return}n(function(){v(e)},a)},m=function(){/ded|co/.test(this.readyState)&&l()};h(arguments)};

toast(
    'js/utils.js',
    'js/models.js',
    'js/background.js',
    'js/events.js',
    
    function(){
        window.DEBUG = Models.Settings.get("debug", true);
        Background.init();
    }
);