"use strict";
(function () {

  /* ══════════ норма по умолчанию (бывшая «фаза 2»), дальше настраивается ══════════ */
  var DEFAULT_NORM = { kcal: 3080, p: 172, f: 115, c: 334 };
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
    ] },
    // Вкусно и Точка — официальные данные из vkusnoitochka.ru/sostav.pdf (на порцию).
    { g: "ВиТ · бургеры", items: [
      { name: "Гамбургер · 97 г", kcal: 252, p: 12, f: 8.2, c: 33 },
      { name: "Чизбургер · 109 г", kcal: 291, p: 14, f: 11, c: 33 },
      { name: "Двойной Чизбургер · 158 г", kcal: 416, p: 24, f: 21, c: 34 },
      { name: "Тройной Чизбургер Три Сыра · 202 г", kcal: 538, p: 34, f: 29, c: 34 },
      { name: "Чикенбургер · 127 г", kcal: 331, p: 10, f: 14, c: 40 },
      { name: "Фиш Бургер · 130 г", kcal: 327, p: 13, f: 13, c: 40 },
      { name: "Двойной Фиш Бургер · 191 г", kcal: 464, p: 22, f: 20, c: 50 },
      { name: "Чикен Хит · 190 г", kcal: 445, p: 19, f: 19, c: 50 },
      { name: "Биг Хит · 216 г", kcal: 503, p: 25, f: 25, c: 45 },
      { name: "Двойной Биг Хит · 284 г", kcal: 676, p: 40, f: 37, c: 46 },
      { name: "Биг Спешиал · 326 г", kcal: 756, p: 41, f: 42, c: 52 },
      { name: "Двойной Биг Спешиал · 433 г", kcal: 1042, p: 67, f: 63, c: 52 },
      { name: "Биг Спешиал Джуниор · 222 г", kcal: 545, p: 30, f: 30, c: 38 },
      { name: "Гранд Де Люкс · 240 г", kcal: 546, p: 30, f: 28, c: 43 },
      { name: "Чикен Премьер · 221 г", kcal: 476, p: 22, f: 20, c: 52 },
      { name: "Биг Чикен Бургер · 313 г", kcal: 678, p: 37, f: 32, c: 58 },
      { name: "Цезарь Ролл · 195 г", kcal: 429, p: 17, f: 22, c: 41 },
      { name: "Шримп Ролл · 160 г", kcal: 397, p: 14, f: 17, c: 46 }
    ] },
    { g: "ВиТ · снэки и картофель", items: [
      { name: "Наггетсы 4 шт · 72 г", kcal: 178, p: 11, f: 9.2, c: 12 },
      { name: "Наггетсы 6 шт · 107 г", kcal: 264, p: 17, f: 14, c: 19 },
      { name: "Наггетсы 9 шт · 161 г", kcal: 397, p: 25, f: 21, c: 28 },
      { name: "Куриные стрипсы 3 шт · 99 г", kcal: 223, p: 14, f: 10, c: 19 },
      { name: "Куриные стрипсы 5 шт · 165 г", kcal: 371, p: 23, f: 17, c: 31 },
      { name: "Сырные палочки Моцарелла", kcal: 258, p: 13, f: 9.2, c: 30 },
      { name: "Снэк Бокс · 196 г", kcal: 500, p: 20, f: 24, c: 49 },
      { name: "Картофель фри маленький · 76 г", kcal: 220, p: 2.6, f: 10, c: 28 },
      { name: "Картофель фри средний · 110 г", kcal: 318, p: 3.7, f: 15, c: 40 },
      { name: "Картофель фри большой · 147 г", kcal: 425, p: 5, f: 20, c: 53 },
      { name: "Картофель фри двойной", kcal: 636, p: 7.5, f: 30, c: 80 },
      { name: "Картофель по-деревенски · 165 г", kcal: 331, p: 4.6, f: 15, c: 42 },
      { name: "Картофель по-деревенски · 220 г", kcal: 441, p: 6.2, f: 20, c: 57 },
      { name: "Салат Овощной", kcal: 36, p: 1.1, f: 2.5, c: 2.3 },
      { name: "Салат Цезарь", kcal: 189, p: 14, f: 9.5, c: 12 }
    ] },
    { g: "ВиТ · соусы, напитки, десерты", items: [
      { name: "Сырный соус · 25 г", kcal: 91, p: 0.5, f: 9.2, c: 1.5 },
      { name: "Кола зеро · 500 мл", kcal: 2, p: 0, f: 0, c: 0.5 },
      { name: "Добрый Кола · 500 мл", kcal: 212, p: 0, f: 0, c: 53 },
      { name: "Коктейль молочный · 400 мл", kcal: 309, p: 7.3, f: 6, c: 57 },
      { name: "Пирожок с вишней · 80 г", kcal: 290, p: 2.4, f: 12, c: 43 },
      { name: "Пирожок Лесные Ягоды-кремчиз · 79 г", kcal: 271, p: 3.1, f: 14, c: 33 }
    ] },
    // Готовые блюда из доставки — по этикеткам (значения на весь продукт).
    { g: "Готовое · доставка", items: [
      { name: "Спагетти болоньезе Red Box · 300 г", kcal: 483, p: 18, f: 18, c: 63 },
      { name: "Ролл с крабом и масаго Кулинариум · 215 г", kcal: 645, p: 13.5, f: 19.6, c: 103.6 },
      { name: "Круассан с ветчиной и сыром · 115 г", kcal: 472, p: 11.5, f: 36.8, c: 23 }
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
  // Локальное хранилище своё у каждого аккаунта: до входа — "anon", после — по id
  // пользователя. Иначе на одном устройстве разные аккаунты видели бы чужой день.
  var LKEY_OLD = "ration-app-v1";
  var LKEY_PREFIX = "ration-app-v2::";
  var currentUserId = null;
  function lkey() { return LKEY_PREFIX + (currentUserId || "anon"); }
  var uid = 0;
  var view = "day";
  var selectedDate = todayStr();
  var calY, calM;
  var state = { days: {}, norm: null, customProducts: [], sharedCache: [], updatedAt: 0 };
  var sharedProducts = [];   // общая база продуктов (все пользователи)
  var meals = [];
  var activeId = null;
  var openState = {}, libOpen = {};
  var pendingCloud = false;   // есть локальные изменения, не отправленные в облако

  var LS = (function () { try { var k = "__t"; localStorage.setItem(k, "1"); localStorage.removeItem(k); return localStorage; } catch (e) { return null; } })();

  function N() { return state.norm || DEFAULT_NORM; }
  function makeMeal(name, items) { return { id: ++uid, name: name || "Приём", items: (items || []).map(cloneItem) }; }
  function buildFrom(list) { return (list || []).map(function (m) { return makeMeal(m.name, m.items); }); }
  function saveLocal() { if (LS) { try { LS.setItem(lkey(), JSON.stringify(state)); } catch (e) {} } }
  function commitDay() { state.days[selectedDate] = meals.map(function (m) { return { name: m.name, items: m.items.map(cloneItem) }; }); }

  // Любое изменение: пишем локально сразу (не теряется), но в облако — только по кнопке.
  function markLocal() { commitDay(); saveLocal(); pendingCloud = true; updateSavebar(); }

  function hydrateDay(dateStr, seedIfEmpty) {
    if (!Array.isArray(state.days[dateStr])) {
      state.days[dateStr] = (seedIfEmpty && dateStr === todayStr() && Object.keys(state.days).length === 0)
        ? SEED.map(function (m) { return { name: m.name, items: m.items.map(cloneItem) }; }) : [];
    }
    meals = buildFrom(state.days[dateStr]);
    activeId = meals.length ? meals[meals.length - 1].id : null;
  }

  function loadLocal() {
    var raw = LS ? LS.getItem(lkey()) : null, parsed = null;
    // Разовый перенос данных со старого общего ключа в хранилище "anon".
    if (raw === null && LS && !currentUserId) {
      var old = LS.getItem(LKEY_OLD);
      if (old !== null) { raw = old; try { LS.setItem(lkey(), old); } catch (e) {} }
    }
    if (raw !== null) { try { parsed = JSON.parse(raw); } catch (e) {} }
    state = {
      days: (parsed && parsed.days) ? parsed.days : {},
      norm: (parsed && parsed.norm) ? parsed.norm : null,
      customProducts: (parsed && Array.isArray(parsed.customProducts)) ? parsed.customProducts : [],
      sharedCache: (parsed && Array.isArray(parsed.sharedCache)) ? parsed.sharedCache : [],
      updatedAt: (parsed && parsed.updatedAt) || 0
    };
    sharedProducts = state.sharedCache || [];
    pendingCloud = false;
    hydrateDay(selectedDate, !currentUserId);
  }

  /* ══════════ Supabase sync ══════════ */
  var sb = null, session = null;
  var CFG = window.RATION_CONFIG || {};
  var HAS_CFG = !!(CFG.SUPABASE_URL && CFG.SUPABASE_ANON_KEY);

  function banner(text, kind) { var b = $("sync-banner"); if (!text) { b.hidden = true; return; } b.hidden = false; b.textContent = text; b.className = "sync-banner" + (kind ? " " + kind : ""); }
  function updateSavebar() {
    var bar = $("savebar");
    if (session && pendingCloud) { bar.hidden = false; $("savebar-msg").textContent = "Есть несохранённые изменения"; }
    else bar.hidden = true;
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
    if (!HAS_CFG) { banner("Синк не настроен — работаешь локально на этом устройстве. Впиши ключи Supabase в config.js (см. README).", "warn"); return; }
    banner("Подключаюсь к облаку…");
    loadSupabaseLib().then(function (lib) {
      sb = lib.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY);
      sb.auth.getSession().then(function (r) { session = r.data.session; onAuthChange(); });
      sb.auth.onAuthStateChange(function (_e, s) { session = s; onAuthChange(); });
    }).catch(function () { banner("Не удалось загрузить библиотеку синка (нет сети?). Работаешь локально — данные не потеряются.", "warn"); });
  }
  function onAuthChange() {
    var newId = session ? session.user.id : null;
    if (newId !== currentUserId) {
      // Аккаунт сменился: сохраняем текущее хранилище и переключаемся на другое.
      saveLocal();
      currentUserId = newId;
      loadLocal();
      renderAll();
    }
    renderAuth(); updateSavebar();
    if (session) {
      banner("Вошёл как " + session.user.email + ". Тяну свежее из облака…", "ok");
      pullRemote(); loadShared();
    } else {
      sharedProducts = state.sharedCache || [];
      renderLibrary();
      banner("Не в аккаунте — данные только на этом устройстве. Войди, чтобы сохранять в облако.", "warn");
    }
  }
  function pullRemote() {
    if (!sb || !session) return;
    sb.from("tracker_state").select("data, updated_at").eq("user_id", session.user.id).maybeSingle().then(function (r) {
      if (r.error) { banner("Синк: ошибка чтения (" + r.error.message + "). Локальная копия цела.", "warn"); return; }
      var remote = r.data ? r.data.data : null, remoteAt = remote && remote.updatedAt ? remote.updatedAt : 0;
      // Облако новее локального — принимаем (но не затираем несохранённые локальные правки).
      if (remote && remoteAt > (state.updatedAt || 0) && !pendingCloud) {
        state = { days: remote.days || {}, norm: remote.norm || null, customProducts: remote.customProducts || [], sharedCache: sharedProducts || [], updatedAt: remoteAt };
        hydrateDay(selectedDate, false); saveLocal(); renderAll();
        banner("Синхронизировано ✓ (подтянул свежую версию из облака).", "ok");
      } else if (remote && remoteAt > (state.updatedAt || 0) && pendingCloud) {
        banner("В облаке есть более свежая версия, но у тебя несохранённые правки. Сохранишь — твоя версия победит.", "warn");
      } else { banner("Готово. Несохранённое отправится в облако по кнопке «Сохранить».", "ok"); }
    });
  }
  // Перед отправкой подтягиваем свежее из облака и добавляем дни, которых у нас
  // нет (их мог записать MCP из чата), чтобы сохранение их не затёрло.
  function mergeRemoteOnlyDays() {
    if (!sb || !session) return Promise.resolve();
    return sb.from("tracker_state").select("data").eq("user_id", session.user.id).maybeSingle().then(function (r) {
      var remote = (!r.error && r.data) ? r.data.data : null;
      if (!remote || !remote.days) return;
      var added = 0;
      Object.keys(remote.days).forEach(function (k) {
        var mine = state.days[k];
        if ((!Array.isArray(mine) || mine.length === 0) && Array.isArray(remote.days[k]) && remote.days[k].length) {
          state.days[k] = remote.days[k]; added++;
        }
      });
      if (added) { hydrateDay(selectedDate, false); renderAll(); }
    }, function () { /* офлайн — сохраняем как есть */ });
  }

  function saveCloud() {
    if (!sb || !session) return;
    commitDay();
    $("savebar-msg").textContent = "Сохраняю…";
    mergeRemoteOnlyDays().then(doPush);
  }

  function doPush() {
    commitDay(); state.updatedAt = Date.now(); saveLocal();
    sb.from("tracker_state").upsert({ user_id: session.user.id, data: state, updated_at: new Date().toISOString() }, { onConflict: "user_id" }).then(function (r) {
      if (r.error) { banner("Не удалось сохранить в облако (" + r.error.message + "). Локально всё на месте.", "warn"); $("savebar-msg").textContent = "Ошибка — попробуй ещё раз"; }
      else { pendingCloud = false; updateSavebar(); banner("Сохранено в облако ✓", "ok"); }
    }, function (err) {
      banner("Ошибка сети при сохранении. Локально всё цело, попробуй ещё раз.", "warn");
      $("savebar-msg").textContent = "Ошибка — попробуй ещё раз";
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
    m.appendChild(el("p", null, "Email + пароль. Первый раз — «Зарегистрироваться», потом «Войти»."));
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
  function addMeal(name) { var m = makeMeal(name, []); meals.push(m); activeId = m.id; markLocal(); renderTracker(); }
  function removeMeal(id) { meals = meals.filter(function (m) { return m.id !== id; }); if (activeId === id) activeId = meals.length ? meals[meals.length - 1].id : null; markLocal(); renderTracker(); }
  function setActive(id) { activeId = id; renderTracker(); }
  function addProduct(o) {
    var m = findMeal(activeId);
    if (!m) { m = makeMeal("Приём", []); meals.push(m); activeId = m.id; }
    var ex = null;
    for (var i = 0; i < m.items.length; i++) if (m.items[i].name === o.name) { ex = m.items[i]; break; }
    if (ex) ex.qty += 1; else m.items.push(cloneItem({ name: o.name, kcal: o.kcal, p: o.p, f: o.f, c: o.c, qty: 1 }));
    markLocal(); renderTracker();
  }
  function changeQty(id, idx, delta) { var m = findMeal(id); if (!m || !m.items[idx]) return; m.items[idx].qty = Math.round((m.items[idx].qty + delta) * 100) / 100; if (m.items[idx].qty <= 0) m.items.splice(idx, 1); markLocal(); renderTracker(); }
  function setQty(id, idx, val) { var m = findMeal(id); if (!m || !m.items[idx]) return; var q = parseFloat(String(val).replace(",", ".")); if (isNaN(q) || q <= 0) { renderTracker(); return; } m.items[idx].qty = q; markLocal(); renderTracker(); }
  function removeItem(id, idx) { var m = findMeal(id); if (!m) return; m.items.splice(idx, 1); markLocal(); renderTracker(); }
  function resetDay() { meals = []; activeId = null; markLocal(); renderTracker(); renderHistory(); }
  function toggleItem(id, name) { openState[id + "|" + name] = !openState[id + "|" + name]; renderTracker(); }
  function toggleLib(name) { libOpen[name] = !libOpen[name]; renderLibrary(); }
  function mealKcal(m) { var s = 0; m.items.forEach(function (it) { s += it.kcal * it.qty; }); return s; }
  function dayMacros(dm) { var t = { kcal: 0, p: 0, f: 0, c: 0 }; (dm || []).forEach(function (m) { (m.items || []).forEach(function (it) { var q = +it.qty || 1; t.kcal += (+it.kcal || 0) * q; t.p += (+it.p || 0) * q; t.f += (+it.f || 0) * q; t.c += (+it.c || 0) * q; }); }); return t; }

  function setDate(dateStr) { selectedDate = dateStr; hydrateDay(selectedDate, false); renderDateNav(); renderTracker(); renderHistory(); }
  function shiftDate(delta) { var d = parseKey(selectedDate); d.setDate(d.getDate() + delta); setDate(keyOf(d)); }

  function moveDay(toDate) {
    if (!toDate || toDate === selectedDate) { banner("Выбери другую дату для переноса.", "warn"); return; }
    commitDay();
    var src = state.days[selectedDate] || [];
    if (!src.length) { banner("В этом дне нечего переносить.", "warn"); return; }
    if (Array.isArray(state.days[toDate]) && state.days[toDate].length) {
      if (!window.confirm("В дне " + toDate + " уже есть записи. Заменить их содержимым " + selectedDate + "?")) return;
    }
    state.days[toDate] = src.map(function (m) { return { name: m.name, items: (m.items || []).map(cloneItem) }; });
    state.days[selectedDate] = [];
    meals = []; activeId = null;
    saveLocal(); pendingCloud = true; updateSavebar();
    $("move-box").hidden = true;
    renderTracker(); renderHistory();
    banner("Перенёс день на " + labelDate(toDate).replace(" · сегодня", "") + ". Этот день очищен. Не забудь «Сохранить».", "ok");
  }

  function addExample(mealName, opt) {
    var m = makeMeal(mealName, [{ name: mealName + " «" + opt.k + "»: " + opt.what, kcal: opt.kcal, p: opt.p, f: opt.f, c: opt.c, qty: 1 }]);
    meals.push(m); activeId = m.id; markLocal();
    showView("day"); renderTracker();
    banner("Добавлено «" + mealName + " " + opt.k + "» в день " + labelDate(selectedDate).replace(" · сегодня", "") + " ✓", "ok");
  }

  /* ══════════ общая база продуктов ══════════ */
  // Вошёл — продукт уезжает в общую таблицу и виден всем, группа названа логином
  // автора. Не вошёл — падает в локальный список этого устройства.
  function addCustomProduct(o) {
    if (!o.name || isNaN(o.kcal)) return false;
    var rec = { name: o.name, kcal: +o.kcal, p: +o.p || 0, f: +o.f || 0, c: +o.c || 0 };
    if (sb && session) {
      sb.from("shared_products").insert(Object.assign({ user_id: session.user.id, author: authorOf(session.user.email) }, rec))
        .then(function (r) {
          if (r.error) banner("Не удалось добавить в общую базу (" + r.error.message + ").", "warn");
          else { banner("Продукт «" + o.name + "» добавлен в общую базу — его видят все ✓", "ok"); loadShared(); }
        }, function () { banner("Сеть недоступна — продукт в общую базу не ушёл.", "warn"); });
    } else {
      state.customProducts.push(rec);
      saveLocal(); pendingCloud = true; updateSavebar(); renderLibrary();
      banner("Продукт «" + o.name + "» добавлен локально. Войди, чтобы он попал в общую базу.", "ok");
    }
    return true;
  }
  function removeCustomProduct(idx) { state.customProducts.splice(idx, 1); saveLocal(); pendingCloud = true; updateSavebar(); renderLibrary(); }

  function authorOf(email) { return String(email || "аноним").split("@")[0]; }
  function loadShared() {
    if (!sb || !session) return;
    sb.from("shared_products").select("id,user_id,author,name,kcal,p,f,c").order("created_at", { ascending: true })
      .then(function (r) {
        if (r.error) { banner("Общая база продуктов недоступна (" + r.error.message + "). Показываю сохранённую копию.", "warn"); return; }
        sharedProducts = (r.data || []).map(function (x) {
          return { id: x.id, user_id: x.user_id, author: x.author, name: x.name, kcal: +x.kcal, p: +x.p, f: +x.f, c: +x.c };
        });
        state.sharedCache = sharedProducts; saveLocal();
        renderLibrary();
      }, function () { /* офлайн — остаётся кэш */ });
  }
  function removeSharedProduct(id) {
    if (!sb || !session) return;
    sb.from("shared_products").delete().eq("id", id).then(function (r) {
      if (r.error) banner("Не удалось удалить (" + r.error.message + "). Удалять можно только свои продукты.", "warn");
      else loadShared();
    }, function () { banner("Сеть недоступна — удалить не вышло.", "warn"); });
  }

  /* ══════════ поиск в USDA FoodData Central ══════════ */
  var USDA_KEY = CFG.USDA_API_KEY || "";
  var usdaSeq = 0, usdaTimer = null;
  function r1(x) { return x == null ? 0 : Math.round(x * 10) / 10; }
  // Значения на 100 г. Берём nutrientNumber (как в рабочем примере), с запасным nutrientId.
  function usdaExtract(food) {
    var out = { kcal: null, p: null, f: null, c: null };
    (food.foodNutrients || []).forEach(function (n) {
      var ids = [];
      if (n.nutrientNumber != null) ids.push(parseInt(n.nutrientNumber, 10));
      if (n.nutrientId != null) ids.push(+n.nutrientId);
      var v = parseFloat(n.value); if (isNaN(v)) return;
      if (out.kcal == null && (ids.indexOf(1008) >= 0 || ids.indexOf(208) >= 0)) out.kcal = v;
      else if (out.p == null && (ids.indexOf(1003) >= 0 || ids.indexOf(203) >= 0)) out.p = v;
      else if (out.f == null && (ids.indexOf(1004) >= 0 || ids.indexOf(204) >= 0)) out.f = v;
      else if (out.c == null && (ids.indexOf(1005) >= 0 || ids.indexOf(205) >= 0)) out.c = v;
    });
    if (out.kcal == null) return null;
    return { name: (food.description || "Продукт") + " · 100 г", kcal: Math.round(out.kcal), p: r1(out.p), f: r1(out.f), c: r1(out.c) };
  }
  function usdaSearch(q) {
    var seq = ++usdaSeq, status = $("usda-status"), results = $("usda-results");
    status.textContent = "Ищу…"; results.innerHTML = "";
    // Есть ключ в конфиге (локальная разработка) — идём напрямую; иначе через
    // серверный прокси (прод: ключ на сервере, в браузере его нет).
    var url = USDA_KEY
      ? ("https://api.nal.usda.gov/fdc/v1/foods/search?api_key=" + encodeURIComponent(USDA_KEY)
        + "&query=" + encodeURIComponent(q) + "&pageSize=15&dataType=" + encodeURIComponent("Foundation,SR Legacy"))
      : ("/.netlify/functions/usda?q=" + encodeURIComponent(q));
    fetch(url).then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(function (j) {
        if (seq !== usdaSeq) return;
        var foods = (j.foods || []).map(usdaExtract).filter(Boolean);
        if (!foods.length) { status.textContent = "Ничего не найдено."; return; }
        status.textContent = "Найдено " + (j.totalHits || foods.length) + ", показаны первые " + foods.length + " (на 100 г):";
        renderUsdaResults(foods);
      })
      .catch(function (e) {
        if (seq !== usdaSeq) return;
        status.textContent = "Ошибка запроса (" + e.message + "). Проверь интернет; если это CORS — см. README.";
      });
  }
  function renderUsdaResults(foods) {
    var host = $("usda-results"); host.innerHTML = "";
    foods.forEach(function (o) {
      var row = el("div", "usda-row");
      var body = el("div", "usda-body");
      body.appendChild(el("div", "usda-name", o.name));
      body.appendChild(el("div", "usda-macros", o.kcal + " ккал · Б " + o.p + " · Ж " + o.f + " · У " + o.c));
      row.appendChild(body);
      var acts = el("div", "usda-acts");
      acts.appendChild(mkBtn("+ в день", function () { addProduct(o); }, "usda-btn"));
      acts.appendChild(mkBtn("★ в базу", function () { addCustomProduct(o); }, "usda-btn ghost"));
      row.appendChild(acts);
      host.appendChild(row);
    });
  }

  /* ══════════ render: норма ══════════ */
  function renderKpi() {
    var d = N(), host = $("kpis"); host.innerHTML = "";
    [{ l: "Калории", v: fmt(d.kcal), s: "ккал" }, { l: "Белок", v: d.p, s: "г" }, { l: "Жиры", v: d.f, s: "г" }, { l: "Углеводы", v: d.c, s: "г" }].forEach(function (c) {
      var k = el("div", "kpi"); k.appendChild(el("span", "k-label", c.l));
      var v = el("span", "k-val"); v.innerHTML = c.v + " <small>" + c.s + "</small>"; k.appendChild(v); host.appendChild(k);
    });
    $("tk-target").textContent = "/ " + fmt(d.kcal) + " ккал";
  }
  function fillNormForm() { var d = N(); $("norm-kcal").value = d.kcal; $("norm-p").value = d.p; $("norm-f").value = d.f; $("norm-c").value = d.c; }
  function saveNorm() {
    var kcal = parseFloat($("norm-kcal").value);
    if (isNaN(kcal) || kcal <= 0) { $("norm-kcal").focus(); return; }
    state.norm = { kcal: kcal, p: parseFloat($("norm-p").value) || 0, f: parseFloat($("norm-f").value) || 0, c: parseFloat($("norm-c").value) || 0 };
    saveLocal(); pendingCloud = true; updateSavebar();
    $("norm-form").hidden = true;
    renderKpi(); renderTracker(); if (view === "cal") renderCalendar();
  }

  /* ══════════ render: день ══════════ */
  function renderDateNav() { $("date-label").textContent = labelDate(selectedDate); $("date-input").value = selectedDate; $("date-today").style.visibility = (selectedDate === todayStr()) ? "hidden" : "visible"; }

  function renderTracker() {
    var d = N(), kc = 0, p = 0, f = 0, c = 0, itemCount = 0;
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
    else if (d.p && p > d.p) msg = "Белок перебран на " + rnd(p - d.p) + " г — упор на углеводы.";
    else if (kc > d.kcal + 120) msg = "Перебор по калориям.";
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
    var groups = [];

    // Общая база: группы названы логином автора, свои позиции можно удалять.
    var byAuthor = {};
    (sharedProducts || []).forEach(function (o) {
      var a = o.author || "аноним";
      (byAuthor[a] = byAuthor[a] || []).push(o);
    });
    var mine = session ? authorOf(session.user.email) : null;
    Object.keys(byAuthor).sort(function (a, b) {
      if (a === mine) return -1; if (b === mine) return 1; return a.localeCompare(b);
    }).forEach(function (a) {
      groups.push({ g: a + (a === mine ? " · ты" : ""), shared: true, items: byAuthor[a] });
    });

    if (state.customProducts && state.customProducts.length)
      groups.push({ g: "Мои продукты (локально)", custom: true, items: state.customProducts });

    groups = groups.concat(LIB);

    groups.forEach(function (grp) {
      var wrap = el("div", "tk-group"); wrap.appendChild(el("div", "tk-group-lbl", grp.g));
      var chips = el("div", "tk-group-chips");
      grp.items.forEach(function (o, idx) {
        var open = !!libOpen[o.name], item = el("div", "tk-libitem");
        item.appendChild(mkBtn((open ? "▾ " : "▸ ") + o.name + " · " + o.kcal, function () { toggleLib(o.name); }, "tk-libname"));
        var add = mkBtn("+", function () { addProduct(o); }, "tk-libadd"); add.setAttribute("aria-label", "Добавить: " + o.name); item.appendChild(add);
        if (grp.custom) {
          var del = mkBtn("×", function () { removeCustomProduct(idx); }, "tk-libdel");
          del.setAttribute("aria-label", "Удалить: " + o.name); item.appendChild(del);
        } else if (grp.shared && session && o.user_id === session.user.id) {
          var sdel = mkBtn("×", function () { removeSharedProduct(o.id); }, "tk-libdel");
          sdel.setAttribute("aria-label", "Удалить из общей базы: " + o.name); item.appendChild(sdel);
        }
        chips.appendChild(item);
        if (open) chips.appendChild(el("div", "tk-libdetail", "Б " + o.p + " · Ж " + o.f + " · У " + o.c + " г на порцию"));
      });
      wrap.appendChild(chips); q.appendChild(wrap);
    });
  }

  function renderHistory() {
    var d = N();
    var dates = Object.keys(state.days).filter(function (k) { return k !== selectedDate && Array.isArray(state.days[k]) && state.days[k].length; }).sort();
    var host = $("history-list"), avgEl = $("history-avg"); host.innerHTML = "";
    if (dates.length === 0) { host.appendChild(el("div", "tk-empty", "Другие дни появятся здесь по мере заполнения.")); avgEl.textContent = ""; return; }
    var show = dates.slice(-10).reverse(), max = d.kcal * 1.25;
    show.forEach(function (k) {
      var kc = dayMacros(state.days[k]).kcal, row = el("div", "hist-row");
      row.appendChild(mkBtn(labelDate(k).replace(/, /, " "), function () { setDate(k); }, "hist-date-btn"));
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
    var d = N();
    $("cal-title").textContent = MONTHS[calM] + " " + calY;
    var dow = $("cal-dow"); dow.innerHTML = ""; DOW.forEach(function (w) { dow.appendChild(el("span", "cal-dow-c", w)); });

    var first = new Date(calY, calM, 1), start = dowMon(first), days = new Date(calY, calM + 1, 0).getDate();
    var grid = $("cal-grid"); grid.innerHTML = "";
    for (var i = 0; i < start; i++) grid.appendChild(el("div", "cal-cell empty"));
    for (var dd = 1; dd <= days; dd++) {
      var k = calY + "-" + pad2(calM + 1) + "-" + pad2(dd);
      var kc = (Array.isArray(state.days[k])) ? dayMacros(state.days[k]).kcal : 0;
      var cls = "cal-cell"; if (k === todayStr()) cls += " today"; if (k === selectedDate) cls += " sel";
      var cell = el("button", cls); cell.type = "button"; cell.appendChild(el("span", "cal-num", String(dd)));
      if (kc > 0) {
        var kcEl = el("span", "cal-kc", fmt(rnd(kc))); kcEl.style.color = kc >= d.kcal ? "var(--s-c)" : "var(--accent)"; cell.appendChild(kcEl);
        var bar = el("span", "cal-bar"); var fl = el("span"); fl.style.width = Math.min(100, kc / (d.kcal * 1.2) * 100) + "%"; fl.style.background = kc >= d.kcal ? "var(--s-c)" : "var(--accent)"; bar.appendChild(fl); cell.appendChild(bar);
      }
      (function (key) { cell.addEventListener("click", function () { setDate(key); showView("day"); }); })(k);
      grid.appendChild(cell);
    }

    var wk = $("wk-list"); wk.innerHTML = "";
    var weeks = [], cur = [];
    for (var s = 0; s < start; s++) cur.push(null);
    for (var day = 1; day <= days; day++) { cur.push(day); if (cur.length === 7) { weeks.push(cur); cur = []; } }
    if (cur.length) { while (cur.length < 7) cur.push(null); weeks.push(cur); }
    weeks.forEach(function (w, wi) {
      var pre = calY + "-" + pad2(calM + 1) + "-";
      var logged = w.filter(function (x) { return x && Array.isArray(state.days[pre + pad2(x)]) && state.days[pre + pad2(x)].length; });
      var agg = { kcal: 0, p: 0, f: 0, c: 0 };
      logged.forEach(function (x) { var mm = dayMacros(state.days[pre + pad2(x)]); agg.kcal += mm.kcal; agg.p += mm.p; agg.f += mm.f; agg.c += mm.c; });
      var n = logged.length || 1;
      var dl = w.filter(function (x) { return x; });
      var range = dl.length ? (pad2(dl[0]) + "–" + pad2(dl[dl.length - 1])) : "—";
      var row = el("div", "wk-row"); row.appendChild(el("div", "wk-lbl", "Нед. " + (wi + 1) + " · " + range));
      if (logged.length === 0) row.appendChild(el("div", "wk-vals muted", "нет записей"));
      else { var vals = el("div", "wk-vals"); vals.innerHTML = "<b>" + fmt(rnd(agg.kcal / n)) + "</b> ккал/д · Б " + rnd(agg.p / n) + " · Ж " + rnd(agg.f / n) + " · У " + rnd(agg.c / n) + " <span class='wk-days'>(" + logged.length + " дн.)</span>"; row.appendChild(vals); }
      wk.appendChild(row);
    });

    var monKeys = Object.keys(state.days).filter(function (k) { return k.indexOf(calY + "-" + pad2(calM + 1) + "-") === 0 && Array.isArray(state.days[k]) && state.days[k].length; });
    var mo = $("mo-summary");
    if (monKeys.length === 0) { mo.innerHTML = "<div class='tk-empty'>За этот месяц записей нет.</div>"; return; }
    var sum = { kcal: 0, p: 0, f: 0, c: 0 };
    monKeys.forEach(function (k) { var mm = dayMacros(state.days[k]); sum.kcal += mm.kcal; sum.p += mm.p; sum.f += mm.f; sum.c += mm.c; });
    var nn = monKeys.length, diff = sum.kcal / nn - d.kcal;
    mo.innerHTML = "";
    [{ l: "Дней записано", v: nn, s: "из " + days }, { l: "Ккал/день", v: fmt(rnd(sum.kcal / nn)), s: (Math.abs(diff) < 80 ? "в цель" : (diff > 0 ? "+" + rnd(diff) : rnd(diff))) }, { l: "Белок/день", v: rnd(sum.p / nn), s: "цель " + d.p }, { l: "Ж / У в день", v: rnd(sum.f / nn) + " / " + rnd(sum.c / nn), s: "г" }].forEach(function (t) { var k = el("div", "kpi"); k.appendChild(el("span", "k-label", t.l)); var v = el("span", "k-val"); v.innerHTML = t.v + " <small>" + t.s + "</small>"; k.appendChild(v); mo.appendChild(k); });
  }

  /* ══════════ render: план ══════════ */
  function renderPlan() {
    var host = $("plan-meals"); host.innerHTML = "";
    PLAN_MEALS.forEach(function (meal) {
      var card = el("div", "plan-meal"); card.appendChild(el("div", "plan-meal-name", meal.name));
      meal.options.forEach(function (o) {
        var row = el("div", "plan-opt"); row.appendChild(el("span", "plan-key", o.k));
        var body = el("div", "plan-body"); body.appendChild(el("div", "plan-what", o.what));
        var meta = el("div", "plan-meta");
        meta.appendChild(el("span", "plan-tag" + (o.cook === 0 ? " zero" : ""), o.cook === 0 ? "0 мин" : o.cook + " мин у плиты"));
        meta.appendChild(el("span", "plan-macros", fmt(o.kcal) + " ккал · Б " + o.p + " · Ж " + o.f + " · У " + o.c));
        body.appendChild(meta); row.appendChild(body);
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

  function showView(name) {
    view = name;
    $("view-day").hidden = name !== "day"; $("view-cal").hidden = name !== "cal"; $("view-plan").hidden = name !== "plan";
    Array.prototype.forEach.call(document.querySelectorAll(".tab"), function (t) { t.classList.toggle("active", t.getAttribute("data-view") === name); });
    if (name === "cal") renderCalendar();
    if (name === "day") { renderDateNav(); renderTracker(); renderHistory(); }
    window.scrollTo(0, 0);
  }
  function renderAll() { renderKpi(); renderDateNav(); renderTracker(); renderLibrary(); renderHistory(); renderAuth(); updateSavebar(); if (view === "cal") renderCalendar(); }

  /* ══════════ export / import ══════════ */
  function exportData() { commitDay(); var blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" }); var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "ration-" + todayStr() + ".json"; a.click(); URL.revokeObjectURL(a.href); }
  function importData(file) {
    var r = new FileReader();
    r.onload = function () {
      try { var o = JSON.parse(r.result); if (!o || !o.days) throw new Error("bad"); state = { days: o.days, norm: o.norm || null, customProducts: Array.isArray(o.customProducts) ? o.customProducts : [], sharedCache: sharedProducts || [], updatedAt: Date.now() }; hydrateDay(selectedDate, false); saveLocal(); pendingCloud = true; renderAll(); banner("Данные импортированы ✓. Нажми «Сохранить», чтобы отправить в облако.", "ok"); }
      catch (e) { banner("Не удалось прочитать файл — это не наш экспорт.", "warn"); }
    };
    r.readAsText(file);
  }

  /* ══════════ init ══════════ */
  function setup() {
    Array.prototype.forEach.call(document.querySelectorAll(".tab"), function (t) { t.addEventListener("click", function () { showView(t.getAttribute("data-view")); }); });

    // норма
    $("norm-edit").addEventListener("click", function () { var f = $("norm-form"); f.hidden = !f.hidden; if (!f.hidden) fillNormForm(); });
    $("norm-ok").addEventListener("click", saveNorm);

    // даты
    $("date-prev").addEventListener("click", function () { shiftDate(-1); });
    $("date-next").addEventListener("click", function () { shiftDate(1); });
    $("date-today").addEventListener("click", function () { setDate(todayStr()); });
    $("date-input").addEventListener("change", function (e) { if (e.target.value) setDate(e.target.value); });

    // календарь
    var now = new Date(); calY = now.getFullYear(); calM = now.getMonth();
    $("cal-prev").addEventListener("click", function () { calM--; if (calM < 0) { calM = 11; calY--; } renderCalendar(); });
    $("cal-next").addEventListener("click", function () { calM++; if (calM > 11) { calM = 0; calY++; } renderCalendar(); });

    // приёмы
    var mc = $("tk-mealchips"); MEAL_NAMES.forEach(function (nm) { var b = el("button", "tk-chip", "+ " + nm); b.type = "button"; b.addEventListener("click", function () { addMeal(nm); }); mc.appendChild(b); });
    renderLibrary(); renderPlan();

    // форма своего продукта: «в день» (разово) и «в базу» (в библиотеку)
    function readForm() { var kcal = parseFloat($("tk-f-kcal").value); return { name: $("tk-f-name").value.trim(), kcal: kcal, p: parseFloat($("tk-f-p").value) || 0, f: parseFloat($("tk-f-f").value) || 0, c: parseFloat($("tk-f-c").value) || 0 }; }
    function clearForm() { $("tk-form").reset(); $("tk-f-name").focus(); }
    $("tk-add-day").addEventListener("click", function () { var o = readForm(); if (isNaN(o.kcal)) { $("tk-f-kcal").focus(); return; } o.name = o.name || "Продукт"; addProduct(o); clearForm(); });
    $("tk-form").addEventListener("submit", function (e) { e.preventDefault(); var o = readForm(); if (!o.name) { $("tk-f-name").focus(); return; } if (isNaN(o.kcal)) { $("tk-f-kcal").focus(); return; } if (addCustomProduct(o)) clearForm(); });

    // поиск USDA (живой, по мере ввода). Работает через прокси в проде или
    // напрямую при заданном локальном ключе.
    $("usda-q").addEventListener("input", function (e) {
      var q = e.target.value.trim();
      clearTimeout(usdaTimer);
      if (q.length < 2) { usdaSeq++; $("usda-status").textContent = ""; $("usda-results").innerHTML = ""; return; }
      usdaTimer = setTimeout(function () { usdaSearch(q); }, 350);
    });

    // очистка / перенос
    $("tk-reset").addEventListener("click", resetDay);
    $("move-toggle").addEventListener("click", function () { var b = $("move-box"); b.hidden = !b.hidden; if (!b.hidden) { var y = parseKey(selectedDate); y.setDate(y.getDate() - 1); $("move-date").value = keyOf(y); } });
    $("move-go").addEventListener("click", function () { moveDay($("move-date").value); });

    // сохранение в облако
    $("save-btn").addEventListener("click", saveCloud);
    window.addEventListener("beforeunload", function (e) { if (session && pendingCloud) { e.preventDefault(); e.returnValue = ""; } });
    // Вернулись во вкладку — подтянем свежее (вдруг из чата что-то записали).
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden && session && !pendingCloud) pullRemote();
    });

    $("tk-persist").textContent = HAS_CFG ? "Локально сохраняется сразу. В облако — по кнопке «Сохранить»." : "Локально в этом браузере.";
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
