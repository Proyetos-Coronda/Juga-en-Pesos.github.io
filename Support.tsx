export const CAFECITO = "https://cafecito.app/proyectitos";
export function CafeButton() {
  return <a href={CAFECITO} target="_blank" rel="noopener" className="btn px-3 py-2 text-sm whitespace-nowrap">Invitame un cafecito ☕</a>;
}
export function SupportCard() {
  return (
    <div className="key col-span-full flex flex-col items-start justify-between gap-3 p-4 sm:flex-row sm:items-center">
      <p className="text-sm text-sub">¿Te ahorró unos pesos? Esta web es gratis y la mantiene una sola persona.</p>
      <CafeButton />
    </div>
  );
}
