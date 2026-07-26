// Шаблон конфигурации. Для ЛОКАЛЬНОЙ разработки:
//   1) скопируй этот файл в config.js  (config.js в .gitignore — в репозиторий не попадёт)
//   2) впиши свои ключи Supabase.
//
// В ПРОДЕ этот config.js не используется — он генерируется при сборке скриптом
// scripts/gen-config.js из переменных окружения Netlify (SUPABASE_URL,
// SUPABASE_ANON_KEY). USDA-ключа в клиенте нет: поиск идёт через серверную
// функцию netlify/functions/usda.js, где ключ берётся из env USDA_API_KEY.
//
// USDA_API_KEY ниже нужен ТОЛЬКО для локального прямого поиска (без netlify dev).
// В проде оставь его пустым.
window.RATION_CONFIG = {
  SUPABASE_URL: "",
  SUPABASE_ANON_KEY: "",
  USDA_API_KEY: ""
};
