// Trae el catálogo desde la API oficial de CheapShark (Steam=1, Epic=25) y arma data/games.json
import fs from "node:fs";
const STORE = { 1: "steam", 25: "epic" };
const slug = (t) => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const games = new Map();
for (let page = 0; page < 50; page++) {
  const res = await fetch(`https://www.cheapshark.com/api/1.0/deals?storeID=1,25&pageSize=60&pageNumber=${page}`);
  const deals = await res.json();
  if (!Array.isArray(deals) || !deals.length) break;
  for (const d of deals) {
    const id = slug(d.title); if (!id) continue;
    const g = games.get(id) ?? { id, title: d.title, genre: "Varios", image: d.thumb, offers: [] };
    const store = STORE[d.storeID]; if (!store || g.offers.some((o) => o.store === store)) continue;
    g.offers.push({ store, usd: +d.salePrice, base: +d.normalPrice, url: `https://www.cheapshark.com/redirect?dealID=${d.dealID}` });
    games.set(id, g);
  }
  await new Promise((r) => setTimeout(r, 1000));
}
fs.writeFileSync("data/games.json", JSON.stringify([...games.values()]));
console.log(`${games.size} juegos guardados`);
