## Настройка

Создать конфиг `src/config.ts` (на основе `src/config.ts.dist`). Обязательно надо заполнить key.

## Запуск

```
npm install
npm run build
node dist/bundle.js
```

## Запрос и ответ

POST: http://localhost:3000/

Пример запроса:

```json
{
	"destination": "futuro juicio ejecutivo",
	"matricula": "4-4339/28"
}
```

Формат ответа:

```json
{
	"entrada": "string",
	"docUrl": "string"
}
```