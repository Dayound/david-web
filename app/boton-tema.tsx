"use client";

// Botón para cambiar entre modo claro y oscuro.
// Es un componente "de cliente" porque necesita el navegador para funcionar.
export default function BotonTema() {
  function cambiarTema() {
    const oscuro = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("tema", oscuro ? "dark" : "light");
    } catch {}
  }

  return (
    <button
      onClick={cambiarTema}
      aria-label="Cambiar entre modo claro y oscuro"
      className="rounded-full border border-black/10 px-3 py-1.5 text-sm transition-colors hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
    >
      <span className="dark:hidden">🌙 Oscuro</span>
      <span className="hidden dark:inline">☀️ Claro</span>
    </button>
  );
}
