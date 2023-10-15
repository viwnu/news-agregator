# news-agregator
Приложение - настраиваемый агрегатор новостей (или другой информации) с использованием библиотеки Cheerio.

Попробовать можно тут: https://news-agregator-o35psih36-viwnus-projects.vercel.app/

В данный момент реализовано:
- Клиентская и серверная части инфраструктуры для дальнейшего масштабирования
- Возможность добавления, удаления, изменения шаблонов запросов к новостным сайтам
- Менеджер стейта и связь с сервером с помощью RTK Query
- MUI
- Роутинг с помощью react-router-dom
- Валидация полей формы см. файл useAgregationForm.ts
- Деплой на платформе Vercel с ответами на запросы и с KV-базой данных
- Есть еще мой вариант хранения данных на основе библиотеки fs, см. папки news-agregator/backend/src/fileIO/ и news-agregator/backend/src/agregations/

Что еще планируется:
- добавить запросы и хранение стейта заголовков новостей и ссылок к ним с помощью RTK
- настройка UI темы + светлая/темная темы
- состояния UI компоненитов disabled и пр. в зависимости от валидации и др.
- Авторизация и хранение данных для разных клиентов
