import type { Offer } from "../pricing";
// Xbox/Microsoft Store PC no tiene API pública oficial para precios por región.
// Adaptador listo: implementá esta función cuando tengas una fuente con licencia.
export async function xboxOffers(_title: string): Promise<Offer[]> { return []; }
