"use client";
import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { Game, Method, Rates, STORES, Store, ars, best, cheapestMethod, discount, toArs, usd } from "@/lib/pricing";
import { SupportCard } from "./Support";

const RANGES: [string, number, number][] = [["Cualquier precio", 0, 1e9], ["Hasta US$ 10", 0, 10], ["US$ 10 a 30", 10, 30], ["US$ 30 a 60", 30, 60], ["Más de US$ 60", 60, 1e9]];
const PAGE = 24;

export default function Catalog({ games, methods, rates }: { games: Game[]; methods: Method[]; rates: Rates }) {
  const [q, setQ] = useState(""); const dq = useDeferredValue(q);
  const [store, setStore] = useState<"" | Store>(""); const [range, setRange] = useState(0);
  const [sale, setSale] = useState(false); const [genre, setGenre] = useState(""); const [sort, setSort] = useState("name"); const [n, setN] = useState(PAGE);
  const genres = useMemo(() => [...new Set(games.map((g) => g.genre))].sort(), [games]);

  const list = useMemo(() => {
    const term = dq.trim().toLowerCase(); const [, lo, hi] = RANGES[range];
    const view = games.map((g) => ({ g, o: store ? g.offers.find((o) => o.store === store) : best(g) })).filter((x) => x.o) as { g: Game; o: Game["offers"][0] }[];
    const out = view.filter(({ g, o }) => (!term || g.title.toLowerCase().includes(term)) && (!genre || g.genre === genre) && (!sale || discount(o) > 0) && o.usd >= lo && o.usd <= hi);
    const key = { name: (a: typeof out[0], b: typeof out[0]) => a.g.title.localeCompare(b.g.title), price: (a: typeof out[0], b: typeof out[0]) => a.o.usd - b.o.usd, disc: (a: typeof out[0], b: typeof out[0]) => discount(b.o) - discount(a.o) }[sort]!;
    return out.sort(key);
  }, [games, dq, store, range, sale, genre, sort]);

  const reset = <T,>(f: (v: T) => void) => (v: T) => { f(v); setN(PAGE); };
  return (
    <section id="catalogo" className="mx-auto max-w-[1200px] px-4 pb-16">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        <input aria-label="Buscar" value={q} onChange={(e) => reset(setQ)(e.target.value)} placeholder="Buscar juego…" className="field col-span-2 px-3 py-2 sm:col-span-3 lg:col-span-2" />
        <select aria-label="Tienda" value={store} onChange={(e) => reset(setStore)(e.target.value as Store | "")} className="field px-2 py-2"><option value="">Todas las tiendas</option>{Object.entries(STORES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
        <select aria-label="Precio" value={range} onChange={(e) => reset(setRange)(+e.target.value)} className="field px-2 py-2">{RANGES.map((r, i) => <option key={i} value={i}>{r[0]}</option>)}</select>
        <select aria-label="Género" value={genre} onChange={(e) => reset(setGenre)(e.target.value)} className="field px-2 py-2"><option value="">Todos los géneros</option>{genres.map((g) => <option key={g}>{g}</option>)}</select>
        <select aria-label="Orden" value={sort} onChange={(e) => setSort(e.target.value)} className="field px-2 py-2"><option value="name">Nombre</option><option value="price">Menor precio</option><option value="disc">Mayor descuento</option></select>
      </div>
      <label className="mt-3 flex items-center gap-2 text-sm text-sub"><input type="checkbox" checked={sale} onChange={(e) => reset(setSale)(e.target.checked)} /> Solo en oferta</label>
      <p className="mono mt-3 text-xs text-mute">{list.length} juegos · Precios estimados, pueden variar</p>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.slice(0, n).flatMap(({ g, o }, i) => {
          const win = cheapestMethod(o.usd, methods, rates); const d = discount(o);
          const card = (
            <Link key={g.id} href={`/juego/${g.id}`} className="key block overflow-hidden transition hover:-translate-y-0.5">
              <div className="relative aspect-[460/215] bg-badge">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.image} alt={g.title} loading="lazy" className="h-full w-full object-cover" />
                {d > 0 && <span className="mono absolute right-2 top-2 rounded-full bg-coral px-2 py-0.5 text-xs font-medium text-black">-{d}%</span>}
              </div>
              <div className="p-4">
                <h3 className="truncate font-semibold">{g.title}</h3>
                <p className="mono mt-1 text-xs text-sub">{STORES[o.store]} · {usd(o.usd)} {d > 0 && <s className="text-mute">{usd(o.base)}</s>}</p>
                <ul className="mt-3 space-y-1">
                  {methods.map((m) => (
                    <li key={m.id} className="flex items-center justify-between text-sm">
                      <span className="text-sub">{m.name} {m.id === win && <span className="pill mono ml-1 px-2 py-0.5 text-[10px] text-coral">más barato</span>}</span>
                      <span className="mono">{ars(toArs(o.usd, m, rates))}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          );
          return i === 5 ? [card, <SupportCard key="support" />] : [card];
        })}
      </div>
      {list.length === 0 && <p className="mt-8 text-center text-sub">No hay juegos con esos filtros. Probá sacar alguno.</p>}
      {n < list.length && <div className="mt-8 text-center"><button className="btn px-4 py-2" onClick={() => setN(n + PAGE)}>Mostrar más</button></div>}
    </section>
  );
}
