var Test = {
    Events: [
        {
            "id": 1,
            "day": new Date(),
            "type": "message",
            "count": 1
        }, 
        {
            "id": 2,
            "day": new Date(),
            "type": "message",
            "count": 3
        }, 
        {
            "id": 2,
            "day": new Date(),
            "type": "journal",
            "count": 3
        }, 
        {
            "id": 3,
            "day": new Date(),
            "type": "message",
            "count": 56
        }, 
        {
            "id": 4,
            "day": new Date(),
            "type": "new",
            "count": 1
        }, 
        {
            "id": 5,
            "day": new Date().setDate(17),
            "type": "journal",
            "count": 5
        }, 
        {
            "id": 6,
            "day": new Date().setDate(17),
            "type": "game",
            "count": 2
        }, 
        {
            "id": 6,
            "day": new Date().setDate(16),
            "type": "comment",
            "count": 1,
            "target": {
                "id": 1,
                "type": "diary",
                "title": "Поговорим"
            }
        }, 
        {
            "id": 6,
            "day": new Date().setDate(12),
            "type": "comment",
            "count": 1,
            "target": {
                "id": 2,
                "type": "new",
                "title": "Не за что!!!"
            }
        }
    ],

    Messages: [
        {
            "id": 1,
            "date": new Date(),
            "from": {
                "id": 6179,
                "name": "SkAZi"
            },
            "title": "Тест тест",
            "body": "Тест тест тест"
        },
        {
            "id": 2,
            "date": new Date(),
            "from": {
                "id": 6179,
                "name": "SkAZi"
            },
            "title": "Тест тест",
            "body": "Тест тест тест"
        },
        {
            "id": 1,
            "date": new Date().setDate(16),
            "from": {
                "id": 6179,
                "name": "SkAZi"
            },
            "title": "Тест тест",
            "body": "Тест тест тест"
        }
    ],

    Comments: [
        {
            "id": 1,
            "day": new Date(),
            "target": {
                "id": 1,
                "type": "journal",
                "title": "Как закалялась сталь"
            },
            "from": {
                "id": 6179,
                "name": "SkAZi"
            },
            "title": "Ну и как же она закалялась?",
            "body": "Не читал, но осуждаю!!!"
        },
        {
            "id": 2,
            "day": new Date().setDate(17),
            "target": {
                "id": 2,
                "type": "thought",
                "title": "Тыщ-пыщь-сорок-тыщ"
            },
            "from": {
                "id": 6179,
                "name": "SkAZi"
            },
            "title": "",
            "body": "And nothing else matterssss!!! And nothing else matterssss!!! And nothing else matterssss!!! And nothing else matterssss!!! And nothing else matterssss!!! And nothing else matterssss!!!"
        },
    ],

    Subscriptions: [
        {
            "id": 1,
            "url": 'http://tesera.ru/',
            "active": true,
            "title": 'Как закалялась сталь.',
            "type": 'journal',
            "last_update": new Date(),
            "planned_update": new Date(),
            "last_modified": new Date(),
            "update_counter": 1
        },
        {
            "id": 2,
            "url": 'http://tesera.ru/',
            "active": true,
            "title": 'Как закалялась сталь.',
            "type": 'journal',
            "last_update": new Date(),
            "planned_update": new Date(),
            "last_modified": new Date(),
            "update_counter": 1
        },
        {
            "id": 3,
            "url": 'http://tesera.ru/',
            "active": true,
            "title": 'Как закалялась сталь.',
            "type": 'new',
            "last_update": new Date(),
            "planned_update": new Date(),
            "last_modified": new Date(),
            "update_counter": 1
        },
        {
            "id": 4,
            "url": 'http://tesera.ru/',
            "active": false,
            "title": 'Как закалялась сталь.',
            "type": 'thought',
            "last_update": new Date(),
            "planned_update": new Date(),
            "last_modified": new Date(),
            "update_counter": 1
        },
    ]
}