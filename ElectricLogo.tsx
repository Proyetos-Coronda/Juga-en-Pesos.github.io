"use client";
// PLACEHOLDER: reemplazá este archivo por tu ElectricLogo real (mismo nombre y props).
// Esta versión acepta las mismas props y muestra el logo con un resplandor simple.
type Props = { src: string; color?: string; glowColor?: string; scale?: number; glow?: number; flicker?: number; [k: string]: unknown };
export default function ElectricLogo({ src, color = "#ff6363", scale = 0.7, glow = 1, flicker = 0.6 }: Props) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <img src={src} alt="Juega en pesos" style={{ height: `${scale * 100}%`, filter: `drop-shadow(0 0 ${18 * glow}px ${color})`, animation: flicker ? "flick 3s infinite" : undefined }} />
    </div>
  );
}
