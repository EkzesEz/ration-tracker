// ── Настройка синхронизации ────────────────────────────────────────────────
// Пока эти два поля пустые — приложение работает ЛОКАЛЬНО (как раньше): данные
// в этом браузере, синка между устройствами нет. Чтобы включить облачный синк
// телефон↔ПК, заведи бесплатный проект на supabase.com (без карты) и вставь сюда
// два значения из  Project Settings → API :
//   • Project URL                          → SUPABASE_URL
//   • Publishable key (sb_publishable_...)  → SUPABASE_ANON_KEY
//
// ВАЖНО: сюда идёт именно PUBLISHABLE key (бывший «anon»). Он безопасен для
// браузера — доступ к чужим данным закрыт правилами из schema.sql.
// НИКОГДА не вставляй сюда Secret key (sb_secret_..., бывший service_role):
// он обходит всю защиту и в браузере станет дырой на всю базу. Он только для
// сервера, а у нас сервера нет.
window.RATION_CONFIG = {
  SUPABASE_URL: "https://nihtypajwitrhqscpvey.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_vE9VV5a7GuLV0QLjK58SuQ_SBSw3_az"   // ← Publishable key (sb_publishable_...)
};
