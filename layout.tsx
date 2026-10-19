import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { CafeButton } from "@/components/Support";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: "Juega en pesos · Precios de juegos de PC en ARS", template: "%s · Juega en pesos" },
  description: "Compará Steam, Epic y Xbox PC y mirá cuánto te sale en pesos con Lemon, Mercado Pago, AstroPay y Ualá.",
  openGraph: { type: "website", locale: "es_AR", siteName: "Juega en pesos", images: ["/logo.svg"] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${inter.variable} ${mono.variable}`}>
      <body className="min-h-screen">
        <header className="fixed inset-x-0 top-4 z-50 px-4">
          <div className="mx-auto flex max-w-[1200px] items-center justify-between rounded-full border border-line bg-black/50 px-4 py-2 backdrop-blur-md">
            <Link href="/" className="flex items-center gap-2 font-semibold"><img src="/logo.svg" alt="" className="h-6" />Juega en pesos</Link>
            <CafeButton />
          </div>
        </header>
        {children}
        <footer className="border-t border-line px-4 py-8">
          <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="mono text-xs text-mute">Precios estimados, pueden variar. Cotizaciones de dolarapi.com. No afiliado a Steam, Epic ni Microsoft.</p>
            <CafeButton />
          </div>
        </footer>
      </body>
    </html>
  );
}
