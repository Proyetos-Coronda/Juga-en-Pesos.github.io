import type { Rates } from "./pricing";
const FALLBACK = { oficial: 1400, tarjeta: 1820, bolsa: 1450, cripto: 1460 }; // solo si la API falla
export async function getRates(): Promise<Rates> {
  try {
    const res = await fetch("https://dolarapi.com/v1/dolares", { next: { revalidate: 1800 } });
    if (!res.ok) throw new Error();
    const list: { casa: string; venta: number; fechaActualizacion: string }[] = await res.json();
    const values: Record<string, number> = {};
    let updated = "";
    for (const d of list) { values[d.casa] = d.venta; if (d.fechaActualizacion > updated) updated = d.fechaActualizacion; }
    return { values, updated, fallback: false };
  } catch {
    return { values: FALLBACK, updated: new Date().toISOString(), fallback: true };
  }
}
export const fmtDate = (iso: string) => new Date(iso).toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires", dateStyle: "short", timeStyle: "short" });
