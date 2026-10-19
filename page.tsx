import Catalog from "@/components/Catalog";
import ElectricLogo from "@/components/ElectricLogo";
import { getGames, getMethods } from "@/lib/games";
import { fmtDate, getRates } from "@/lib/rates";

export const revalidate = 1800;

export default async function Home() {
  const [rates, games, methods] = [await getRates(), getGames(), getMethods()];
  return (
    <main>
      <section className="relative overflow-hidden px-4 pb-10 pt-32 text-center">
        <div aria-hidden className="absolute inset-0 -z-10 opacity-60 blur-3xl" style={{ background: "radial-gradient(40% 50% at 25% 20%, #2b5cff55, transparent), radial-gradient(40% 50% at 75% 30%, #ff636355, transparent)" }} />
        <div className="mx-auto h-[160px] w-[160px] relative">
          <ElectricLogo src="/logo.svg" color="#f43f5e" glowColor="#ffffff" scale={0.7} strands={4} bend={0.6} crackle={1.5} arcs={1} speed={2.5} interactive intensity={1} glow={1} thickness={1.5} flicker={0.6} fill={0} cursorIntensity={0.75} cursorRadius={100} />
        </div>
        <h1 className="mx-auto mt-4 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">Cuánto te sale el juego, en pesos de verdad</h1>
        <p className="mx-auto mt-3 max-w-xl text-sub">Steam, Epic y Xbox PC comparados según cómo pagues: Lemon, Mercado Pago, AstroPay o Ualá.</p>
        <a href="#catalogo" className="btn mt-6 inline-block px-5 py-3">Buscar un juego</a>
        <p className="mono mt-6 text-xs text-mute">
          Oficial {rates.values.oficial} · Tarjeta {rates.values.tarjeta} · MEP {rates.values.bolsa} · Cripto {rates.values.cripto} — actualizado {fmtDate(rates.updated)}
          {rates.fallback && " (cotización de respaldo: dolarapi no respondió)"}
        </p>
      </section>
      <Catalog games={games} methods={methods} rates={rates} />
    </main>
  );
}
