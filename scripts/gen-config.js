// Генерирует config.js при сборке на Netlify из переменных окружения.
// USDA-ключ сюда НЕ пишем — он остаётся на сервере (netlify/functions/usda.js).
const fs = require("fs");
const path = require("path");

const cfg = {
  SUPABASE_URL: process.env.SUPABASE_URL || "",
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || ""
};

const out = "window.RATION_CONFIG = " + JSON.stringify(cfg, null, 2) + ";\n";
fs.writeFileSync(path.join(__dirname, "..", "config.js"), out);

console.log("config.js сгенерирован из env (SUPABASE_URL " + (cfg.SUPABASE_URL ? "ok" : "ПУСТО") +
  ", SUPABASE_ANON_KEY " + (cfg.SUPABASE_ANON_KEY ? "ok" : "ПУСТО") + ")");
