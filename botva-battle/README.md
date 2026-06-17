# ⚡ Ботва-Баттл

**Cohere vs Groq** — два ИИ спорят в реальном времени, **Mixtral 8x7B (Groq)** выносит вердикт.

## Структура проекта

```
botva-battle/
├── api/
│   └── chat.js          ← Serverless API-прокси (ключи на сервере)
├── public/
│   └── index.html       ← Весь фронтенд
├── vercel.json
└── package.json
```

## Деплой на Vercel

### 1. Залить на GitHub
```bash
git init
git add .
git commit -m "botva-battle init"
git remote add origin https://github.com/YOUR_NAME/botva-battle.git
git push -u origin main
```

### 2. Импортировать в Vercel
- Зайди на vercel.com → New Project
- Выбери репозиторий botva-battle
- Framework Preset: Other

### 3. Добавить переменные окружения
В Settings → Environment Variables:

| Имя               | Значение         |
|-------------------|------------------|
| `COHERE_API_KEY`  | Ключ Cohere      |
| `GROQ_API_KEY`    | Ключ Groq        |

## Получение ключей (всё бесплатно!)

- **Cohere**: https://dashboard.cohere.com — Register → API Keys (бесплатный trial)
- **Groq**: https://console.groq.com — Register → API Keys (бесплатно, быстрый inference)

Один ключ Groq используется и для спорщика (Llama 3.3 70B) и для арбитра (Mixtral 8x7B).
