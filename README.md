# Juega en pesos

Next.js 15 + Tailwind v4 + TypeScript. Compara precios de juegos de PC (Steam, Epic, Xbox PC) y los muestra en ARS según el medio de pago.

## Probar local (sin API keys)
```bash
npm install
npm run dev
```
Usa `data/games.sample.json` (20 juegos de ejemplo, precios inventados). Las cotizaciones vienen de dolarapi.com (sin key, caché de 30 min).

## Variables de entorno
| Variable | Para qué |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL pública (sitemap, Open Graph) |
| `ITAD_API_KEY` | Opcional, para ampliar el sync con IsThereAnyDeal |

## Costos de cada medio de pago
Todo está en `config/payment-methods.json`. Fórmula: `ARS = USD × cotización × (1 + taxes) × (1 + fee)`. Los valores iniciales están marcados `"verify": true`: **verificalos antes de publicar**.

## Catálogo real
`npm run sync` baja miles de ofertas de Steam y Epic desde la API de CheapShark y genera `data/games.json` (si existe, se usa en lugar del ejemplo). Corrélo con un cron (por ej. GitHub Actions diario que commitee el archivo y dispare un redeploy).

## Xbox
No hay API pública usable: el adaptador está en `lib/adapters/xbox.ts`, vacío.

## ElectricLogo
`components/ElectricLogo.tsx` es un placeholder con las mismas props. Reemplazalo por tu componente y poné tu SVG en `public/logo.svg`.

## Deploy en Vercel
1. Subí el repo a GitHub. 2. En Vercel: *Add New → Project* e importalo. 3. Cargá `NEXT_PUBLIC_SITE_URL`. 4. Deploy.
