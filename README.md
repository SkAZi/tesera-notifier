Установка окружения
-------------------

Для начала работы потребуются такие инструменты:

1. git
2. git-flow (необязательно, но желательно)
3. python
4. kango (http://kangoextensions.com)
5. node.js (http://nodejs.org)
6. nunjucks (http://nunjucks.jlongster.com)

Последние два пункта нужны только в случае внесения изменений в шаблоны попапов.

Порядок развёртывания.

1) Устанавливаем в систему git и python.

2) Скачиваем kango (http://kangoextensions.com/kango/kango-framework-latest.zip),
распаковываем его куда-то в систему, таким образом, чтобы иметь доступ к kango.py
как к исполняемому скрипту.

Для POSIX, к примеру:

Распаковываем в ~/.bin/kango_lib/
В ~/.bashrc дописываем PATH=~/.bin/kango_lib/:$PATH
Делаем 

> chmod +x kango.py

3) Устанавливаем node.js.
4) Устанавливаем nunjucks:

> npm install -g nunjucks

5) Стягиваем репозиторий

> git clone git@bitbucket.org:SkAZi/tesera.git

6) Переключаемся в develop

> git checkout develop


Можно начинать работать.



Компиляция проекта
------------------

Если вносились изменения в шаблоны попапа (templates/*)

> nunjucks-precompile src/common/templates > src/common/js/templates.js

Из папки с проектом:

> kango.py build .



Структура репозитория
---------------------

Полностью по схеме flow (http://habrahabr.ru/post/147260/).

Если коротко — в develop вся разработка, в master – релизы, любая новая 
функциональность в отдельной ветке начинающейся с feature/.