import fs from "node:fs";
import path from "node:path";
import sample from "@/data/games.sample.json";
import methods from "@/config/payment-methods.json";
import type { Game, Method } from "./pricing";
export const getMethods = () => methods.methods as Method[];
// Si existe data/games.json (generado con `npm run sync`) se usa ese; si no, los datos de ejemplo.
export function getGames(): Game[] {
  try {
    const p = path.join(process.cwd(), "data/games.json");
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {}
  return sample as unknown as Game[];
}
