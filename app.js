"use strict";
(function () {

  /* ══════════ данные плана ══════════ */
  var PHASE = {
    1: { kcal: 2780, p: 157, f: 99,  c: 310, rate: "+1,2" },
    2: { kcal: 3080, p: 172, f: 115, c: 334, rate: "+2,0" }
  };
  var MEAL_NAMES = ["Завтрак", "Шейк", "Обед", "Перекус", "Ужин", "Другое"];

  var LIB = [
    { g: "Гейнер / спорт", items: [
      { name: "Mutant Mass · 2 скупа", kcal: 550, p: 28, f: 3, c: 102 },
      { name: "Bombbar гейнер · 100 г", kcal: 377, p: 20, f: 1.7, c: 70.5 },
      { name: "Протеин · 1 скуп", kcal: 120, p: 24, f: 2, c: 3 },
      { name: "Креатин · 5 г", kcal: 0, p: 0, f: 0, c: 0 }
    ] },
    { g: "Молочка / белок", items: [
      { name: "Молоко · 250 мл", kcal: 150, p: 8, f: 8, c: 12 },
      { name: "Творог 5% · 100 г", kcal: 121, p: 16, f: 5, c: 3 },
      { name: "Греческий йогурт · 100 г", kcal: 90, p: 9, f: 5, c: 4 },
      { name: "Сыр · 30 г", kcal: 120, p: 7.5, f: 10, c: 0.5 },
      { name: "Яйцо варёное · 1 шт", kcal: 70, p: 6, f: 5, c: 0.5 },
      { name: "Курица грудка · 100 г", kcal: 165, p: 31, f: 3.6, c: 0 }
    ] },
    { g: "Гарнир / углеводы", items: [
      { name: "Рис отварной · 100 г", kcal: 130, p: 2.4, f: 0.3, c: 29 },
      { name: "Гречка отварная · 100 г", kcal: 100, p: 3.4, f: 1.1, c: 20 },
      { name: "Макароны отварные · 100 г", kcal: 130, p: 4, f: 1, c: 25 },
      { name: "Овсянка · 50 г сухой", kcal: 175, p: 6, f: 3.5, c: 30 },
      { name: "Мюсли · 50 г", kcal: 190, p: 5, f: 4, c: 32 },
      { name: "Хлеб тёмный · 1 ломоть", kcal: 80, p: 2.5, f: 1, c: 15 }
    ] },
    { g: "Орехи / жиры", items: [
      { name: "Арахисовая паста · ложка 20 г", kcal: 120, p: 5, f: 10, c: 4 },
      { name: "Миндаль · 30 г", kcal: 180, p: 6.5, f: 16, c: 3.5 },
      { name: "Кешью · 30 г", kcal: 170, p: 5, f: 13, c: 9 },
      { name: "Масло сливочное · 10 г", kcal: 75, p: 0, f: 8, c: 0 },
      { name: "Соус · 30 г", kcal: 90, p: 1, f: 8, c: 3 }
    ] },
    { g: "Фрукты / сладкое", items: [
      { name: "Банан · 1 шт", kcal: 105, p: 1.3, f: 0.4, c: 27 },
      { name: "Мёд · 15 г", kcal: 46, p: 0, f: 0, c: 12 }
    ] },
    { g: "Бутерброды", items: [
      { name: "Бутер с маслом", kcal: 155, p: 2.5, f: 9, c: 15 },
      { name: "Бутер с маслом и сыром", kcal: 275, p: 10, f: 19, c: 15.5 }
    ] },
    { g: "Кофе / напитки", items: [
      { name: "Латте · 300 мл", kcal: 150, p: 8, f: 8, c: 12 },
      { name: "Капучино · 200 мл", kcal: 90, p: 5, f: 5, c: 7 },
      { name: "Бамбл · 300 мл", kcal: 130, p: 1, f: 0, c: 30 },
      { name: "Сироп · 20 мл (2 помпы)", kcal: 80, p: 0, f: 0, c: 20 }
    ] },
    { g: "Готовое · Пятёрочка", items: [
      { name: "Салат Цезарь с курицей · 160 г", kcal: 291, p: 14, f: 19, c: 15 },
      { name: "Онигири Филадельфия · 100 г", kcal: 254, p: 5, f: 6, c: 44 },
      { name: "Мясо по-французски с картофелем · 250 г", kcal: 548, p: 18, f: 38, c: 35 }
    ] }
  ];

  var SEED = [
    { name: "Завтрак", items: [
      { name: "Мюсли · 50 г", kcal: 190, p: 5, f: 4, c: 32, qty: 1 },
      { name: "Молоко · 250 мл", kcal: 150, p: 8, f: 8, c: 12, qty: 1 },
      { name: "Бутер с маслом и сыром", kcal: 275, p: 10, f: 19, c: 15.5, qty: 2 },
      { name: "Яйцо варёное · 1 шт", kcal: 70, p: 6, f: 5, c: 0.5, qty: 1 }
    ] },
    { name: "Обед", items: [
      { name: "Рис отварной · 100 г", kcal: 130, p: 2.4, f: 0.3, c: 29, qty: 1.8 },
      { name: "Курица грудка · 100 г", kcal: 165, p: 31, f: 3.6, c: 0, qty: 1.5 },
      { name: "Банан · 1 шт", kcal: 105, p: 1.3, f: 0.4, c: 27, qty: 2 }
    ] }
  ];

  // Примеры еды для вкладки «План»
  var PLAN_MEALS = [
    { name: "Завтрак", options: [
      { k: "А", what: "Овсянка 60 г на молоке 250 + банан + 20 г арахисовой пасты", kcal: 610, p: 21, f: 22, c: 81, cook: 3 },
      { k: "Б", what: "Греческий йогурт 250 + гранола 80 + банан", kcal: 665, p: 34, f: 19, c: 99, cook: 0 },
      { k: "В", what: "Сырники ВкусВилл 200 + молоко 200 + мёд", kcal: 580, p: 30, f: 20, c: 68, cook: 4 },
      { k: "Г", what: "4 яйца + 2 тоста + 30 г сыра", kcal: 625, p: 41, f: 39, c: 32, cook: 6 }
    ] },
    { name: "Шейк", options: [
      { k: "А", what: "350 мл молока + банан + 50 г овсянки + 25 г пасты (блендер)", kcal: 660, p: 24, f: 27, c: 81, cook: 2 },
      { k: "Б", what: "500 мл молока + 2 скупа Mutant Mass + креатин", kcal: 850, p: 44, f: 19, c: 126, cook: 0 },
      { k: "В", what: "Питьевой йогурт 500 + 50 г арахиса", kcal: 630, p: 28, f: 33, c: 55, cook: 0 }
    ] },
    { name: "Обед", options: [
      { k: "А", what: "Рис 300 + курица 120 + соус + овощи (заготовка)", kcal: 740, p: 45, f: 20, c: 90, cook: 0 },
      { k: "Б", what: "Готовое блюдо ВкусВилл 400 + 100 г курицы", kcal: 780, p: 50, f: 25, c: 85, cook: 0 },
      { k: "В", what: "Доставка: дабл-чизбургер + средняя картошка фри", kcal: 780, p: 29, f: 40, c: 77, cook: 0 },
      { k: "Г", what: "Шаурма с курицей, большая", kcal: 700, p: 40, f: 30, c: 65, cook: 0 }
    ] },
    { name: "Перекус", options: [
      { k: "А", what: "Творог 5% 200 + мёд 15", kcal: 290, p: 34, f: 10, c: 16, cook: 0 },
      { k: "Б", what: "Миндаль 50 г", kcal: 300, p: 11, f: 26, c: 6, cook: 0 },
      { k: "В", what: "2 банана + 20 г арахисовой пасты", kcal: 330, p: 7, f: 11, c: 58, cook: 0 },
      { k: "Г", what: "Протеиновый батончик + банан", kcal: 300, p: 22, f: 9, c: 40, cook: 0 }
    ] },
    { name: "Ужин", options: [
      { k: "А", what: "Творог 200 + 25 г орехов + мёд + 2 яйца", kcal: 480, p: 33, f: 20, c: 42, cook: 0 },
      { k: "Б", what: "Готовое ВкусВилл: индейка/рыба с гарниром", kcal: 430, p: 32, f: 15, c: 40, cook: 0 },
      { k: "В", what: "Омлет из 3 яиц + 30 г сыра + тост", kcal: 440, p: 30, f: 30, c: 18, cook: 5 },
      { k: "Г", what: "Творожная запеканка ВкусВилл 200 + кефир 250", kcal: 460, p: 28, f: 14, c: 52, cook: 0 }
    ] }
  ];

  var RECIPES = [
    { title: "Рис рассыпчатый", yield: "500 г · на 3 дня",
      ing: "Рис 500 г, вода 750 мл (1:1,5), соль 1 ч. л., ложка масла.",
      steps: [
        "Промой под холодной водой 3–4 смены, пока не станет почти прозрачной — смывает крахмал.",
        "Залей водой строго 1:1,5, посоли, добавь ложку масла.",
        "Доведи до кипения на сильном огне, затем сразу минимальный огонь и крышку.",
        "12 минут не открывая крышку (пропаренный — 15, бурый — 30–35 и воды 1:2).",
        "Сними с огня, дай постоять под крышкой ещё 10 минут, взрыхли вилкой."
      ],
      tip: "Остуди быстро тонким слоем и сразу в холодильник — тёплый рис на столе разводит бактерии. Держит 3 дня, греть до горячего пара." },
    { title: "Курица на противне", yield: "1,2 кг · на 6 обедов",
      ing: "Филе 1,2 кг, масло, соль, паприка.",
      steps: [
        "Обсуши филе, обваляй в масле с солью и паприкой.",
        "Выложи на фольгу или коврик — не на сухой пергамент, приварится.",
        "Духовка 200 °C, 22–25 минут (не 30 — грудка пересыхает).",
        "Готовность: 73 °C внутри термощупом или прозрачный сок на разрезе.",
        "Разложи по контейнерам, два убери в морозилку."
      ],
      tip: "3 дня в холодильнике, дальше только из морозилки. Рис ставь вариться сразу, как курица ушла в духовку." },
    { title: "Яйца вкрутую", yield: "10 шт · на 3 дня",
      ing: "10 яиц, вода, щепотка соли.",
      steps: [
        "Доведи воду до кипения и только потом опускай яйца ложкой — так время предсказуемо и чистятся легче.",
        "Убавь до слабого кипения, чтобы не бились друг о друга.",
        "10 минут (желток плотный, но не сухой; 7 мин — кремовый, 12 — совсем плотный).",
        "Сразу переложи в холодную воду на 5 минут — остановит готовку и не будет серого ободка.",
        "Чисти под струёй воды с тупого конца (там воздушная камера)."
      ],
      tip: "Совсем свежие чистятся плохо — бери полежавшие неделю. В скорлупе хранятся до недели, очищенные — максимум 2 дня." }
  ];

  /* ══════════ helpers ══════════ */
  function el(tag, cls, txt) { var n = document.createElement(tag); if (cls) n.className = cls; if (txt != null) n.textContent = txt; return n; }
  function $(id) { return document.getElementById(id); }
  function rnd(x) { return Math.round(+x || 0); }
  function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }
  function fmtQty(q) { return (Math.round((+q || 0) * 100) / 100).toString(); }
  function pad2(n) { return (n < 10 ? "0" : "") + n; }
  function keyOf(d) { return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate()); }
  function todayStr() { return keyOf(new Date()); }
  function parseKey(k) { var p = k.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function cloneItem(o) { return { name: o.name, kcal: +o.kcal || 0, p: +o.p || 0, f: +o.f || 0, c: +o.c || 0, qty: +o.qty || 1 }; }
  function mkBtn(txt, fn, cls) { var b = document.createElement("button"); b.type = "button"; b.className = cls || "tk-qty-btn"; b.textContent = txt; b.addEventListener("click", fn); return b; }
  var DOW = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];
  var MONTHS = ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"];
  function dowMon(d) { return (d.getDay() + 6) % 7; }
  function labelDate(k) { var d = parseKey(k); return DOW[dowMon(d)] + ", " + pad2(d.getDate()) + "." + pad2(d.getMonth() + 1) + (k === todayStr() ? " · сегодня" : ""); }

  /* ══════════ state ══════════ */
  var LKEY = "ration-app-v1";
  var uid = 0;
  var current = 1;
  var view = "day";
  var selectedDate = todayStr();
  var calY, calM;
  var state = { days: {}, updatedAt: 0 };
  var meals = [];
  var activeId = null;
  var openState = {}, libOpen = {};

  var LS = (function () { try { var k = "__t"; localStorage.setItem(k, "1"); localStorage.removeItem(k); return localStorage; } catch (e) { return null; } })();

  function makeMeal(name, items) { return { id: ++uid, name: name || "Приём", items: (items || []).map(cloneItem) }; }
  function buildFrom(list) { return (list || []).map(function (m) { return makeMeal(m.name, m.items); }); }
  function saveLocal() { if (LS) { try { LS.setItem(LKEY, JSON.stringify(state)); } catch (e) {} } }
  function touch() { state.updatedAt = Date.now(); }
  function commitDay() { state.days[selectedDate] = meals.map(function (m) { return { name: m.name, items: m.items.map(cloneItem) }; }); }
  function persist() { commitDay(); touch(); saveLocal(); pushRemoteSoon(); }

  function hydrateDay(dateStr, seedIfEmpty) {
    if (!Array.isArray(state.days[dateStr])) {
      state.days[dateStr] = (seedIfEmpty && dateStr === todayStr() && Object.keys(state.days).length === 0)
        ? SEED.map(function (m) { return { name: m.name, items: m.items.map(cloneItem) }; }) : [];
    }
    meals = buildFrom(state.days[dateStr]);
    activeId = meals.length ? meals[meals.length - 1].id : null;
  }

  function loadLocal() {
    var raw = LS ? LS.getItem(LKEY) : null, parsed = null;
    if (raw !== null) { try { parsed = JSON.parse(raw); } catch (e) {} }
    state = (parsed && parsed.days) ? { days: parsed.days, updatedAt: parsed.updatedAt || 0 } : { days: {}, updatedAt: 0 };
    hydrateDay(selectedDate, true);
  }

  /* ══════════ Supabase sync ══════════ */
  var sb = null, session = null, pushTimer = null;
  var CFG = window.RATION_CONFIG || {};
  var HAS_CFG = !!(CFG.SUPABASE_URL && CFG.SUPABASE_ANON_KEY);

  function banner(text, kind) { var b = $("sync-banner"); if (!text) { b.hidden = true; return; } b.hidden = false; b.textContent = text; b.className = "sync-banner" + (kind ? " " + kind : ""); }

  function loadSupabaseLib() {
    return new Promise(function (resolve, reject) {
      if (window.supabase) return resolve(window.supabase);
      var s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js";
      s.onload = function () { resolve(window.supabase); };
      s.onerror = function () { reject(new Error("cdn")); };
      document.head.appendChild(s);
    });
  }
  function initSync() {
    if (!HAS_CFG) { banner("Синк не настроен — работаешь локально на этом устройстве. Впиши ключи Supabase в config.js (см. README).", "warn"); return; }
    banner("Подключаюсь к облаку…");
    loadSupabaseLib().then(function (lib) {
      sb = lib.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY);
      sb.auth.getSession().then(function (r) { session = r.data.session; onAuthChange(); });
      sb.auth.onAuthStateChange(function (_e, s) { session = s; onAuthChange(); });
    }).catch(function () { banner("Не удалось загрузить библиотеку синка (нет сети?). Работаешь локально — данные не потеряются.", "warn"); });
  }
  function onAuthChange() { renderAuth(); if (session) { banner("Вошёл как " + session.user.email + ". Синхронизирую…", "ok"); pullRemote(); } else banner("Не в аккаунте — данные только на этом устройстве. Войди, чтобы видеть их и на телефоне, и на ПК.", "warn"); }
  function pullRemote() {
    if (!sb || !session) return;
    sb.from("tracker_state").select("data, updated_at").eq("user_id", session.user.id).maybeSingle().then(function (r) {
      if (r.error) { banner("Синк: ошибка чтения (" + r.error.message + "). Локальная копия цела.", "warn"); return; }
      var remote = r.data ? r.data.data : null, remoteAt = remote && remote.updatedAt ? remote.updatedAt : 0;
      if (remote && remoteAt > (state.updatedAt || 0)) {
        state = { days: remote.days || {}, updatedAt: remoteAt };
        hydrateDay(selectedDate, false); saveLocal(); renderAll();
        banner("Синхронизировано ✓ (подтянул свежую версию из облака).", "ok");
      } else { pushRemote(true); }
    });
  }
  function pushRemoteSoon() { if (!sb || !session) return; clearTimeout(pushTimer); pushTimer = setTimeout(function () { pushRemote(false); }, 900); }
  function pushRemote(silent) {
    if (!sb || !session) return;
    sb.from("tracker_state").upsert({ user_id: session.user.id, data: state, updated_at: new Date().toISOString() }, { onConflict: "user_id" }).then(function (r) {
      if (r.error) banner("Синк: не удалось сохранить в облако (" + r.error.message + "). Локально всё на месте.", "warn");
      else if (!silent) banner("Сохранено в облако ✓", "ok");
    });
  }

  function renderAuth() {
    var host = $("auth"); host.innerHTML = "";
    if (!HAS_CFG) { host.appendChild(el("span", "who", "локальный режим")); return; }
    if (session) { host.appendChild(el("span", "who", session.user.email)); var out = el("button", "btn", "Выйти"); out.addEventListener("click", function () { sb.auth.signOut(); }); host.appendChild(out); }
    else { var login = el("button", "btn primary", "Войти / синк"); login.addEventListener("click", openAuthModal); host.appendChild(login); }
  }
  function openAuthModal() {
    var back = el("div", "modal-backdrop"), m = el("div", "modal");
    var close = el("button", "close", "×"); close.addEventListener("click", function () { back.remove(); }); m.appendChild(close);
    m.appendChild(el("h2", null, "Вход / регистрация"));
    m.appendChild(el("p", null, "Email + пароль. Первый раз — «Зарегистрироваться», потом «Войти». Один аккаунт связывает телефон и ПК."));
    var email = document.createElement("input"); email.type = "email"; email.placeholder = "email"; email.autocomplete = "email";
    var pass = document.createElement("input"); pass.type = "password"; pass.placeholder = "пароль (мин. 6)"; pass.autocomplete = "current-password";
    m.appendChild(email); m.appendChild(pass);
    var msg = el("div", "msg"), row = el("div", "row");
    var inBtn = el("button", "btn primary", "Войти"), upBtn = el("button", "btn", "Зарегистрироваться");
    inBtn.addEventListener("click", function () { msg.className = "msg"; msg.textContent = "Вхожу…"; sb.auth.signInWithPassword({ email: email.value.trim(), password: pass.value }).then(function (r) { if (r.error) { msg.className = "msg err"; msg.textContent = r.error.message; } else back.remove(); }); });
    upBtn.addEventListener("click", function () { msg.className = "msg"; msg.textContent = "Регистрирую…"; sb.auth.signUp({ email: email.value.trim(), password: pass.value }).then(function (r) { if (r.error) { msg.className = "msg err"; msg.textContent = r.error.message; } else if (r.data.session) back.remove(); else { msg.className = "msg ok"; msg.textContent = "Готово. Если включено подтверждение почты — проверь ящик, потом войди."; } }); });
    row.appendChild(inBtn); row.appendChild(upBtn); m.appendChild(row); m.appendChild(msg);
    back.appendChild(m); document.body.appendChild(back);
    back.addEventListener("click", function (e) { if (e.target === back) back.remove(); });
    email.focus();
  }

  /* ══════════ операции с днём ══════════ */
  function findMeal(id) { for (var i = 0; i < meals.length; i++) if (meals[i].id === id) return meals[i]; return null; }
  function addMeal(name) { var m = makeMeal(name, []); meals.push(m); activeId = m.id; persist(); renderTracker(); }
  function removeMeal(id) { meals = meals.filter(function (m) { return m.id !== id; }); if (activeId === id) activeId = meals.length ? meals[meals.length - 1].id : null; persist(); renderTracker(); }
  function setActive(id) { activeId = id; renderTracker(); }
  function addProduct(o) {
    var m = findMeal(activeId);
    if (!m) { m = makeMeal("Приём", []); meals.push(m); activeId = m.id; }
    var ex = null;
    for (var i = 0; i < m.items.length; i++) if (m.items[i].name === o.name) { ex = m.items[i]; break; }
    if (ex) ex.qty += 1; else m.items.push(cloneItem({ name: o.name, kcal: o.kcal, p: o.p, f: o.f, c: o.c, qty: 1 }));
    persist(); renderTracker();
  }
  function changeQty(id, idx, delta) { var m = findMeal(id); if (!m || !m.items[idx]) return; m.items[idx].qty = Math.round((m.items[idx].qty + delta) * 100) / 100; if (m.items[idx].qty <= 0) m.items.splice(idx, 1); persist(); renderTracker(); }
  function setQty(id, idx, val) { var m = findMeal(id); if (!m || !m.items[idx]) return; var q = parseFloat(String(val).replace(",", ".")); if (isNaN(q) || q <= 0) { renderTracker(); return; } m.items[idx].qty = q; persist(); renderTracker(); }
  function removeItem(id, idx) { var m = findMeal(id); if (!m) return; m.items.splice(idx, 1); persist(); renderTracker(); }
  function resetDay() { meals = []; activeId = null; persist(); renderTracker(); }
  function toggleItem(id, name) { openState[id + "|" + name] = !openState[id + "|" + name]; renderTracker(); }
  function toggleLib(name) { libOpen[name] = !libOpen[name]; renderLibrary(); }
  function mealKcal(m) { var s = 0; m.items.forEach(function (it) { s += it.kcal * it.qty; }); return s; }
  function dayMacros(dm) { var t = { kcal: 0, p: 0, f: 0, c: 0 }; (dm || []).forEach(function (m) { (m.items || []).forEach(function (it) { var q = +it.qty || 1; t.kcal += (+it.kcal || 0) * q; t.p += (+it.p || 0) * q; t.f += (+it.f || 0) * q; t.c += (+it.c || 0) * q; }); }); return t; }

  function setDate(dateStr) { selectedDate = dateStr; hydrateDay(selectedDate, false); renderDateNav(); renderTracker(); renderHistory(); }
  function shiftDate(delta) { var d = parseKey(selectedDate); d.setDate(d.getDate() + delta); setDate(keyOf(d)); }

  /* добавить готовый пример из плана в выбранный день */
  function addExample(mealName, opt) {
    var m = makeMeal(mealName, [{ name: mealName + " «" + opt.k + "»: " + opt.what, kcal: opt.kcal, p: opt.p, f: opt.f, c: opt.c, qty: 1 }]);
    meals.push(m); activeId = m.id; persist();
    showView("day"); renderTracker();
    banner("Добавлено «" + mealName + " " + opt.k + "» в день " + labelDate(selectedDate).replace(" · сегодня", "") + " ✓", "ok");
  }

  /* ══════════ render: день ══════════ */
  function renderKpi() {
    var d = PHASE[current], host = $("kpis"); host.innerHTML = "";
    [{ l: "Калории", v: fmt(d.kcal), s: "ккал/день" }, { l: "Белок", v: d.p, s: "г" }, { l: "Жиры", v: d.f, s: "г" }, { l: "Темп", v: d.rate, s: "кг/мес" }].forEach(function (c) {
      var k = el("div", "kpi"); k.appendChild(el("span", "k-label", c.l));
      var v = el("span", "k-val"); v.innerHTML = c.v + " <small>" + c.s + "</small>"; k.appendChild(v); host.appendChild(k);
    });
    $("tk-target").textContent = "/ " + fmt(d.kcal) + " ккал";
  }

  function renderDateNav() {
    $("date-label").textContent = labelDate(selectedDate);
    $("date-input").value = selectedDate;
    $("date-today").style.visibility = (selectedDate === todayStr()) ? "hidden" : "visible";
  }

  function renderTracker() {
    var d = PHASE[current], kc = 0, p = 0, f = 0, c = 0, itemCount = 0;
    meals.forEach(function (m) { m.items.forEach(function (it) { kc += it.kcal * it.qty; p += it.p * it.qty; f += it.f * it.qty; c += it.c * it.qty; itemCount++; }); });

    $("tk-eaten").textContent = fmt(rnd(kc));
    var over = kc > d.kcal, fill = $("tk-fill");
    fill.style.width = Math.min(100, d.kcal ? kc / d.kcal * 100 : 0) + "%"; fill.style.background = over ? "var(--s-f)" : "var(--accent)";
    var rem = $("tk-remain");
    if (over) { rem.textContent = "перебор " + fmt(rnd(kc - d.kcal)) + " ккал"; rem.style.color = "var(--s-f)"; }
    else { rem.textContent = "осталось " + fmt(rnd(d.kcal - kc)) + " ккал"; rem.style.color = "var(--ink-2)"; }

    var macs = [{ n: "Белок", v: p, t: d.p }, { n: "Жиры", v: f, t: d.f }, { n: "Углеводы", v: c, t: d.c }], mh = $("tk-macros"); mh.innerHTML = "";
    macs.forEach(function (mm) {
      var row = el("div", "tk-macro"); row.appendChild(el("span", "tk-macro-lbl", mm.n));
      var track = el("div", "tk-macro-track"), fl = el("div", "tk-macro-fill");
      fl.style.width = Math.min(100, mm.t ? mm.v / mm.t * 100 : 0) + "%"; fl.style.background = mm.v > mm.t * 1.05 ? "var(--s-f)" : "var(--s-c)";
      track.appendChild(fl); row.appendChild(track); row.appendChild(el("span", "tk-macro-val", rnd(mm.v) + " / " + mm.t + " г")); mh.appendChild(row);
    });

    var msg;
    if (itemCount === 0) msg = "Пусто — добавь приём, потом собери его из продуктов.";
    else if (p > d.p) msg = "Белок уже перебран на " + rnd(p - d.p) + " г — упор на углеводы, а не на ещё один творог.";
    else if (kc > d.kcal + 120) msg = "Перебор по калориям — на этот день можно остановиться.";
    else if (kc >= d.kcal - 120) msg = "Норма почти закрыта.";
    else msg = "До нормы " + fmt(rnd(d.kcal - kc)) + " ккал.";
    $("tk-hint").textContent = msg;

    var act = findMeal(activeId); $("tk-active").textContent = act ? "→ в приём «" + act.name + "»" : "→ создам новый приём";

    var host = $("tk-meals"); host.innerHTML = "";
    if (meals.length === 0) host.appendChild(el("div", "tk-empty", "Ни одного приёма — добавь ниже"));
    meals.forEach(function (m) {
      var card = el("div", "tk-meal" + (m.id === activeId ? " active" : ""));
      var head = el("div", "tk-meal-head");
      head.appendChild(mkBtn(m.name + (m.id === activeId ? " · активен" : ""), function () { setActive(m.id); }, "tk-meal-name"));
      head.appendChild(el("span", "tk-meal-kcal", fmt(rnd(mealKcal(m))) + " ккал"));
      head.appendChild(mkBtn("×", function () { removeMeal(m.id); }, "tk-remove"));
      card.appendChild(head);
      if (m.items.length === 0) card.appendChild(el("div", "tk-empty", "Пусто — выбери продукты ниже"));
      else {
        var list = el("div", "tk-items");
        m.items.forEach(function (it, idx) {
          var open = !!openState[m.id + "|" + it.name], wrap = el("div", "tk-item-wrap"), row = el("div", "tk-item");
          row.appendChild(mkBtn((open ? "▾ " : "▸ ") + it.name, function () { toggleItem(m.id, it.name); }, "tk-item-name"));
          var qwrap = el("div", "tk-qty");
          qwrap.appendChild(mkBtn("−", function () { changeQty(m.id, idx, -1); }));
          var qin = document.createElement("input"); qin.type = "text"; qin.inputMode = "decimal"; qin.className = "tk-qty-in"; qin.value = fmtQty(it.qty);
          qin.setAttribute("aria-label", "Количество: " + it.name); qin.addEventListener("change", function () { setQty(m.id, idx, qin.value); });
          qwrap.appendChild(qin); qwrap.appendChild(mkBtn("+", function () { changeQty(m.id, idx, 1); }));
          row.appendChild(qwrap);
          row.appendChild(el("div", "tk-item-kcal", fmt(rnd(it.kcal * it.qty)) + " ккал"));
          row.appendChild(mkBtn("×", function () { removeItem(m.id, idx); }, "tk-remove"));
          wrap.appendChild(row);
          if (open) wrap.appendChild(el("div", "tk-item-detail", "Б " + rnd(it.p * it.qty) + " · Ж " + rnd(it.f * it.qty) + " · У " + rnd(it.c * it.qty) + " г   ·   " + fmt(rnd(it.kcal)) + " ккал × " + fmtQty(it.qty)));
          list.appendChild(wrap);
        });
        card.appendChild(list);
      }
      host.appendChild(card);
    });
  }

  function renderLibrary() {
    var q = $("tk-quick"); q.innerHTML = "";
    LIB.forEach(function (grp) {
      var wrap = el("div", "tk-group"); wrap.appendChild(el("div", "tk-group-lbl", grp.g));
      var chips = el("div", "tk-group-chips");
      grp.items.forEach(function (o) {
        var open = !!libOpen[o.name], item = el("div", "tk-libitem");
        item.appendChild(mkBtn((open ? "▾ " : "▸ ") + o.name + " · " + o.kcal, function () { toggleLib(o.name); }, "tk-libname"));
        var add = mkBtn("+", function () { addProduct(o); }, "tk-libadd"); add.setAttribute("aria-label", "Добавить: " + o.name); item.appendChild(add);
        chips.appendChild(item);
        if (open) chips.appendChild(el("div", "tk-libdetail", "Б " + o.p + " · Ж " + o.f + " · У " + o.c + " г на порцию"));
      });
      wrap.appendChild(chips); q.appendChild(wrap);
    });
  }

  function renderHistory() {
    var d = PHASE[current];
    var dates = Object.keys(state.days).filter(function (k) { return k !== selectedDate && Array.isArray(state.days[k]) && state.days[k].length; }).sort();
    var host = $("history-list"), avgEl = $("history-avg"); host.innerHTML = "";
    if (dates.length === 0) { host.appendChild(el("div", "tk-empty", "Другие дни появятся здесь по мере заполнения.")); avgEl.textContent = ""; return; }
    var show = dates.slice(-10).reverse(), max = d.kcal * 1.25;
    show.forEach(function (k) {
      var kc = dayMacros(state.days[k]).kcal, row = el("div", "hist-row");
      var db = mkBtn(labelDate(k).replace(/, /, " "), function () { setDate(k); }, "hist-date-btn"); row.appendChild(db);
      var track = el("div", "hist-track"), fl = el("div", "hist-fill");
      fl.style.width = Math.min(100, max ? kc / max * 100 : 0) + "%"; fl.style.background = kc >= d.kcal ? "var(--s-c)" : "var(--accent)"; track.appendChild(fl);
      var mark = el("div", "hist-mark"); mark.style.left = Math.min(100, d.kcal / max * 100) + "%"; track.appendChild(mark);
      row.appendChild(track); row.appendChild(el("span", "hist-kcal", fmt(rnd(kc)))); host.appendChild(row);
    });
    var last7 = dates.slice(-7).map(function (k) { return dayMacros(state.days[k]).kcal; });
    var avg = last7.reduce(function (a, b) { return a + b; }, 0) / last7.length, diff = avg - d.kcal;
    avgEl.textContent = "Среднее за " + last7.length + " дн.: " + fmt(rnd(avg)) + " ккал — " + (Math.abs(diff) < 80 ? "в цель" : (diff > 0 ? "+" + fmt(rnd(diff)) + " над целью" : fmt(rnd(diff)) + " под целью")) + ". Тапни день, чтобы открыть.";
  }

  /* ══════════ render: календарь ══════════ */
  function renderCalendar() {
    var d = PHASE[current];
    $("cal-title").textContent = MONTHS[calM] + " " + calY;
    var dow = $("cal-dow"); dow.innerHTML = ""; DOW.forEach(function (w) { dow.appendChild(el("span", "cal-dow-c", w)); });

    var first = new Date(calY, calM, 1), start = dowMon(first), days = new Date(calY, calM + 1, 0).getDate();
    var grid = $("cal-grid"); grid.innerHTML = "";
    for (var i = 0; i < start; i++) grid.appendChild(el("div", "cal-cell empty"));
    for (var dd = 1; dd <= days; dd++) {
      var k = calY + "-" + pad2(calM + 1) + "-" + pad2(dd);
      var kc = (Array.isArray(state.days[k])) ? dayMacros(state.days[k]).kcal : 0;
      var cls = "cal-cell";
      if (k === todayStr()) cls += " today";
      if (k === selectedDate) cls += " sel";
      var cell = el("button", cls); cell.type = "button";
      cell.appendChild(el("span", "cal-num", String(dd)));
      if (kc > 0) {
        var kcEl = el("span", "cal-kc", fmt(rnd(kc))); kcEl.style.color = kc >= d.kcal ? "var(--s-c)" : "var(--accent)"; cell.appendChild(kcEl);
        var bar = el("span", "cal-bar"); var fl = el("span"); fl.style.width = Math.min(100, kc / (d.kcal * 1.2) * 100) + "%"; fl.style.background = kc >= d.kcal ? "var(--s-c)" : "var(--accent)"; bar.appendChild(fl); cell.appendChild(bar);
      }
      (function (key) { cell.addEventListener("click", function () { setDate(key); showView("day"); }); })(k);
      grid.appendChild(cell);
    }

    // недели месяца
    var wk = $("wk-list"); wk.innerHTML = "";
    var weeks = [], cur = [];
    for (var s = 0; s < start; s++) cur.push(null);
    for (var day = 1; day <= days; day++) { cur.push(day); if (cur.length === 7) { weeks.push(cur); cur = []; } }
    if (cur.length) { while (cur.length < 7) cur.push(null); weeks.push(cur); }
    weeks.forEach(function (w, wi) {
      var logged = w.filter(function (x) { return x && Array.isArray(state.days[calY + "-" + pad2(calM + 1) + "-" + pad2(x)]) && state.days[calY + "-" + pad2(calM + 1) + "-" + pad2(x)].length; });
      var agg = { kcal: 0, p: 0, f: 0, c: 0 };
      logged.forEach(function (x) { var mm = dayMacros(state.days[calY + "-" + pad2(calM + 1) + "-" + pad2(x)]); agg.kcal += mm.kcal; agg.p += mm.p; agg.f += mm.f; agg.c += mm.c; });
      var n = logged.length || 1;
      var days_lbl = w.filter(function (x) { return x; });
      var range = days_lbl.length ? (pad2(days_lbl[0]) + "–" + pad2(days_lbl[days_lbl.length - 1])) : "—";
      var row = el("div", "wk-row");
      row.appendChild(el("div", "wk-lbl", "Нед. " + (wi + 1) + " · " + range));
      if (logged.length === 0) { row.appendChild(el("div", "wk-vals muted", "нет записей")); }
      else {
        var vals = el("div", "wk-vals");
        vals.innerHTML = "<b>" + fmt(rnd(agg.kcal / n)) + "</b> ккал/д · Б " + rnd(agg.p / n) + " · Ж " + rnd(agg.f / n) + " · У " + rnd(agg.c / n) + " <span class='wk-days'>(" + logged.length + " дн.)</span>";
        row.appendChild(vals);
      }
      wk.appendChild(row);
    });

    // итог месяца
    var monKeys = Object.keys(state.days).filter(function (k) { return k.indexOf(calY + "-" + pad2(calM + 1) + "-") === 0 && Array.isArray(state.days[k]) && state.days[k].length; });
    var mo = $("mo-summary");
    if (monKeys.length === 0) { mo.innerHTML = "<div class='tk-empty'>За этот месяц записей нет.</div>"; return; }
    var sum = { kcal: 0, p: 0, f: 0, c: 0 };
    monKeys.forEach(function (k) { var mm = dayMacros(state.days[k]); sum.kcal += mm.kcal; sum.p += mm.p; sum.f += mm.f; sum.c += mm.c; });
    var nn = monKeys.length, diff = sum.kcal / nn - d.kcal;
    mo.innerHTML = "";
    var tiles = [
      { l: "Дней записано", v: nn, s: "из " + days },
      { l: "Ккал/день", v: fmt(rnd(sum.kcal / nn)), s: (Math.abs(diff) < 80 ? "в цель" : (diff > 0 ? "+" + rnd(diff) : rnd(diff))) },
      { l: "Белок/день", v: rnd(sum.p / nn), s: "цель " + d.p },
      { l: "Ж / У в день", v: rnd(sum.f / nn) + " / " + rnd(sum.c / nn), s: "г" }
    ];
    tiles.forEach(function (t) { var k = el("div", "kpi"); k.appendChild(el("span", "k-label", t.l)); var v = el("span", "k-val"); v.innerHTML = t.v + " <small>" + t.s + "</small>"; k.appendChild(v); mo.appendChild(k); });
  }

  /* ══════════ render: план ══════════ */
  function renderPlan() {
    var host = $("plan-meals"); host.innerHTML = "";
    PLAN_MEALS.forEach(function (meal) {
      var card = el("div", "plan-meal");
      card.appendChild(el("div", "plan-meal-name", meal.name));
      meal.options.forEach(function (o) {
        var row = el("div", "plan-opt");
        row.appendChild(el("span", "plan-key", o.k));
        var body = el("div", "plan-body");
        body.appendChild(el("div", "plan-what", o.what));
        var meta = el("div", "plan-meta");
        meta.appendChild(el("span", "plan-tag" + (o.cook === 0 ? " zero" : ""), o.cook === 0 ? "0 мин" : o.cook + " мин у плиты"));
        meta.appendChild(el("span", "plan-macros", fmt(o.kcal) + " ккал · Б " + o.p + " · Ж " + o.f + " · У " + o.c));
        body.appendChild(meta);
        row.appendChild(body);
        (function (mealName, opt) { row.appendChild(mkBtn("+ в день", function () { addExample(mealName, opt); }, "plan-add")); })(meal.name, o);
        card.appendChild(row);
      });
      host.appendChild(card);
    });

    var rc = $("recipes"); rc.innerHTML = "";
    RECIPES.forEach(function (r) {
      var card = el("div", "recipe");
      var h = el("div", "recipe-h"); h.appendChild(el("h3", null, r.title)); h.appendChild(el("span", "recipe-yield", r.yield)); card.appendChild(h);
      var ing = el("div", "recipe-ing"); ing.innerHTML = "<b>Нужно:</b> " + r.ing; card.appendChild(ing);
      var ol = el("ol", "recipe-steps"); r.steps.forEach(function (s) { ol.appendChild(el("li", null, s)); }); card.appendChild(ol);
      var tip = el("div", "recipe-tip"); tip.innerHTML = "<b>Хранение:</b> " + r.tip; card.appendChild(tip);
      rc.appendChild(card);
    });
  }

  /* ══════════ view switching ══════════ */
  function showView(name) {
    view = name;
    $("view-day").hidden = name !== "day";
    $("view-cal").hidden = name !== "cal";
    $("view-plan").hidden = name !== "plan";
    Array.prototype.forEach.call(document.querySelectorAll(".tab"), function (t) { t.classList.toggle("active", t.getAttribute("data-view") === name); });
    if (name === "cal") renderCalendar();
    if (name === "day") { renderDateNav(); renderTracker(); renderHistory(); }
    window.scrollTo(0, 0);
  }

  function renderAll() { renderKpi(); renderDateNav(); renderTracker(); renderHistory(); renderAuth(); if (view === "cal") renderCalendar(); }

  /* ══════════ export / import ══════════ */
  function exportData() {
    commitDay();
    var blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "ration-" + todayStr() + ".json"; a.click(); URL.revokeObjectURL(a.href);
  }
  function importData(file) {
    var r = new FileReader();
    r.onload = function () {
      try { var o = JSON.parse(r.result); if (!o || !o.days) throw new Error("bad"); state = { days: o.days, updatedAt: Date.now() }; hydrateDay(selectedDate, false); saveLocal(); pushRemoteSoon(); renderAll(); banner("Данные импортированы ✓", "ok"); }
      catch (e) { banner("Не удалось прочитать файл — это не наш экспорт.", "warn"); }
    };
    r.readAsText(file);
  }

  /* ══════════ init ══════════ */
  function setup() {
    // вкладки
    Array.prototype.forEach.call(document.querySelectorAll(".tab"), function (t) { t.addEventListener("click", function () { showView(t.getAttribute("data-view")); }); });
    // фаза
    Array.prototype.forEach.call(document.querySelectorAll(".switch button"), function (b) {
      b.addEventListener("click", function () {
        current = +b.getAttribute("data-phase");
        Array.prototype.forEach.call(document.querySelectorAll(".switch button"), function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        renderAll();
      });
    });
    // навигация по датам
    $("date-prev").addEventListener("click", function () { shiftDate(-1); });
    $("date-next").addEventListener("click", function () { shiftDate(1); });
    $("date-today").addEventListener("click", function () { setDate(todayStr()); });
    $("date-input").addEventListener("change", function (e) { if (e.target.value) setDate(e.target.value); });
    // календарь nav
    var now = new Date(); calY = now.getFullYear(); calM = now.getMonth();
    $("cal-prev").addEventListener("click", function () { calM--; if (calM < 0) { calM = 11; calY--; } renderCalendar(); });
    $("cal-next").addEventListener("click", function () { calM++; if (calM > 11) { calM = 0; calY++; } renderCalendar(); });
    // приёмы
    var mc = $("tk-mealchips"); MEAL_NAMES.forEach(function (nm) { var b = el("button", "tk-chip", "+ " + nm); b.type = "button"; b.addEventListener("click", function () { addMeal(nm); }); mc.appendChild(b); });
    renderLibrary(); renderPlan();
    // форма
    $("tk-form").addEventListener("submit", function (e) {
      e.preventDefault(); var kcalEl = $("tk-f-kcal"), kcal = parseFloat(kcalEl.value); if (isNaN(kcal)) { kcalEl.focus(); return; }
      addProduct({ name: $("tk-f-name").value.trim() || "Продукт", kcal: kcal, p: parseFloat($("tk-f-p").value) || 0, f: parseFloat($("tk-f-f").value) || 0, c: parseFloat($("tk-f-c").value) || 0 });
      e.target.reset(); $("tk-f-name").focus();
    });
    $("tk-reset").addEventListener("click", resetDay);
    $("tk-persist").textContent = HAS_CFG ? "локально + облако (если вошёл)" : "локально в этом браузере";
    $("btn-export").addEventListener("click", exportData);
    $("btn-import").addEventListener("click", function () { $("import-file").click(); });
    $("import-file").addEventListener("change", function (e) { if (e.target.files[0]) importData(e.target.files[0]); e.target.value = ""; });
  }

  loadLocal();
  setup();
  renderAll();
  initSync();

  if ("serviceWorker" in navigator) { window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); }); }
})();
