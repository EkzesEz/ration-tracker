// Прокси к USDA FoodData Central. Ключ берётся из переменной окружения
// USDA_API_KEY (задаётся в Netlify → Site settings → Environment variables) и
// НИКОГДА не отдаётся в браузер. Клиент зовёт /.netlify/functions/usda?q=...
exports.handler = async function (event) {
  const q = (event.queryStringParameters && event.queryStringParameters.q || "").trim();
  const cors = { "content-type": "application/json", "access-control-allow-origin": "*" };
  if (q.length < 2) return { statusCode: 400, headers: cors, body: JSON.stringify({ error: "query too short" }) };

  const key = process.env.USDA_API_KEY;
  if (!key) return { statusCode: 500, headers: cors, body: JSON.stringify({ error: "USDA_API_KEY not set on server" }) };

  const url = "https://api.nal.usda.gov/fdc/v1/foods/search?api_key=" + encodeURIComponent(key) +
    "&query=" + encodeURIComponent(q) + "&pageSize=15&dataType=" + encodeURIComponent("Foundation,SR Legacy");

  try {
    const r = await fetch(url);
    if (!r.ok) return { statusCode: r.status, headers: cors, body: JSON.stringify({ error: "USDA HTTP " + r.status }) };
    const j = await r.json();
    // Отдаём только нужные поля (имя + нутриенты), чтобы не гонять лишнее.
    const foods = (j.foods || []).map(function (f) {
      return {
        description: f.description,
        foodNutrients: (f.foodNutrients || []).map(function (n) {
          return { nutrientNumber: n.nutrientNumber, nutrientId: n.nutrientId, value: n.value };
        })
      };
    });
    return {
      statusCode: 200,
      headers: Object.assign({ "cache-control": "public, max-age=300" }, cors),
      body: JSON.stringify({ totalHits: j.totalHits, foods: foods })
    };
  } catch (e) {
    return { statusCode: 502, headers: cors, body: JSON.stringify({ error: String(e) }) };
  }
};
