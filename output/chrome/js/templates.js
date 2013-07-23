(function() {
var templates = {};
templates["comments.html"] = (function() {
function root(env, context, frame, runtime) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<ul class=\"list\">\n    ";
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
output += "\n                <a href=\"#\" class=\"remove\" data-rel=\"comment:";
output += runtime.suppressValue(env.getFilter("date")(runtime.memberLookup((t_3),"day", env.autoesc),"YYYYMMDD"), env.autoesc);
output += ":*\"></a>\n            </li>\n        ";
}
output += "\n        ";
if(runtime.memberLookup((runtime.memberLookup((t_3),"target", env.autoesc)),"id", env.autoesc) != runtime.contextOrFrameLookup(context, frame, "last_target") || env.getFilter("date")(runtime.memberLookup((t_3),"day", env.autoesc)) != runtime.contextOrFrameLookup(context, frame, "last_day")) {
output += "\n            <li class=\"header\">\n                <a href=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((t_3),"target", env.autoesc)),"url", env.autoesc), env.autoesc);
output += "\" class=\"open\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((t_3),"target", env.autoesc)),"title", env.autoesc), env.autoesc);
output += "</a>\n                <a href=\"#\" class=\"remove\" data-rel=\"comment:";
output += runtime.suppressValue(env.getFilter("date")(runtime.memberLookup((t_3),"day", env.autoesc),"YYYYMMDD"), env.autoesc);
output += ":";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((t_3),"target", env.autoesc)),"id", env.autoesc), env.autoesc);
output += "*\"></a>\n            </li>\n        ";
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
output += "</p>\n                \n                <!--\n                <p><a href=\"#\" class=\"local answer\">Ответить</a></p>\n                <form action=\"#message\" method=\"post\" class=\"hidden-form\">\n                    <div class=\"row\">\n                        <textarea name=\"message_comments\" placeholder=\"Текст сообщения\" cols=\"30\" rows=\"10\"></textarea>\n                    </div>\n\n                    <button type=\"submit\">Написать</button>\n                </form>\n                -->\n            </div>\n            <a href=\"#\" class=\"remove\" data-rel=\"";
output += runtime.suppressValue(runtime.memberLookup((t_3),"uid", env.autoesc), env.autoesc);
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
templates["events.html"] = (function() {
function root(env, context, frame, runtime) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<ul class=\"list\">\n    ";
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
output += "\n                <a href=\"#\" class=\"remove\" data-rel=\"log:";
output += runtime.suppressValue(env.getFilter("date")(runtime.memberLookup((t_3),"day", env.autoesc),"YYYYMMDD"), env.autoesc);
output += "*\"></a>\n            </li>\n        ";
}
output += "\n        ";
if(runtime.memberLookup((t_3),"type", env.autoesc) != runtime.contextOrFrameLookup(context, frame, "last_type") || env.getFilter("date")(runtime.memberLookup((t_3),"day", env.autoesc)) != runtime.contextOrFrameLookup(context, frame, "last_day")) {
output += "\n            <li class=\"header\">\n                ";
output += runtime.suppressValue(env.getFilter("humanize_type")(runtime.memberLookup((t_3),"type", env.autoesc)), env.autoesc);
output += "\n                <a href=\"#\" class=\"remove\" data-rel=\"log:";
output += runtime.suppressValue(env.getFilter("date")(runtime.memberLookup((t_3),"day", env.autoesc),"YYYYMMDD"), env.autoesc);
output += ":";
output += runtime.suppressValue(runtime.memberLookup((t_3),"type", env.autoesc), env.autoesc);
output += "*\"></a>\n            </li>\n        ";
}
output += "\n\n        <li class=\"delete\" data-rel=\"";
output += runtime.suppressValue(runtime.memberLookup((t_3),"uid", env.autoesc), env.autoesc);
output += "\">\n        ";
if(runtime.memberLookup((t_3),"type", env.autoesc) == "message") {
output += "\n            У вас <a href=\"http://tesera.ru/user/messages/\" class=\"open\">";
output += runtime.suppressValue(env.getFilter("pluralize")(runtime.memberLookup((t_3),"count", env.autoesc),"новое сообщение","новых сообщения","новых сообщений"), env.autoesc);
output += "</a>\n        ";
}
else {
if(runtime.memberLookup((t_3),"type", env.autoesc) == "comment") {
output += "\n            ";
output += runtime.suppressValue(env.getFilter("pluralize")(runtime.memberLookup((t_3),"count", env.autoesc),"новый комментарий","новых комментария","новых комментариев"), env.autoesc);
output += " к «<a href=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((t_3),"target", env.autoesc)),"url", env.autoesc), env.autoesc);
output += "\" class=\"open\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((t_3),"target", env.autoesc)),"title", env.autoesc), env.autoesc);
output += "</a>»\n        ";
}
else {
if(runtime.memberLookup((t_3),"type", env.autoesc) == "article") {
output += "\n            На сайте ";
output += runtime.suppressValue(env.getFilter("pluralize")(runtime.memberLookup((t_3),"count", env.autoesc),"появилась","появилось","появилось",true), env.autoesc);
output += " <a href=\"http://tesera.ru/articles/\" class=\"open\">";
output += runtime.suppressValue(env.getFilter("pluralize")(runtime.memberLookup((t_3),"count", env.autoesc),"статья","статьи","статей"), env.autoesc);
output += "</a>\n        ";
}
else {
if(runtime.memberLookup((t_3),"type", env.autoesc) == "new") {
output += "\n            На сайте ";
output += runtime.suppressValue(env.getFilter("pluralize")(runtime.memberLookup((t_3),"count", env.autoesc),"появилась","появилось","появилось",true), env.autoesc);
output += " <a href=\"http://tesera.ru/news/\" class=\"open\">";
output += runtime.suppressValue(env.getFilter("pluralize")(runtime.memberLookup((t_3),"count", env.autoesc),"новость","новости","новостей"), env.autoesc);
output += "</a>\n        ";
}
else {
if(runtime.memberLookup((t_3),"type", env.autoesc) == "journal") {
output += "\n            На сайте ";
output += runtime.suppressValue(env.getFilter("pluralize")(runtime.memberLookup((t_3),"count", env.autoesc),"появилась","появилось","появилось",true), env.autoesc);
output += " <a href=\"http://tesera.ru/diaries/journal/\" class=\"open\">";
output += runtime.suppressValue(env.getFilter("pluralize")(runtime.memberLookup((t_3),"count", env.autoesc),"запись в дневнике","записи в дневниках","записей в дневниках"), env.autoesc);
output += "</a>\n        ";
}
else {
if(runtime.memberLookup((t_3),"type", env.autoesc) == "thoughtus") {
output += "\n            На сайте ";
output += runtime.suppressValue(env.getFilter("pluralize")(runtime.memberLookup((t_3),"count", env.autoesc),"появилась","появилось","появилось",true), env.autoesc);
output += " <a href=\"http://tesera.ru/diaries/thoughtus/\" class=\"open\">";
output += runtime.suppressValue(env.getFilter("pluralize")(runtime.memberLookup((t_3),"count", env.autoesc),"мысль","мысли","мыслей"), env.autoesc);
output += "</a>\n        ";
}
else {
if(runtime.memberLookup((t_3),"type", env.autoesc) == "game") {
output += "\n            На сайте ";
output += runtime.suppressValue(env.getFilter("pluralize")(runtime.memberLookup((t_3),"count", env.autoesc),"появилась","появилось","появилось",true), env.autoesc);
output += " <a href=\"http://tesera.ru/games/\" class=\"open\">";
output += runtime.suppressValue(env.getFilter("pluralize")(runtime.memberLookup((t_3),"count", env.autoesc),"новая игра","новых игры","новых игр"), env.autoesc);
output += "</a>\n        ";
}
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
output += "</p>\n                \n                <!--\n                <p><a href=\"#\" class=\"local answer\">Ответить</a></p>\n                <form action=\"#message\" method=\"post\" class=\"hidden-form\">\n                    <div class=\"row\">\n                        <textarea name=\"message_comments\" placeholder=\"Текст сообщения\" cols=\"30\" rows=\"10\"></textarea>\n                    </div>\n\n                    <button type=\"submit\">Написать</button>\n                </form>\n                -->\n            </div>\n            <a href=\"javascript:\" class=\"remove\" data-rel=\"";
output += runtime.suppressValue(runtime.memberLookup((t_3),"uid", env.autoesc), env.autoesc);
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
templates["settings.html"] = (function() {
function root(env, context, frame, runtime) {
var lineno = null;
var colno = null;
var output = "";
try {
output += "<form class=\"settings\" action=\"#save-settings\" method=\"post\">\n\n    <div class=\"header\">Частота обновлений</div>\n\n    <div class=\"row\">\n        <span>Проверять сообщения каждые:</span> <select name=\"messages_interval\">\n            ";
frame = frame.push();
var t_2 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "options")),"messages_interval", env.autoesc);
if(t_2 !== undefined) {for(var t_1=0; t_1 < t_2.length; t_1++) {
var t_3 = t_2[t_1];
frame.set("val", t_3);
output += "\n                <option value=\"";
output += runtime.suppressValue(t_3, env.autoesc);
output += "\" ";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "settings")),"messages_interval", env.autoesc) == t_3) {
output += "selected=\"selected\"";
}
output += ">";
if(t_3) {
output += runtime.suppressValue(t_3, env.autoesc);
output += " минут";
}
else {
output += "не проверять";
}
output += "</option>\n            ";
}
}frame = frame.pop();
output += "\n        </select>\n    </div>\n\n    <div class=\"row\">\n        <span>Проверять комментарии каждые:</span> <select name=\"comments_interval\">\n            ";
frame = frame.push();
var t_5 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "options")),"comments_interval", env.autoesc);
if(t_5 !== undefined) {for(var t_4=0; t_4 < t_5.length; t_4++) {
var t_6 = t_5[t_4];
frame.set("val", t_6);
output += "\n                <option value=\"";
output += runtime.suppressValue(t_6, env.autoesc);
output += "\" ";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "settings")),"comments_interval", env.autoesc) == t_6) {
output += "selected=\"selected\"";
}
output += ">";
if(t_6) {
output += runtime.suppressValue(t_6, env.autoesc);
output += " минут";
}
else {
output += "не проверять";
}
output += "</option>\n            ";
}
}frame = frame.pop();
output += "\n        </select>\n    </div>\n\n    <div class=\"row\">\n        <span>Проверять дневники каждые:</span> <select name=\"diaries_interval\">\n            ";
frame = frame.push();
var t_8 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "options")),"diaries_interval", env.autoesc);
if(t_8 !== undefined) {for(var t_7=0; t_7 < t_8.length; t_7++) {
var t_9 = t_8[t_7];
frame.set("val", t_9);
output += "\n                <option value=\"";
output += runtime.suppressValue(t_9, env.autoesc);
output += "\" ";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "settings")),"diaries_interval", env.autoesc) == t_9) {
output += "selected=\"selected\"";
}
output += ">";
if(t_9) {
output += runtime.suppressValue(t_9, env.autoesc);
output += " минут";
}
else {
output += "не проверять";
}
output += "</option>\n            ";
}
}frame = frame.pop();
output += "\n        </select>\n    </div>\n\n    <div class=\"row\">\n        <span>Проверять статьи каждые:</span> <select name=\"articles_interval\">\n            ";
frame = frame.push();
var t_11 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "options")),"articles_interval", env.autoesc);
if(t_11 !== undefined) {for(var t_10=0; t_10 < t_11.length; t_10++) {
var t_12 = t_11[t_10];
frame.set("val", t_12);
output += "\n                <option value=\"";
output += runtime.suppressValue(t_12, env.autoesc);
output += "\" ";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "settings")),"articles_interval", env.autoesc) == t_12) {
output += "selected=\"selected\"";
}
output += ">";
if(t_12) {
output += runtime.suppressValue(t_12, env.autoesc);
output += " минут";
}
else {
output += "не проверять";
}
output += "</option>\n            ";
}
}frame = frame.pop();
output += "\n        </select>\n    </div>\n\n    <div class=\"row\">\n        <span>Проверять новости каждые:</span> <select name=\"news_interval\">\n            ";
frame = frame.push();
var t_14 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "options")),"news_interval", env.autoesc);
if(t_14 !== undefined) {for(var t_13=0; t_13 < t_14.length; t_13++) {
var t_15 = t_14[t_13];
frame.set("val", t_15);
output += "\n                <option value=\"";
output += runtime.suppressValue(t_15, env.autoesc);
output += "\" ";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "settings")),"news_interval", env.autoesc) == t_15) {
output += "selected=\"selected\"";
}
output += ">";
if(t_15) {
output += runtime.suppressValue(t_15, env.autoesc);
output += " минут";
}
else {
output += "не проверять";
}
output += "</option>\n            ";
}
}frame = frame.pop();
output += "\n        </select>\n    </div>\n\n    <div class=\"header\">Примерный расход трафика</div>\n    <div class=\"stats\">\n        <dl class=\"stat\">\n            <dt class=\"hour\">в час:</dt>\n            <dd class=\"hour\">~";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "hour"), env.autoesc);
output += " Мб</dd>\n            <dt class=\"day\">в день:</dt>\n            <dd class=\"day\">~";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "day"), env.autoesc);
output += " Мб</dd>\n        </dl>\n    </div>\n\n    <div class=\"header\">Настройки истории</div>\n\n    <div class=\"row\">\n        <span>Искать старые записи:</span> <select name=\"max_pages\">\n            ";
frame = frame.push();
var t_17 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "options")),"max_pages", env.autoesc);
if(t_17 !== undefined) {for(var t_16=0; t_16 < t_17.length; t_16++) {
var t_18 = t_17[t_16];
frame.set("val", t_18);
output += "\n                <option value=\"";
output += runtime.suppressValue(t_18, env.autoesc);
output += "\" ";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "settings")),"max_pages", env.autoesc) == t_18) {
output += "selected=\"selected\"";
}
output += ">";
if(t_18) {
output += runtime.suppressValue(env.getFilter("pluralize")(t_18,"страницу","страницы","страниц"), env.autoesc);
}
else {
output += "игнорировать";
}
output += "</option>\n            ";
}
}frame = frame.pop();
output += "\n        </select>\n    </div>\n\n    <div class=\"row\">\n        <span>Хранить не более:</span> <select name=\"cleanup\">\n            ";
frame = frame.push();
var t_20 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "options")),"cleanup", env.autoesc);
if(t_20 !== undefined) {for(var t_19=0; t_19 < t_20.length; t_19++) {
var t_21 = t_20[t_19];
frame.set("val", t_21);
output += "\n                <option value=\"";
output += runtime.suppressValue(t_21, env.autoesc);
output += "\" ";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "settings")),"cleanup", env.autoesc) == t_21) {
output += "selected=\"selected\"";
}
output += ">";
if(t_21) {
output += runtime.suppressValue(t_21, env.autoesc);
output += " записей";
}
else {
output += "не удалять";
}
output += "</option>\n            ";
}
}frame = frame.pop();
output += "\n        </select>\n    </div>\n\n    <div class=\"header\">Системные настройки (оставь как есть)</div>\n\n    <div class=\"row\">\n        <span>Интервал обработчика:</span> <select name=\"interval\">\n            ";
frame = frame.push();
var t_23 = runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "options")),"interval", env.autoesc);
if(t_23 !== undefined) {for(var t_22=0; t_22 < t_23.length; t_22++) {
var t_24 = t_23[t_22];
frame.set("val", t_24);
output += "\n                <option value=\"";
output += runtime.suppressValue(t_24, env.autoesc);
output += "\" ";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "settings")),"interval", env.autoesc) == t_24) {
output += "selected=\"selected\"";
}
output += ">";
output += runtime.suppressValue(t_24, env.autoesc);
output += " сек.</option>\n            ";
}
}frame = frame.pop();
output += "\n        </select>\n    </div>\n\n    <div class=\"row\">\n        <input type=\"checkbox\" name=\"debug\" ";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "settings")),"debug", env.autoesc)) {
output += "checked=\"checked\"";
}
output += " id=\"id_debug\" /> <label for=\"id_debug\">Режим отладки</label>\n    </div>\n\n    <div class=\"header\">Сброс на значения по умолчанию</div>\n\n    <div class=\"row\" style=\"text-align: center;\">\n        <button class=\"danger\">Сбросить все настройки</button>\n    </div>\n</form>";
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
output += "\n    <li class=\"empty\">У вас пока нет подписок, но их можно <a href=\"#\" class=\"answer local\">импортировать</a> из&nbsp;предыдущей версии.</li>\n    ";
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
output += "\n                <!-- TODO: unactive only <a href=\"#\" class=\"remove\" data-rel=\"subscription:";
output += runtime.suppressValue(runtime.memberLookup((t_3),"type", env.autoesc), env.autoesc);
output += "\"></a> -->\n                ";
}
output += "\n            </li>\n        ";
}
output += "\n\n        <li>\n            <a href=\"";
output += runtime.suppressValue(runtime.memberLookup((t_3),"url", env.autoesc), env.autoesc);
output += "\" class=\"open\">";
output += runtime.suppressValue(runtime.memberLookup((t_3),"title", env.autoesc), env.autoesc);
output += "</a>\n            <a href=\"#\" data-rel=\"";
output += runtime.suppressValue(runtime.memberLookup((t_3),"uid", env.autoesc), env.autoesc);
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
output += "\n\n    ";
if(env.getFilter("length")(runtime.contextOrFrameLookup(context, frame, "object_list")) > 0) {
output += "\n    <li class=\"subaction\"><a href=\"#\" class=\"answer local\">Импортировать подписки</a></li>\n    ";
}
output += "\n\n    <li class=\"hidden-form\">\n        <form action=\"#import-subscriptions\" method=\"post\">\n            <div class=\"row\">\n                <textarea name=\"import_data\" placeholder=\"Скопируйте текст экспорта из  дополнения прошлой версии\" cols=\"30\" rows=\"10\"></textarea>\n            </div>\n\n            <button type=\"submit\">Импортировать</button>\n        </form>\n    </li>\n</ul>";
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
