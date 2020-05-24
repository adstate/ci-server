# service worker task

версия nodejs v10.14.1

**nodejs сервер лежит в папке webserver/**
**клиент лежит в папке client/**

Команды для сервера(webserver):
    "start": "ts-node ./src/server.ts",
    "dev": "nodemon ./src/server.ts -r ts-node/register"

Команды для клиента:
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test-sw: "jest ./__tests__/sw.test.js"

**Запуск клиента**
Так как ворвер доступен только в prodaction окружении, нужно сделать npm run build и, например, npx serve -s build

**Запуск сервера**
Для запуска сервера(webserver) нужно указать в .env файле переменную JWT_TOKEN


**Расположение сервис воркера**
client/public/service-worker-custom.js

Для региcтрации сервис ворекера используется скрипт ./src/serviceWorker.ts

**Стратегия кеширования**
Выбрана стратегия Cache and Update. Так она позволяет поддерживать актуальное состояние статики при наличии сетевого соединения.
Сейчас сложно сказать, как часто нужно было бы обновлять статику, если бы приложения работало в продакшене. Но, думаю, что нередки ситуации, когда изменения нужно накатить и применить сразу же, не дожидаясь таймаута кэша.