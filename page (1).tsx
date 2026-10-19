import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getGames, getMethods } from "@/lib/games";
import { fmtDate, getRates } from "@/lib/rates";
import { STORES, ars, best, cheapestMethod, discount, toArs, usd } from "@/lib/pricing";

export const revalidate = 1800;
export const dynamicParams = true;
export const generateStaticParams = () => getGames().slice(0, 500).map((g) => ({ id: g.id }));
const find = (id: string) => getGames().find((g) => g.id === id);

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const g = find((await params).id); if (!g) return {};
  const title = `${g.title} en pesos argentinos`;
  const description = `Precio de ${g.title} desde ${usd(best(g).usd)} en Steam, Epic y Xbox PC, y cuánto sale en ARS con cada billetera.`;
  return { title, description, openGraph: { title, description, images: [g.image] }, alternates: { canonical: `/juego/${g.id}` } };
}

export default async function Detail({ params }: { params: Promise<{ id: string }> }) {
  const g = find((await params).id); if (!g) notFound();
  const [rates, methods] = [await getRates(), getMethods()];
  const top = best(g);
  return (
    <main className="mx-auto max-w-[1200px] px-4 pb-16 pt-28">
      <Link href="/" className="text-sm text-sub hover:text-fg">← Volver al catálogo</Link>
      <div className="mt-4 grid gap-6 md:grid-cols-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={g.image} alt={g.title} className="key w-full object-cover" />
        <div><h1 className="text-3xl font-semibold">{g.title}</h1><p className="mono mt-2 text-sm text-sub">{g.genre} · mejor precio: {STORES[top.store]} {usd(top.usd)}</p></div>
      </div>

      <h2 className="mt-10 text-xl font-semibold">Tiendas</h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-3">
        {g.offers.map((o) => (
          <div key={o.store} className="key p-4">
            <p className="font-medium">{STORES[o.store]} {o === top && <span className="pill mono ml-1 px-2 py-0.5 text-[10px] text-coral">más barata</span>}</p>
            <p className="mono mt-1 text-lg">{usd(o.usd)} {discount(o) > 0 && <span className="text-xs text-coral">-{discount(o)}%</span>}</p>
            <a href={o.url} target="_blank" rel="noopener nofollow" className="btn mt-3 inline-block px-3 py-2 text-sm">Ir a la tienda</a>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-xl font-semibold">Pagando con… te sale</h2>
      <div className="key mt-3 overflow-x-auto">
        <table className="mono w-full min-w-[480px] text-sm">
          <thead><tr className="text-left text-sub"><th className="p-3">Medio</th>{g.offers.map((o) => <th key={o.store} className="p-3">{STORES[o.store]}</th>)}</tr></thead>
          <tbody>{methods.map((m) => (
            <tr key={m.id} className="border-t border-line">
              <td className="p-3 font-sans">{m.name}</td>
              {g.offers.map((o) => <td key={o.store} className="p-3">{ars(toArs(o.usd, m, rates))}{m.id === cheapestMethod(o.usd, methods, rates) && <span className="pill ml-2 px-2 py-0.5 text-[10px] text-coral">mín.</span>}</td>)}
            </tr>))}</tbody>
        </table>
      </div>
      <p className="mono mt-4 text-xs text-mute">Precios estimados, pueden variar. Cotizaciones al {fmtDate(rates.updated)}.</p>
    </main>
  );
}
