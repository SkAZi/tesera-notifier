(function() {
var templates = {};
templates["comments.html"] = (function() {
function root(env, context, frame, runtime) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<!--\n{\n    \"id\": (int),\n    \"day\": (date),\n    \"target\": (str),\n    \"target_id\": (int),\n    \"target_type\": (str),\n    \"from\": (str),\n    \"from_id\": (int),\n    \"title\": (str),\n    \"body\": (str)\n}\n-->\n\n<ul class=\"list\">\n    ";
if(env.getFilter("length")(runtime.contextOrFrameLookup(context, frame, "object_list")) == 0) {
output += "\n    <li class=\"empty\">Пока нет новых комментариев</li>\n    ";
}
output += "\n\n    ";
frame = frame.push();
var t_2 = runtime.contextOrFrameLookup(context, frame, "object_list");
if(t_2 !== undefined) {for(var t_1=0; t_1 < t_2.length; t_1++) {
var t_3 = t_2[t_1];
frame.set("object", t_3);
output += "\n        ";
if(env.getFilter("date")(runtime.memberLookup((t_3),"day", env.autoesc)) != runtime.contextOrFrameLookup(context, frame, "last_day")) {
output += "\n            <li class=\"day-header\">\n                ";
output += runtime.suppressValue(env.getFilter("date")(runtime.memberLookup((t_3),"day", env.autoesc)), env.autoesc);
output += "\n                <a href=\"#\" class=\"remove\" data-type=\"comment\" data-rel=\"";
output += runtime.suppressValue(env.getFilter("date")(runtime.memberLookup((t_3),"day", env.autoesc),"YYYYMMDD"), env.autoesc);
output += ":*\"></a>\n            </li>\n        ";
}
output += "\n        ";
if(runtime.memberLookup((runtime.memberLookup((t_3),"target", env.autoesc)),"id", env.autoesc) != runtime.contextOrFrameLookup(context, frame, "last_target") || env.getFilter("date")(runtime.memberLookup((t_3),"day", env.autoesc)) != runtime.contextOrFrameLookup(context, frame, "last_day")) {
output += "\n            <li class=\"header\">\n                <a href=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((t_3),"target", env.autoesc)),"url", env.autoesc), env.autoesc);
output += "\" class=\"open\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((t_3),"target", env.autoesc)),"title", env.autoesc), env.autoesc);
output += "</a>\n                <a href=\"#\" class=\"remove\" data-type=\"comment\" data-rel=\"";
output += runtime.suppressValue(env.getFilter("date")(runtime.memberLookup((t_3),"day", env.autoesc),"YYYYMMDD"), env.autoesc);
output += ":";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((t_3),"target", env.autoesc)),"id", env.autoesc), env.autoesc);
output += ":*\"></a>\n            </li>\n        ";
}
output += "\n\n        <li id=\"comment";
output += runtime.suppressValue(runtime.memberLookup((t_3),"id", env.autoesc), env.autoesc);
output += "\">\n            <a href=\"http://tesera.ru/user/";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((t_3),"from", env.autoesc)),"name", env.autoesc), env.autoesc);
output += "/\" class=\"open\"><img class=\"pic\" src=\"http://tesera.ru/images/items/";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((t_3),"from", env.autoesc)),"id", env.autoesc), env.autoesc);
output += ",22/32x32xpa/photo.jpg\" width=\"32\" height=\"32\" alt=\"\" title=\"\">\n            <div class=\"text\"></a>\n                <p class=\"nick\"><a href=\"http://tesera.ru/user/";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((t_3),"from", env.autoesc)),"name", env.autoesc), env.autoesc);
output += "/\" class=\"open\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((t_3),"from", env.autoesc)),"name", env.autoesc), env.autoesc);
output += "</a></p>\n                ";
if(runtime.memberLookup((t_3),"title", env.autoesc)) {
output += "<h4>";
output += runtime.suppressValue(runtime.memberLookup((t_3),"title", env.autoesc), env.autoesc);
output += "</h4>";
}
output += "\n                <p class=\"content\">";
output += runtime.suppressValue(runtime.memberLookup((t_3),"body", env.autoesc), env.autoesc);
output += "</p>\n                \n                <!--\n                <p><a href=\"#\" class=\"local answer\">Ответить</a></p>\n                <form action=\"http://tesera.ru/user_message0/\" method=\"post\">\n                    <div class=\"row\">\n                        <textarea name=\"message_comments\" placeholder=\"Текст сообщения\" cols=\"30\" rows=\"10\"></textarea>\n                    </div>\n\n                    <button type=\"submit\">Написать</button>\n                </form>\n                -->\n            </div>\n            <a href=\"#\" class=\"remove\" data-type=\"comment\" data-rel=\"";
output += runtime.suppressValue(runtime.memberLookup((t_3),"day", env.autoesc), env.autoesc);
output += ":";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((t_3),"target", env.autoesc)),"id", env.autoesc), env.autoesc);
output += ":";
output += runtime.suppressValue(runtime.memberLookup((t_3),"id", env.autoesc), env.autoesc);
output += "\"></a>\n        </li>\n\n        ";
var t_4;
t_4 = env.getFilter("date")(runtime.memberLookup((t_3),"day", env.autoesc));
frame.set("last_day", t_4);
if(!frame.parent) {
context.setVariable("last_day", t_4);
context.addExport("last_day");
}
output += "\n        ";
var t_5;
t_5 = runtime.memberLookup((runtime.memberLookup((t_3),"target", env.autoesc)),"id", env.autoesc);
frame.set("last_target", t_5);
if(!frame.parent) {
context.setVariable("last_target", t_5);
context.addExport("last_target");
}
output += "\n    ";
}
}frame = frame.pop();
output += "\n</ul>";
return output;
} catch (e) {
  runtime.handleError(e, lineno, colno);
}
}
return {
root: root
};

})();
templates["log.html"] = (function() {
function root(env, context, frame, runtime) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<!--\n    LogType ::\n    {\n        \"id\": (int),\n        \"day\": (date),\n        \"type\": (str) <message|comment|news|diary|game>,\n        \"count\": (int),\n        \"target\": (str),\n        \"target_type\": (str)\n    }\n-->\n\n<ul class=\"list\">\n    ";
if(env.getFilter("length")(runtime.contextOrFrameLookup(context, frame, "object_list")) == 0) {
output += "\n    <li class=\"empty\">У вас пока нет ни одного события</li>\n    ";
}
output += "\n\n    ";
frame = frame.push();
var t_2 = runtime.contextOrFrameLookup(context, frame, "object_list");
if(t_2 !== undefined) {for(var t_1=0; t_1 < t_2.length; t_1++) {
var t_3 = t_2[t_1];
frame.set("object", t_3);
output += "\n        ";
if(env.getFilter("date")(runtime.memberLookup((t_3),"day", env.autoesc)) != runtime.contextOrFrameLookup(context, frame, "last_day")) {
output += "\n            <li class=\"day-header\">\n                ";
output += runtime.suppressValue(env.getFilter("date")(runtime.memberLookup((t_3),"day", env.autoesc)), env.autoesc);
output += "\n                <a href=\"#\" class=\"remove\" data-type=\"log\" data-rel=\"";
output += runtime.suppressValue(env.getFilter("date")(runtime.memberLookup((t_3),"day", env.autoesc),"YYYYMMDD"), env.autoesc);
output += ":*\"></a>\n            </li>\n        ";
}
output += "\n        ";
if(runtime.memberLookup((t_3),"type", env.autoesc) != runtime.contextOrFrameLookup(context, frame, "last_type") || env.getFilter("date")(runtime.memberLookup((t_3),"day", env.autoesc)) != runtime.contextOrFrameLookup(context, frame, "last_day")) {
output += "\n            <li class=\"header\">\n                ";
output += runtime.suppressValue(env.getFilter("humanize_type")(runtime.memberLookup((t_3),"type", env.autoesc)), env.autoesc);
output += "\n                <a href=\"#\" class=\"remove\" data-type=\"log\" data-rel=\"";
output += runtime.suppressValue(env.getFilter("date")(runtime.memberLookup((t_3),"day", env.autoesc),"YYYYMMDD"), env.autoesc);
output += ":";
output += runtime.suppressValue(runtime.memberLookup((t_3),"type", env.autoesc), env.autoesc);
output += ":*\"></a>\n            </li>\n        ";
}
output += "\n\n        <li>\n        ";
if(runtime.memberLookup((t_3),"type", env.autoesc) == "message") {
output += "\n            У вас <a href=\"#\">";
output += runtime.suppressValue(env.getFilter("pluralize")(runtime.memberLookup((t_3),"count", env.autoesc),"новое сообщение","новых сообщения","новых сообщений"), env.autoesc);
output += "</a>\n        ";
}
else {
if(runtime.memberLookup((t_3),"type", env.autoesc) == "comment") {
output += "\n            <a href=\"#\">";
output += runtime.suppressValue(env.getFilter("pluralize")(runtime.memberLookup((t_3),"count", env.autoesc),"новый комментарий","новых комментария","новых комментариев"), env.autoesc);
output += "</a> к «<a href=\"#\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((t_3),"target", env.autoesc)),"title", env.autoesc), env.autoesc);
output += "</a>»\n        ";
}
else {
if(runtime.memberLookup((t_3),"type", env.autoesc) == "new") {
output += "\n            На сайте ";
output += runtime.suppressValue(env.getFilter("pluralize")(runtime.memberLookup((t_3),"count", env.autoesc),"появилась","появилось","появилось",true), env.autoesc);
output += " <a href=\"#\">";
output += runtime.suppressValue(env.getFilter("pluralize")(runtime.memberLookup((t_3),"count", env.autoesc),"новость","новости","новостей"), env.autoesc);
output += "</a>\n        ";
}
else {
if(runtime.memberLookup((t_3),"type", env.autoesc) == "journal") {
output += "\n            На сайте ";
output += runtime.suppressValue(env.getFilter("pluralize")(runtime.memberLookup((t_3),"count", env.autoesc),"появилась","появилось","появилось",true), env.autoesc);
output += " <a href=\"#\">";
output += runtime.suppressValue(env.getFilter("pluralize")(runtime.memberLookup((t_3),"count", env.autoesc),"запись в дневнике","записи в дневниках","записей в дневниках"), env.autoesc);
output += "</a>\n        ";
}
else {
if(runtime.memberLookup((t_3),"type", env.autoesc) == "thought") {
output += "\n            На сайте ";
output += runtime.suppressValue(env.getFilter("pluralize")(runtime.memberLookup((t_3),"count", env.autoesc),"появилась","появилось","появилось",true), env.autoesc);
output += " <a href=\"#\">";
output += runtime.suppressValue(env.getFilter("pluralize")(runtime.memberLookup((t_3),"count", env.autoesc),"мысль","мысли","мыслей"), env.autoesc);
output += "</a>\n        ";
}
else {
if(runtime.memberLookup((t_3),"type", env.autoesc) == "game") {
output += "\n            На сайте ";
output += runtime.suppressValue(env.getFilter("pluralize")(runtime.memberLookup((t_3),"count", env.autoesc),"появилась","появилось","появилось",true), env.autoesc);
output += " <a href=\"#\">";
output += runtime.suppressValue(env.getFilter("pluralize")(runtime.memberLookup((t_3),"count", env.autoesc),"новая игра","новых игры","новых игр"), env.autoesc);
output += "</a>\n        ";
}
}
}
}
}
}
output += "\n        </li>\n\n        ";
var t_4;
t_4 = env.getFilter("date")(runtime.memberLookup((t_3),"day", env.autoesc));
frame.set("last_day", t_4);
if(!frame.parent) {
context.setVariable("last_day", t_4);
context.addExport("last_day");
}
output += "\n        ";
var t_5;
t_5 = runtime.memberLookup((t_3),"type", env.autoesc);
frame.set("last_type", t_5);
if(!frame.parent) {
context.setVariable("last_type", t_5);
context.addExport("last_type");
}
output += "\n    ";
}
}frame = frame.pop();
output += "\n</ul>";
return output;
} catch (e) {
  runtime.handleError(e, lineno, colno);
}
}
return {
root: root
};

})();
templates["messages.html"] = (function() {
function root(env, context, frame, runtime) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<ul class=\"list\">\n    ";
if(env.getFilter("length")(runtime.contextOrFrameLookup(context, frame, "object_list")) == 0) {
output += "\n    <li class=\"empty\">У вас нет непрочитанных сообщений</li>\n    ";
}
output += "\n\n    ";
frame = frame.push();
var t_2 = runtime.contextOrFrameLookup(context, frame, "object_list");
if(t_2 !== undefined) {for(var t_1=0; t_1 < t_2.length; t_1++) {
var t_3 = t_2[t_1];
frame.set("object", t_3);
output += "\n        ";
if(env.getFilter("date")(runtime.memberLookup((t_3),"day", env.autoesc)) != runtime.contextOrFrameLookup(context, frame, "last_day")) {
output += "\n            <li class=\"day-header\">";
output += runtime.suppressValue(env.getFilter("date")(runtime.memberLookup((t_3),"day", env.autoesc)), env.autoesc);
output += "</li>\n        ";
}
output += "\n\n        <li id=\"message";
output += runtime.suppressValue(runtime.memberLookup((t_3),"id", env.autoesc), env.autoesc);
output += "\" ";
if(runtime.memberLookup((t_3),"unread", env.autoesc)) {
output += "class=\"unread\"";
}
output += ">\n            <a href=\"http://tesera.ru/user/";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((t_3),"from", env.autoesc)),"name", env.autoesc), env.autoesc);
output += "/\" class=\"open\"><img class=\"pic\" src=\"http://tesera.ru/images/items/";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((t_3),"from", env.autoesc)),"id", env.autoesc), env.autoesc);
output += ",22/32x32/photo.jpg\" width=\"32\" height=\"32\" alt=\"\" title=\"\"></a>\n            \n            <div class=\"text\">\n                <p class=\"nick\"><a href=\"http://tesera.ru/user/";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((t_3),"from", env.autoesc)),"name", env.autoesc), env.autoesc);
output += "/\" class=\"open\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((t_3),"from", env.autoesc)),"name", env.autoesc), env.autoesc);
output += "</a></p>\n                <h4><a href=\"http://tesera.ru/user/messages/\" class=\"open\">";
output += runtime.suppressValue(runtime.memberLookup((t_3),"title", env.autoesc), env.autoesc);
output += "</a></h4>\n                <p class=\"content\">";
output += runtime.suppressValue(runtime.memberLookup((t_3),"body", env.autoesc), env.autoesc);
output += "</p>\n                \n                <!--\n                <p><a href=\"#\" class=\"local answer\">Ответить</a></p>\n                <form action=\"http://tesera.ru/user_message0/\" method=\"post\">\n                    <div class=\"row\">\n                        <textarea name=\"message_comments\" placeholder=\"Текст сообщения\" cols=\"30\" rows=\"10\"></textarea>\n                    </div>\n\n                    <button type=\"submit\">Написать</button>\n                </form>\n                -->\n            </div>\n            <a href=\"javascript:\" class=\"remove\" data-type=\"message\" data-rel=\"";
output += runtime.suppressValue(runtime.memberLookup((t_3),"id", env.autoesc), env.autoesc);
output += "\"></a>\n        </li>\n\n        ";
var t_4;
t_4 = env.getFilter("date")(runtime.memberLookup((t_3),"day", env.autoesc));
frame.set("last_day", t_4);
if(!frame.parent) {
context.setVariable("last_day", t_4);
context.addExport("last_day");
}
output += "\n    ";
}
}frame = frame.pop();
output += "\n</ul>";
return output;
} catch (e) {
  runtime.handleError(e, lineno, colno);
}
}
return {
root: root
};

})();
templates["subscriptions.html"] = (function() {
function root(env, context, frame, runtime) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<ul class=\"list\">\n    ";
if(env.getFilter("length")(runtime.contextOrFrameLookup(context, frame, "object_list")) == 0) {
output += "\n    <li class=\"empty\">У вас пока нет подписок, их можно <a href=\"#\" class=\"local\">импортировать</a> из&nbsp;предыдущей версии.</li>\n    ";
}
output += "\n\n    ";
frame = frame.push();
var t_2 = runtime.contextOrFrameLookup(context, frame, "object_list");
if(t_2 !== undefined) {for(var t_1=0; t_1 < t_2.length; t_1++) {
var t_3 = t_2[t_1];
frame.set("object", t_3);
output += "\n        ";
if(runtime.memberLookup((t_3),"active", env.autoesc) != runtime.contextOrFrameLookup(context, frame, "last_active")) {
output += "\n            <li class=\"day-header\">";
output += runtime.suppressValue((runtime.memberLookup((t_3),"active", env.autoesc)?"активные подписки":"устаревшие подписки"), env.autoesc);
output += "</li>\n        ";
}
output += "\n        ";
if(runtime.memberLookup((t_3),"type", env.autoesc) != runtime.contextOrFrameLookup(context, frame, "last_type") || runtime.memberLookup((t_3),"active", env.autoesc) != runtime.contextOrFrameLookup(context, frame, "last_active")) {
output += "\n            <li class=\"header\">\n                ";
output += runtime.suppressValue(env.getFilter("humanize_type")(runtime.memberLookup((t_3),"type", env.autoesc)), env.autoesc);
output += "\n                ";
if(!runtime.memberLookup((t_3),"active", env.autoesc)) {
output += "\n                <a href=\"#\" class=\"remove\" data-type=\"subscription-block\" data-rel=\"";
output += runtime.suppressValue(runtime.memberLookup((t_3),"type", env.autoesc), env.autoesc);
output += "\"></a>\n                ";
}
output += "\n            </li>\n        ";
}
output += "\n\n        <li>\n            <a href=\"";
output += runtime.suppressValue(runtime.memberLookup((t_3),"url", env.autoesc), env.autoesc);
output += "\" class=\"open\">";
output += runtime.suppressValue(runtime.memberLookup((t_3),"title", env.autoesc), env.autoesc);
output += "</a>\n            <a href=\"#\" data-type=\"subscription\" data-rel=\"";
output += runtime.suppressValue(runtime.memberLookup((t_3),"type", env.autoesc), env.autoesc);
output += ":";
output += runtime.suppressValue(runtime.memberLookup((t_3),"id", env.autoesc), env.autoesc);
output += "\" class=\"remove\"></a>\n        </li>\n\n        ";
var t_4;
t_4 = runtime.memberLookup((t_3),"active", env.autoesc);
frame.set("last_active", t_4);
if(!frame.parent) {
context.setVariable("last_active", t_4);
context.addExport("last_active");
}
output += "\n        ";
var t_5;
t_5 = runtime.memberLookup((t_3),"type", env.autoesc);
frame.set("last_type", t_5);
if(!frame.parent) {
context.setVariable("last_type", t_5);
context.addExport("last_type");
}
output += "\n    ";
}
}frame = frame.pop();
output += "\n</ul>";
return output;
} catch (e) {
  runtime.handleError(e, lineno, colno);
}
}
return {
root: root
};

})();
if(typeof define === "function" && define.amd) {
    define(["nunjucks"], function(nunjucks) {
        nunjucks.env = new nunjucks.Environment([], null);
        nunjucks.env.registerPrecompiled(templates);
        return nunjucks;
    });
}
else if(typeof nunjucks === "object") {
    nunjucks.env = new nunjucks.Environment([], null);
    nunjucks.env.registerPrecompiled(templates);
}
else {
    console.error("ERROR: You must load nunjucks before the precompiled templates");
}
})();
