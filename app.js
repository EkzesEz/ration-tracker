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

  /* ══════════ helpers ══════════ */
  function el(tag, cls, txt) { var n = document.createElement(tag); if (cls) n.className = cls; if (txt != null) n.textContent = txt; return n; }
  function $(id) { return document.getElementById(id); }
  function rnd(x) { return Math.round(+x || 0); }
  function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }
  function fmtQty(q) { return (Math.round((+q || 0) * 100) / 100).toString(); }
  function pad2(n) { return (n < 10 ? "0" : "") + n; }
  function todayStr() { var d = new Date(); return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate()); }
  function cloneItem(o) { return { name: o.name, kcal: +o.kcal || 0, p: +o.p || 0, f: +o.f || 0, c: +o.c || 0, qty: +o.qty || 1 }; }
  function mkBtn(txt, fn, cls) { var b = document.createElement("button"); b.type = "button"; b.className = cls || "tk-qty-btn"; b.textContent = txt; b.addEventListener("click", fn); return b; }

  /* ══════════ state ══════════ */
  var LKEY = "ration-app-v1";
  var uid = 0;
  var current = 1;                       // фаза
  var state = { days: {}, updatedAt: 0 };  // { days: {"YYYY-MM-DD":[meals]}, updatedAt }
  var meals = [];                        // сегодняшние приёмы (с id)
  var activeId = null;
  var openState = {}, libOpen = {};

  var LS = (function () { try { var k = "__t"; localStorage.setItem(k, "1"); localStorage.removeItem(k); return localStorage; } catch (e) { return null; } })();

  function makeMeal(name, items) { return { id: ++uid, name: name || "Приём", items: (items || []).map(cloneItem) }; }
  function buildFrom(list) { return (list || []).map(function (m) { return makeMeal(m.name, m.items); }); }

  function saveLocal() { if (LS) { try { LS.setItem(LKEY, JSON.stringify(state)); } catch (e) {} } }
  function touch() { state.updatedAt = Date.now(); }

  // Записать текущие meals обратно в state.days[сегодня] в «чистом» виде
  function commitToday() {
    state.days[todayStr()] = meals.map(function (m) { return { name: m.name, items: m.items.map(cloneItem) }; });
  }
  function persist() { commitToday(); touch(); saveLocal(); pushRemoteSoon(); }

  function loadLocal() {
    var raw = LS ? LS.getItem(LKEY) : null;
    var parsed = null;
    if (raw !== null) { try { parsed = JSON.parse(raw); } catch (e) {} }
    if (parsed && parsed.days) state = { days: parsed.days, updatedAt: parsed.updatedAt || 0 };
    else state = { days: {}, updatedAt: 0 };
    hydrateToday(true);
  }

  // Собрать meals из state.days[сегодня]; если день первый и хранилище пустое — засеять
  function hydrateToday(seedIfEmpty) {
    var t = todayStr();
    if (!Array.isArray(state.days[t])) {
      state.days[t] = (seedIfEmpty && Object.keys(state.days).length === 0) ? SEED.map(function (m) { return { name: m.name, items: m.items.map(cloneItem) }; }) : [];
    }
    meals = buildFrom(state.days[t]);
    activeId = meals.length ? meals[meals.length - 1].id : null;
  }

  /* ══════════ Supabase sync ══════════ */
  var sb = null, session = null, pushTimer = null, syncReady = false;
  var CFG = window.RATION_CONFIG || {};
  var HAS_CFG = !!(CFG.SUPABASE_URL && CFG.SUPABASE_ANON_KEY);

  function banner(text, kind) {
    var b = $("sync-banner");
    if (!text) { b.hidden = true; return; }
    b.hidden = false; b.textContent = text; b.className = "sync-banner" + (kind ? " " + kind : "");
  }

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
    if (!HAS_CFG) {
      banner("Синк не настроен — работаешь локально на этом устройстве. Чтобы включить синхронизацию телефон↔ПК, впиши ключи Supabase в config.js (см. README).", "warn");
      return;
    }
    banner("Подключаюсь к облаку…");
    loadSupabaseLib().then(function (lib) {
      sb = lib.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY);
      sb.auth.getSession().then(function (r) { session = r.data.session; syncReady = true; onAuthChange(); });
      sb.auth.onAuthStateChange(function (_e, s) { session = s; onAuthChange(); });
    }).catch(function () {
      banner("Не удалось загрузить библиотеку синка (нет сети?). Работаешь локально — данные не потеряются.", "warn");
    });
  }

  function onAuthChange() {
    renderAuth();
    if (session) { banner("Вошёл как " + session.user.email + ". Синхронизирую…", "ok"); pullRemote(); }
    else banner("Не в аккаунте — данные только на этом устройстве. Войди, чтобы видеть их и на телефоне, и на ПК.", "warn");
  }

  function pullRemote() {
    if (!sb || !session) return;
    sb.from("tracker_state").select("data, updated_at").eq("user_id", session.user.id).maybeSingle()
      .then(function (r) {
        if (r.error) { banner("Синк: ошибка чтения (" + r.error.message + "). Локальная копия цела.", "warn"); return; }
        var remote = r.data ? r.data.data : null;
        var remoteAt = remote && remote.updatedAt ? remote.updatedAt : 0;
        if (remote && remoteAt > (state.updatedAt || 0)) {
          state = { days: remote.days || {}, updatedAt: remoteAt };
          hydrateToday(false); saveLocal(); renderAll();
          banner("Синхронизировано ✓ (подтянул свежую версию из облака).", "ok");
        } else {
          pushRemote(true);
        }
      });
  }

  function pushRemoteSoon() {
    if (!sb || !session) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(function () { pushRemote(false); }, 900);
  }
  function pushRemote(silent) {
    if (!sb || !session) return;
    sb.from("tracker_state").upsert({ user_id: session.user.id, data: state, updated_at: new Date().toISOString() }, { onConflict: "user_id" })
      .then(function (r) {
        if (r.error) banner("Синк: не удалось сохранить в облако (" + r.error.message + "). Локально всё на месте.", "warn");
        else if (!silent) banner("Сохранено в облако ✓", "ok");
      });
  }

  /* ── auth UI ── */
  function renderAuth() {
    var host = $("auth"); host.innerHTML = "";
    if (!HAS_CFG) { host.appendChild(el("span", "who", "локальный режим")); return; }
    if (session) {
      host.appendChild(el("span", "who", session.user.email));
      var out = el("button", "btn", "Выйти"); out.addEventListener("click", function () { sb.auth.signOut(); }); host.appendChild(out);
    } else {
      var login = el("button", "btn primary", "Войти / синк"); login.addEventListener("click", openAuthModal); host.appendChild(login);
    }
  }

  function openAuthModal() {
    var back = el("div", "modal-backdrop");
    var m = el("div", "modal");
    var close = el("button", "close", "×"); close.addEventListener("click", function () { back.remove(); }); m.appendChild(close);
    m.appendChild(el("h2", null, "Вход / регистрация"));
    m.appendChild(el("p", null, "Email + пароль. Первый раз — «Зарегистрироваться», потом «Войти». Один аккаунт связывает телефон и ПК."));
    var email = document.createElement("input"); email.type = "email"; email.placeholder = "email"; email.autocomplete = "email";
    var pass = document.createElement("input"); pass.type = "password"; pass.placeholder = "пароль (мин. 6)"; pass.autocomplete = "current-password";
    m.appendChild(email); m.appendChild(pass);
    var msg = el("div", "msg");
    var row = el("div", "row");
    var inBtn = el("button", "btn primary", "Войти");
    var upBtn = el("button", "btn", "Зарегистрироваться");
    function busy(t) { msg.className = "msg"; msg.textContent = t; }
    inBtn.addEventListener("click", function () {
      busy("Вхожу…");
      sb.auth.signInWithPassword({ email: email.value.trim(), password: pass.value }).then(function (r) {
        if (r.error) { msg.className = "msg err"; msg.textContent = r.error.message; } else back.remove();
      });
    });
    upBtn.addEventListener("click", function () {
      busy("Регистрирую…");
      sb.auth.signUp({ email: email.value.trim(), password: pass.value }).then(function (r) {
        if (r.error) { msg.className = "msg err"; msg.textContent = r.error.message; }
        else if (r.data.session) back.remove();
        else { msg.className = "msg ok"; msg.textContent = "Готово. Если включено подтверждение почты — проверь ящик, потом войди."; }
      });
    });
    row.appendChild(inBtn); row.appendChild(upBtn);
    m.appendChild(row); m.appendChild(msg);
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
  function toggleItem(id, name) { var k = id + "|" + name; openState[k] = !openState[k]; renderTracker(); }
  function toggleLib(name) { libOpen[name] = !libOpen[name]; renderLibrary(); }
  function mealKcal(m) { var s = 0; m.items.forEach(function (it) { s += it.kcal * it.qty; }); return s; }
  function dayKcal(dm) { var s = 0; (dm || []).forEach(function (m) { (m.items || []).forEach(function (it) { s += (+it.kcal || 0) * (+it.qty || 1); }); }); return s; }

  /* ══════════ render ══════════ */
  function renderKpi() {
    var d = PHASE[current];
    var host = $("kpis"); host.innerHTML = "";
    var cells = [
      { l: "Калории", v: fmt(d.kcal), s: "ккал/день" },
      { l: "Белок", v: d.p, s: "г" },
      { l: "Жиры", v: d.f, s: "г" },
      { l: "Темп", v: d.rate, s: "кг/мес" }
    ];
    cells.forEach(function (c) {
      var k = el("div", "kpi");
      k.appendChild(el("span", "k-label", c.l));
      var v = el("span", "k-val"); v.innerHTML = c.v + " <small>" + c.s + "</small>"; k.appendChild(v);
      host.appendChild(k);
    });
    $("tk-target").textContent = "/ " + fmt(d.kcal) + " ккал";
  }

  function renderTracker() {
    var d = PHASE[current];
    var kc = 0, p = 0, f = 0, c = 0, itemCount = 0;
    meals.forEach(function (m) { m.items.forEach(function (it) { kc += it.kcal * it.qty; p += it.p * it.qty; f += it.f * it.qty; c += it.c * it.qty; itemCount++; }); });

    $("tk-eaten").textContent = fmt(rnd(kc));
    var over = kc > d.kcal;
    var fill = $("tk-fill"); fill.style.width = Math.min(100, d.kcal ? kc / d.kcal * 100 : 0) + "%"; fill.style.background = over ? "var(--s-f)" : "var(--accent)";
    var rem = $("tk-remain");
    if (over) { rem.textContent = "перебор " + fmt(rnd(kc - d.kcal)) + " ккал"; rem.style.color = "var(--s-f)"; }
    else { rem.textContent = "осталось " + fmt(rnd(d.kcal - kc)) + " ккал"; rem.style.color = "var(--ink-2)"; }

    var macs = [{ n: "Белок", v: p, t: d.p }, { n: "Жиры", v: f, t: d.f }, { n: "Углеводы", v: c, t: d.c }];
    var mh = $("tk-macros"); mh.innerHTML = "";
    macs.forEach(function (mm) {
      var row = el("div", "tk-macro"); row.appendChild(el("span", "tk-macro-lbl", mm.n));
      var track = el("div", "tk-macro-track"); var fl = el("div", "tk-macro-fill");
      fl.style.width = Math.min(100, mm.t ? mm.v / mm.t * 100 : 0) + "%"; fl.style.background = mm.v > mm.t * 1.05 ? "var(--s-f)" : "var(--s-c)";
      track.appendChild(fl); row.appendChild(track); row.appendChild(el("span", "tk-macro-val", rnd(mm.v) + " / " + mm.t + " г")); mh.appendChild(row);
    });

    var msg;
    if (itemCount === 0) msg = "Пусто — добавь приём, потом собери его из продуктов.";
    else if (p > d.p) msg = "Белок уже перебран на " + rnd(p - d.p) + " г — упор на углеводы, а не на ещё один творог.";
    else if (kc > d.kcal + 120) msg = "Перебор по калориям — на сегодня можно остановиться.";
    else if (kc >= d.kcal - 120) msg = "Норма почти закрыта — ужин по желанию или лёгкий.";
    else msg = "До нормы " + fmt(rnd(d.kcal - kc)) + " ккал.";
    $("tk-hint").textContent = msg;

    var act = findMeal(activeId);
    $("tk-active").textContent = act ? "→ в приём «" + act.name + "»" : "→ создам новый приём";

    var host = $("tk-meals"); host.innerHTML = "";
    if (meals.length === 0) host.appendChild(el("div", "tk-empty", "Ни одного приёма — добавь ниже"));
    meals.forEach(function (m) {
      var card = el("div", "tk-meal" + (m.id === activeId ? " active" : ""));
      var head = el("div", "tk-meal-head");
      var nameBtn = mkBtn(m.name + (m.id === activeId ? " · активен" : ""), function () { setActive(m.id); }, "tk-meal-name");
      head.appendChild(nameBtn);
      head.appendChild(el("span", "tk-meal-kcal", fmt(rnd(mealKcal(m))) + " ккал"));
      head.appendChild(mkBtn("×", function () { removeMeal(m.id); }, "tk-remove"));
      card.appendChild(head);
      if (m.items.length === 0) card.appendChild(el("div", "tk-empty", "Пусто — выбери продукты ниже"));
      else {
        var list = el("div", "tk-items");
        m.items.forEach(function (it, idx) {
          var open = !!openState[m.id + "|" + it.name];
          var wrap = el("div", "tk-item-wrap");
          var row = el("div", "tk-item");
          row.appendChild(mkBtn((open ? "▾ " : "▸ ") + it.name, function () { toggleItem(m.id, it.name); }, "tk-item-name"));
          var qwrap = el("div", "tk-qty");
          qwrap.appendChild(mkBtn("−", function () { changeQty(m.id, idx, -1); }));
          var qin = document.createElement("input"); qin.type = "text"; qin.inputMode = "decimal"; qin.className = "tk-qty-in"; qin.value = fmtQty(it.qty);
          qin.setAttribute("aria-label", "Количество: " + it.name);
          qin.addEventListener("change", function () { setQty(m.id, idx, qin.value); });
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
        var open = !!libOpen[o.name];
        var item = el("div", "tk-libitem");
        item.appendChild(mkBtn((open ? "▾ " : "▸ ") + o.name + " · " + o.kcal, function () { toggleLib(o.name); }, "tk-libname"));
        var add = mkBtn("+", function () { addProduct(o); }, "tk-libadd"); add.setAttribute("aria-label", "Добавить: " + o.name);
        item.appendChild(add);
        chips.appendChild(item);
        if (open) chips.appendChild(el("div", "tk-libdetail", "Б " + o.p + " · Ж " + o.f + " · У " + o.c + " г на порцию"));
      });
      wrap.appendChild(chips); q.appendChild(wrap);
    });
  }

  function fmtDate(k) { var p = k.split("-"); return p[2] + "." + p[1]; }
  function renderHistory() {
    var d = PHASE[current], t = todayStr();
    var dates = Object.keys(state.days).filter(function (k) { return k !== t && Array.isArray(state.days[k]) && state.days[k].length; }).sort();
    var host = $("history-list"), avgEl = $("history-avg"); host.innerHTML = "";
    if (dates.length === 0) { host.appendChild(el("div", "tk-empty", "История появится со второго дня — сегодня копится, завтра ляжет сюда.")); avgEl.textContent = "Пока только сегодняшний день."; return; }
    var show = dates.slice(-14).reverse(), max = d.kcal * 1.25;
    show.forEach(function (k) {
      var kc = dayKcal(state.days[k]);
      var row = el("div", "hist-row"); row.appendChild(el("span", "hist-date", fmtDate(k)));
      var track = el("div", "hist-track"); var fl = el("div", "hist-fill");
      fl.style.width = Math.min(100, max ? kc / max * 100 : 0) + "%"; fl.style.background = kc >= d.kcal ? "var(--s-c)" : "var(--accent)";
      track.appendChild(fl);
      var mark = el("div", "hist-mark"); mark.style.left = Math.min(100, d.kcal / max * 100) + "%"; track.appendChild(mark);
      row.appendChild(track); row.appendChild(el("span", "hist-kcal", fmt(rnd(kc)))); host.appendChild(row);
    });
    var last7 = dates.slice(-7).map(function (k) { return dayKcal(state.days[k]); });
    var avg = last7.reduce(function (a, b) { return a + b; }, 0) / last7.length, diff = avg - d.kcal;
    avgEl.textContent = "Среднее за " + last7.length + " дн.: " + fmt(rnd(avg)) + " ккал — " + (Math.abs(diff) < 80 ? "в цель" : (diff > 0 ? "+" + fmt(rnd(diff)) + " над целью" : fmt(rnd(diff)) + " под целью")) + " (цель " + fmt(d.kcal) + ")";
  }

  function renderAll() { renderKpi(); renderTracker(); renderHistory(); renderAuth(); }

  /* ══════════ export / import ══════════ */
  function exportData() {
    commitToday();
    var blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    var a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "ration-" + todayStr() + ".json"; a.click(); URL.revokeObjectURL(a.href);
  }
  function importData(file) {
    var r = new FileReader();
    r.onload = function () {
      try {
        var o = JSON.parse(r.result);
        if (!o || !o.days) throw new Error("bad");
        state = { days: o.days, updatedAt: Date.now() };
        hydrateToday(false); saveLocal(); pushRemoteSoon(); renderAll();
        banner("Данные импортированы ✓", "ok");
      } catch (e) { banner("Не удалось прочитать файл — это не наш экспорт.", "warn"); }
    };
    r.readAsText(file);
  }

  /* ══════════ init ══════════ */
  function setup() {
    // фаза
    Array.prototype.forEach.call(document.querySelectorAll(".switch button"), function (b) {
      b.addEventListener("click", function () {
        current = +b.getAttribute("data-phase");
        Array.prototype.forEach.call(document.querySelectorAll(".switch button"), function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        renderAll();
      });
    });
    // приёмы
    var mc = $("tk-mealchips");
    MEAL_NAMES.forEach(function (nm) { var b = el("button", "tk-chip", "+ " + nm); b.type = "button"; b.addEventListener("click", function () { addMeal(nm); }); mc.appendChild(b); });
    renderLibrary();
    // форма
    $("tk-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var kcalEl = $("tk-f-kcal"), kcal = parseFloat(kcalEl.value);
      if (isNaN(kcal)) { kcalEl.focus(); return; }
      addProduct({ name: $("tk-f-name").value.trim() || "Продукт", kcal: kcal, p: parseFloat($("tk-f-p").value) || 0, f: parseFloat($("tk-f-f").value) || 0, c: parseFloat($("tk-f-c").value) || 0 });
      e.target.reset(); $("tk-f-name").focus();
    });
    $("tk-reset").addEventListener("click", resetDay);
    $("tk-persist").textContent = HAS_CFG ? "локальная копия + облако (если вошёл)" : "локальная копия в этом браузере";
    $("btn-export").addEventListener("click", exportData);
    $("btn-import").addEventListener("click", function () { $("import-file").click(); });
    $("import-file").addEventListener("change", function (e) { if (e.target.files[0]) importData(e.target.files[0]); e.target.value = ""; });
  }

  loadLocal();
  setup();
  renderAll();
  initSync();

  // service worker (офлайн)
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); });
  }
})();
