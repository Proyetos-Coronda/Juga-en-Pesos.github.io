export type Method = { id: string; name: string; rate: "oficial" | "tarjeta" | "bolsa" | "cripto"; taxes: number; fee: number; verify?: boolean };
export type Rates = { values: Record<string, number>; updated: string; fallback: boolean };
export type Store = "steam" | "epic" | "xbox";
export type Offer = { store: Store; usd: number; base: number; url: string };
export type Game = { id: string; title: string; genre: string; image: string; offers: Offer[] };
export const STORES: Record<Store, string> = { steam: "Steam", epic: "Epic Games", xbox: "Xbox PC" };
// ARS = USD × cotización × (1 + impuestos) × (1 + comisión)
export const toArs = (usd: number, m: Method, r: Rates) => usd * (r.values[m.rate] ?? 0) * (1 + m.taxes) * (1 + m.fee);
export const ars = (n: number) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
export const usd = (n: number) => `US$ ${n.toFixed(2)}`;
export const best = (g: Game) => g.offers.reduce((a, b) => (b.usd < a.usd ? b : a));
export const discount = (o: Offer) => (o.base > o.usd ? Math.round((1 - o.usd / o.base) * 100) : 0);
export const cheapestMethod = (u: number, ms: Method[], r: Rates) => ms.reduce((a, b) => (toArs(u, b, r) < toArs(u, a, r) ? b : a)).id;
