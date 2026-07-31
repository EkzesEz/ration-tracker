// MCP-сервер (Streamable HTTP) для трекера рациона.
// Подключается в claude.ai как кастомный коннектор по URL:
//   https://<сайт>/mcp?t=<твой_токен_из_api_tokens>
// Токен определяет, в чей дневник писать. Пароль и service_role здесь не нужны:
// все операции идут через SECURITY DEFINER функции в Postgres, которые сами
// проверяют токен (см. schema.sql).

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";
const PROTOCOL_VERSIONS = ["2025-06-18", "2025-03-26", "2024-11-05"];

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST, GET, OPTIONS",
  "access-control-allow-headers": "content-type, authorization, mcp-protocol-version, mcp-session-id",
  "access-control-expose-headers": "mcp-session-id"
};

/* ── вызов RPC в Supabase ── */
async function rpc(fn, args) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) throw new Error("Сервер не настроен: нет SUPABASE_URL / SUPABASE_ANON_KEY");
  const r = await fetch(SUPABASE_URL.replace(/\/$/, "") + "/rest/v1/rpc/" + fn, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      authorization: "Bearer " + SUPABASE_ANON_KEY
    },
    body: JSON.stringify(args)
  });
  const text = await r.text();
  let body; try { body = JSON.parse(text); } catch (_) { body = text; }
  if (!r.ok) {
    const msg = (body && (body.message || body.hint || body.error)) || text || ("HTTP " + r.status);
    throw new Error(String(msg).includes("bad token") ? "Неверный токен: проверь ?t=… в адресе коннектора" : msg);
  }
  return body;
}

/* ── описание инструментов ── */
const NUM = { type: "number" };
const TOOLS = [
  {
    name: "log_food",
    description:
      "Записать съеденное в дневник питания: продукт добавляется в приём пищи за указанный день. " +
      "Если приёма с таким названием в этом дне ещё нет — он создаётся. Если продукт в приёме уже есть — увеличивается количество. " +
      "По умолчанию день — сегодняшний, приём — «Другое». Калории и БЖУ указываются на ОДНУ порцию, множитель задаётся через qty.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Название продукта, например «Двойной чизбургер» или «Рис отварной · 100 г»" },
        kcal: { ...NUM, description: "Калории на одну порцию" },
        protein: { ...NUM, description: "Белки, г (на порцию)" },
        fat: { ...NUM, description: "Жиры, г (на порцию)" },
        carbs: { ...NUM, description: "Углеводы, г (на порцию)" },
        qty: { ...NUM, description: "Сколько порций, по умолчанию 1. Для 150 г при порции 100 г — 1.5" },
        meal: { type: "string", description: "Приём пищи: Завтрак, Шейк, Обед, Перекус, Ужин, Другое" },
        date: { type: "string", description: "Дата YYYY-MM-DD. По умолчанию — сегодня (Москва)" }
      },
      required: ["name", "kcal"]
    }
  },
  {
    name: "add_product",
    description:
      "Добавить продукт в общую базу продуктов приложения (его увидят все пользователи, автор — владелец токена). " +
      "Это НЕ запись съеденного: чтобы отметить съеденное, используй log_food.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Название с указанием порции, например «Онигири Филадельфия · 100 г»" },
        kcal: { ...NUM, description: "Калории на порцию" },
        protein: NUM, fat: NUM, carbs: NUM
      },
      required: ["name", "kcal"]
    }
  },
  {
    name: "get_day",
    description:
      "Посмотреть дневник за день: сколько съедено (калории и БЖУ), какая дневная норма и какие приёмы пищи записаны. " +
      "Полезно, чтобы посчитать остаток до нормы. По умолчанию — сегодня.",
    inputSchema: {
      type: "object",
      properties: { date: { type: "string", description: "Дата YYYY-MM-DD, по умолчанию сегодня (Москва)" } }
    }
  }
];

/* ── выполнение инструмента ── */
function num(v, d) { const n = Number(v); return Number.isFinite(n) ? n : d; }

async function callTool(token, name, args) {
  args = args || {};
  if (name === "log_food") {
    const r = await rpc("api_log_food", {
      p_token: token, p_name: String(args.name), p_kcal: num(args.kcal, 0),
      p_p: num(args.protein, 0), p_f: num(args.fat, 0), p_c: num(args.carbs, 0),
      p_qty: num(args.qty, 1), p_meal: args.meal ? String(args.meal) : "Другое",
      p_date: args.date ? String(args.date) : null
    });
    const total = num(args.kcal, 0) * num(args.qty, 1);
    return `Записано: «${args.name}» ×${num(args.qty, 1)} (${Math.round(total)} ккал) → приём «${r.meal}», день ${r.date}.`;
  }
  if (name === "add_product") {
    const r = await rpc("api_add_product", {
      p_token: token, p_name: String(args.name), p_kcal: num(args.kcal, 0),
      p_p: num(args.protein, 0), p_f: num(args.fat, 0), p_c: num(args.carbs, 0)
    });
    return `Продукт «${args.name}» добавлен в общую базу (автор: ${r.author}).`;
  }
  if (name === "get_day") {
    const r = await rpc("api_get_day", { p_token: token, p_date: args.date ? String(args.date) : null });
    const t = r.totals || {};
    const norm = r.norm;
    const meals = (r.meals || []).map(m => {
      const items = (m.items || []).map(i => `    • ${i.name} ×${i.qty} — ${Math.round(i.kcal * i.qty)} ккал`).join("\n");
      return `  ${m.name}:\n${items || "    (пусто)"}`;
    }).join("\n");
    const left = norm && norm.kcal ? `\nОсталось до нормы: ${Math.round(norm.kcal - t.kcal)} ккал (норма ${norm.kcal}).` : "";
    return `День ${r.date}\nСъедено: ${Math.round(t.kcal)} ккал · Б ${Math.round(t.p)} · Ж ${Math.round(t.f)} · У ${Math.round(t.c)}.${left}\n${meals || "Записей нет."}`;
  }
  throw new Error("Неизвестный инструмент: " + name);
}

/* ── JSON-RPC ── */
function ok(id, result) { return { jsonrpc: "2.0", id, result }; }
function err(id, code, message) { return { jsonrpc: "2.0", id, error: { code, message } }; }

async function handleMessage(msg, token) {
  const { id, method, params } = msg || {};
  if (method === "initialize") {
    const want = params && params.protocolVersion;
    return ok(id, {
      protocolVersion: PROTOCOL_VERSIONS.includes(want) ? want : PROTOCOL_VERSIONS[0],
      capabilities: { tools: { listChanged: false } },
      serverInfo: { name: "ration-tracker", version: "1.0.0" }
    });
  }
  if (method === "ping") return ok(id, {});
  if (method === "tools/list") return ok(id, { tools: TOOLS });
  if (method === "tools/call") {
    if (!token) return ok(id, { content: [{ type: "text", text: "Не указан токен. Адрес коннектора должен быть вида https://…/mcp?t=ТОКЕН" }], isError: true });
    try {
      const text = await callTool(token, params && params.name, params && params.arguments);
      return ok(id, { content: [{ type: "text", text }], isError: false });
    } catch (e) {
      return ok(id, { content: [{ type: "text", text: "Ошибка: " + e.message }], isError: true });
    }
  }
  if (typeof method === "string" && method.startsWith("notifications/")) return null; // уведомления без ответа
  return err(id === undefined ? null : id, -32601, "Method not found: " + method);
}

/* ── HTTP-обёртка (Streamable HTTP) ──
   Клиент (в т.ч. claude.ai) присылает Accept: application/json, text/event-stream.
   Если он готов принять поток — отвечаем SSE-кадрами, иначе обычным JSON. */
function sseBody(objs) {
  return objs.map(o => "event: message\ndata: " + JSON.stringify(o) + "\n\n").join("");
}
function newSessionId() {
  return "sess-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
}

exports.handler = async function (event) {
  const method = event.httpMethod;
  if (method === "OPTIONS") return { statusCode: 204, headers: CORS, body: "" };
  if (method === "DELETE") return { statusCode: 204, headers: CORS, body: "" }; // завершение сессии

  const headers = event.headers || {};
  const hdr = n => headers[n] || headers[n.toLowerCase()] || headers[n.toUpperCase()] || "";
  const accept = String(hdr("accept")).toLowerCase();
  const wantsSSE = accept.includes("text/event-stream");

  // Токен ищем в трёх местах. Основной способ — В ПУТИ (/mcp/ТОКЕН): claude.ai
  // обрезает query-строку у адреса коннектора, поэтому ?t= там не доезжает.
  const qs = event.queryStringParameters || {};
  const auth = String(hdr("authorization"));
  const rawPath = String(event.path || event.rawUrl || "");
  const pm = rawPath.match(/\/mcp\/([^/?#]+)/) || rawPath.match(/functions\/mcp\/([^/?#]+)/);
  const pathToken = pm ? decodeURIComponent(pm[1]) : "";
  const token = pathToken || qs.t || qs.token || (auth.toLowerCase().startsWith("bearer ") ? auth.slice(7).trim() : "");

  // Диагностика в логах Netlify (Functions → mcp → Logs). Сам токен не пишем —
  // только откуда он взялся и по какому пути пришёл запрос.
  console.log("[mcp] " + method + " path=" + rawPath +
    " qs=" + Object.keys(qs).join(",") +
    " tokenSource=" + (pathToken ? "path" : (qs.t || qs.token ? "query" : (token ? "header" : "NONE"))));

  if (method === "GET") {
    // По спеке: если сервер не открывает отдельный SSE-поток по GET — 405.
    if (wantsSSE) {
      return { statusCode: 405, headers: { ...CORS, "content-type": "application/json" }, body: JSON.stringify(err(null, -32000, "SSE stream via GET is not supported; use POST")) };
    }
    return {
      statusCode: 200,
      headers: { ...CORS, "content-type": "application/json" },
      body: JSON.stringify({ name: "ration-tracker MCP", transport: "streamable-http", tools: TOOLS.map(t => t.name), tokenProvided: !!token, tokenSource: pathToken ? "path" : (qs.t || qs.token ? "query" : (token ? "header" : "none")) })
    };
  }
  if (method !== "POST") return { statusCode: 405, headers: CORS, body: "Method Not Allowed" };

  let payload;
  try { payload = JSON.parse(event.body || "{}"); }
  catch (_) {
    return { statusCode: 400, headers: { ...CORS, "content-type": "application/json" }, body: JSON.stringify(err(null, -32700, "Parse error")) };
  }

  const batch = Array.isArray(payload);
  const messages = batch ? payload : [payload];
  const isInit = messages.some(m => m && m.method === "initialize");

  const out = [];
  for (const m of messages) {
    const res = await handleMessage(m, token);
    if (res) out.push(res);
  }

  const sessionHeader = {};
  const existing = hdr("mcp-session-id");
  sessionHeader["mcp-session-id"] = existing || (isInit ? newSessionId() : "");
  if (!sessionHeader["mcp-session-id"]) delete sessionHeader["mcp-session-id"];

  // Только уведомления — тела нет.
  if (out.length === 0) return { statusCode: 202, headers: { ...CORS, ...sessionHeader }, body: "" };

  if (wantsSSE) {
    return {
      statusCode: 200,
      headers: { ...CORS, ...sessionHeader, "content-type": "text/event-stream", "cache-control": "no-cache", connection: "keep-alive" },
      body: sseBody(batch ? [out] : out)
    };
  }
  return {
    statusCode: 200,
    headers: { ...CORS, ...sessionHeader, "content-type": "application/json" },
    body: JSON.stringify(batch ? out : out[0])
  };
};
